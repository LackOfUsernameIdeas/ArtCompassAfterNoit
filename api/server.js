const express = require("express");
const { spawn } = require("child_process");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const db = require("./database");
const hf = require("./helper_functions");
const pythonPath = require("./config.js").pythonPath;
const pythonPathLocal = require("./config.js").pythonPathLocal;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
require("dotenv").config();

const whitelist = [
  "http://localhost:5174",
  "http://localhost:5175",
  "https://artcompass.noit.eu",
  "http://artcompass.noit.eu"
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

let verificationCodes = {};

const SECRET_KEY = "1a2b3c4d5e6f7g8h9i0jklmnopqrstuvwxyz123456";
const EMAIL_USER = "no-reply@artcompass-api.noit.eu";
const EMAIL_PASS = "Noit_2025";

// Създаване на транспортерен обект с използване на SMTP транспорт
const transporter = nodemailer.createTransport({
  host: "artcompass-api.noit.eu", // Заменете с вашия cPanel mail сървър
  port: 587, // Използвайте 465 за SSL или 587 за TLS
  secure: false, // true за SSL (порт 465), false за TLS (порт 587)
  auth: {
    user: EMAIL_USER, // Вашият имейл адрес
    pass: EMAIL_PASS // Вашата имейл парола
  },
  debug: true // По избор, логва SMTP комуникацията за откриване на проблеми
});

// Рут за регистрация
app.post("/signup", (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Проверка дали имейлът вече съществува в базата данни
  db.checkEmailExists(email, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Грешка при заявката към базата данни" });

    if (result.length > 0) {
      return res
        .status(400)
        .json({ error: "Профил с този имейл вече съществува." });
    }

    // Генериране на код за потвърждение
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    // Временно съхранение на кода
    verificationCodes[email] = {
      code: verificationCode,
      firstName,
      lastName,
      password, // Временно съхранение на паролата
      expiresAt: Date.now() + 15 * 60 * 1000 // Задаване на валидност от 15 минути
    };

    // Изпращане на кода за потвърждение по имейл
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "Шестцифрен код за потвърждение от Арт Компас",
      html: `
        <div style="text-align: center; background-color: rgba(244, 211, 139, 0.5); margin: 2% 3%; padding: 3% 1%; border: 4px dotted rgb(178, 50, 0); border-radius: 20px">
          <h2>Благодарим Ви за регистрацията в Арт Компас!</h2>
          <hr style="border: 0.5px solid rgb(178, 50, 0); width: 18%; margin-top: 6%; margin-bottom: 4%"></hr>
          <p>Вашият шестцифрен код е <strong style="font-size: 20px; color: rgb(178, 50, 0)">${verificationCode}</strong>.</p>
        </div>
        <div>
          <p style="border-radius: 5px; background-color: rgba(178, 50, 0, 0.2); text-align: center; font-size: 13px; margin: 5% 25% 0% 25%">Не сте поискали код? Игнорирайте този имейл.</p>
        </div>`
    };

    // Изпращане на имейла с кода за потвърждение
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("грешка: ", error);
        return res
          .status(500)
          .json({ error: "Не успяхме да изпратим имейл! :(" });
      }
      res.json({
        message: "Кодът за потвърждение е изпратен на вашия имейл!"
      });
    });
  });
});

const MAX_REQUESTS_PER_DAY = 20;
let userRequests = {};

app.post("/handle-submit", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ error: "Липсва токен" });
  }

  const { type } = req.body;

  if (!type || (type !== "movies_series" && type !== "books")) {
    return res
      .status(400)
      .json({ error: "Невалиден или липсващ 'type' параметър в заявката" });
  }

  // Верификация и декодиране на токена
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Невалиден токен" });
    }

    const userId = decoded.id; // Извличане на потребителското ID от токена

    // Уверете се, че заявките се нулират ежедневно
    hf.checkAndResetRequestsDaily(userRequests);

    // Инициализация на данни за потребителя, ако не съществуват
    if (!userRequests[userId]) {
      userRequests[userId] = {
        movies_series: { count: 0 },
        books: { count: 0 }
      };
    }

    // Проверка на броя заявки за конкретния тип
    if (userRequests[userId][type].count >= MAX_REQUESTS_PER_DAY) {
      return res.status(400).json({
        error: `Превишихте максималния лимит от заявки за ${type} днес!`
      });
    }

    // Увеличаване на броя заявки за конкретния тип
    userRequests[userId][type].count += 1;
    userRequests[userId][type].lastRequestTime = new Date().toLocaleString();

    console.log(
      `✨✨✨ НОВО ГЕНЕРИРАНЕ! ✨✨✨\n🚀 Текущ брой на генерирания за ${type}: ${userRequests[userId][type].count}\n⏰ ${userRequests[userId][type].lastRequestTime}`
    );
    res.json({ message: `Заявката за ${type} беше успешно обработена!` });
  });
});

// Препращане на код, ако не е получен такъв
app.post("/resend", (req, res) => {
  const { email } = req.body;

  // Генерира код за потвърждение
  const verificationCode = crypto.randomInt(100000, 999999).toString();

  // Съхранява кода временно
  verificationCodes[email] = {
    ...verificationCodes[email],
    code: verificationCode,
    expiresAt: Date.now() + 15 * 60 * 1000 // Задава 15 минути валидност
  };

  // Изпраща нов код за потвърждение по имейл
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "Нов шестцифрен код за потвърждение от Арт Компас",
    html: `
      <div style="text-align: center; background-color: rgba(244, 211, 139, 0.5); margin: 2% 3%; padding: 3% 1%; border: 4px dotted rgb(178, 50, 0); border-radius: 20px">
        <p>Вашият шестцифрен код е <strong style="font-size: 20px; color: rgb(178, 50, 0)">${verificationCode}</strong>.</p>
      </div>
      <div>
        <p style="border-radius: 5px; background-color: rgba(178, 50, 0, 0.2); text-align: center; font-size: 13px; margin: 5% 25% 0% 25%">Не сте поискали код? Игнорирайте този имейл.</p>
      </div>`
  };

  console.log(verificationCodes[email]);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error)
      return res
        .status(500)
        .json({ error: "Не успяхме да изпратим имейл! :(" });
    res.json({ message: "Кодът за потвърждение е изпратен на вашия имейл!" });
  });
});

// Верификация на имейл
app.post("/verify-email", (req, res) => {
  const { email, verificationCode } = req.body;

  const storedData = verificationCodes[email];
  if (!storedData) {
    return res
      .status(400)
      .json({ error: "Не е намерен код за потвърждение за този имейл." });
  }

  if (Date.now() > storedData.expiresAt) {
    delete verificationCodes[email];
    return res.status(400).json({ error: "Кодът за потвърждение е изтекъл." });
  }

  if (storedData.code !== verificationCode) {
    return res.status(400).json({ error: "Невалиден код за потвърждение." });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(storedData.password, salt);

  db.createUser(
    storedData.firstName,
    storedData.lastName,
    email,
    hashedPassword,
    (err, result) => {
      if (err) return res.status(400).json({ error: err.message });

      // Изтрива кода след регистрация
      delete verificationCodes[email];
      console.log(`
        ===================================
        🚀 NEW ACCOUNT CREATED! 🎉
        ===================================
        🟢 First Name: ${storedData.firstName}
        🟢 Last Name: ${storedData.lastName}
        📧 Email: ${email}
        📅 Date & Time: ${new Date().toLocaleString()}
        ===================================
        `);
      res.json({ message: "Успешно регистриран профил!" });
    }
  );
});

// Влизане в профил
app.post("/signin", (req, res) => {
  const { email, password, rememberMe } = req.body;

  db.findUserByEmail(email, (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    if (result.length === 0)
      return res
        .status(400)
        .json({ error: "Не съществува потребител с този имейл адрес!" });

    const user = result[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ error: "Въведената парола е грешна или непълна!" });

    const token = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: rememberMe ? "7d" : "2h"
    });

    console.log(`
      ===================================
      🔑 USER LOGGED IN  
      ===================================
      🟢 First Name: ${user.first_name}
      🟢 Last Name: ${user.last_name}
      📧 Email: ${email}
      📅 Date & Time: ${new Date().toLocaleString()}
      ===================================
      `);

    res.json({ message: "Успешно влизане!", token });
  });
});

// Страница за заявяване на смяна на паролата
app.post("/password-reset-request", (req, res) => {
  const { email } = req.body;

  db.findUserByEmail(email, (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    if (result.length === 0)
      return res
        .status(400)
        .json({ error: "Не съществува потребител с този имейл адрес!" });

    const user = result[0];
    const token = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: "15m"
    });

    // Create a reset link
    const resetLink = `https://artcompass.noit.eu/resetpassword/resetcover/${token}`;

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "Промяна на паролата за Арт Компас",
      html: `<p>Натиснете <a href="${resetLink}">тук</a>, за да промените паролата си.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error)
        return res
          .status(500)
          .json({ error: "Не успяхме да изпратим имейл :(" });
      res.json({
        message: "Заявката за промяна на паролата е изпратена на вашия имейл!"
      });
    });
  });
});

// Смяна на паролата
app.post("/password-reset", (req, res) => {
  const { token, newPassword } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(400).json({ error: "Invalid or expired token" });

    const userId = decoded.id;

    // Hash the new password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    db.updateUserPassword(userId, hashedPassword, (err, result) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Успешно нулиране на паролата!" });
    });
  });
});

// Валидация на JWT Token
app.post("/token-validation", (req, res) => {
  const { token } = req.body;

  jwt.verify(token, SECRET_KEY, (err) => {
    if (err) return res.json({ valid: false });
    res.json({ valid: true });
  });
});

// Взимане на основна потребителска информация
app.get("/user-data", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Взимане на токен от authorization header-а

  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });

    const userId = decoded.id;

    db.getUserById(userId, (err, result) => {
      if (err) return res.status(500).json({ error: "Database query error" });
      if (result.length === 0)
        return res
          .status(404)
          .json({ error: "Не съществува потребител с този имейл адрес!" });

      const user = result[0];
      res.json(user);
    });
  });
});

// Запазване на потребителските предпочитания
app.post("/save-preferences", (req, res) => {
  const { preferencesType, preferences } = req.body;

  if (!preferencesType || !preferences) {
    return res
      .status(400)
      .json({ error: "Preferences type and preferences are required" });
  }

  const { token, ...data } = preferences;
  // Верификация на токена и вземане на потребителското ID
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ error: "Invalid token" });
    }

    const userId = decoded.id;
    if (preferencesType === "movies_series") {
      db.saveMoviesSeriesUserPreferences(userId, data, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
          message: "User preferences for movies/series saved successfully!"
        });
      });
    } else {
      db.saveBooksUserPreferences(userId, data, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res
          .status(201)
          .json({ message: "User preferences for books saved successfully!" });
      });
    }
  });
});

// Запазване на препоръка
app.post("/save-recommendation", (req, res) => {
  const { recommendationType, recommendation } = req.body;

  if (!recommendationType || !recommendation) {
    return res
      .status(400)
      .json({ error: "Recommendation type and recommendation are required" });
  }

  const { token, ...data } = recommendation;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    if (recommendationType === "movies_series") {
      db.saveMovieSeriesRecommendation(userId, data, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
          message: "Movie/series recommendation added successfully!"
        });
      });
    } else {
      db.saveBookRecommendation(userId, data, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
          message: "Book recommendation added successfully!"
        });
      });
    }
  });
});

// Запазване на препоръка в списък за гледане
app.post("/save-to-list", (req, res) => {
  const { recommendationType, recommendation } = req.body;

  if (!recommendationType || !recommendation) {
    return res
      .status(400)
      .json({ error: "Recommendation type and recommendation are required" });
  }

  const { token, ...data } = recommendation;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    if (recommendationType === "movies_series") {
      db.saveToWatchlist(userId, data, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res
          .status(201)
          .json({ message: "Movie/Series recommendation added successfully!" });
      });
    } else {
      db.saveToReadlist(userId, data, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res
          .status(201)
          .json({ message: "Book recommendation added successfully!" });
      });
    }
  });
});

// Изтриване на препоръка от списъка за гледане
app.delete("/remove-from-list", (req, res) => {
  const { token, imdbID, source, book_id, recommendationType } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  if (!recommendationType) {
    return res.status(400).json({ error: "Recommendation type is required" });
  }

  if (recommendationType === "movies_series" && !imdbID) {
    return res.status(400).json({ error: "IMDb ID is required for movies" });
  }

  if (recommendationType === "books" && !book_id) {
    return res.status(400).json({ error: "Book ID is required for books" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;

    if (recommendationType === "movies_series") {
      db.removeFromWatchlist(userId, imdbID, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ error: "Movie/Series recommendation not found" });
        }
        res.status(200).json({
          message: "Movie/Series recommendation removed successfully!"
        });
      });
    } else {
      db.removeFromReadlist(userId, source, book_id, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ error: "Book recommendation not found" });
        }
        res
          .status(200)
          .json({ message: "Book recommendation removed successfully!" });
      });
    }
  });
});

// Изтриване на препоръка от списъка за гледане
app.post("/check-for-recommendation-in-list", (req, res) => {
  const { token, imdbID, source, book_id, recommendationType } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  if (!recommendationType) {
    return res.status(400).json({ error: "Recommendation type is required" });
  }

  if (recommendationType === "movies_series" && !imdbID) {
    return res.status(400).json({ error: "IMDb ID is required for movies" });
  }

  if (recommendationType === "books" && !book_id) {
    return res.status(400).json({ error: "Book ID is required for books" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const userId = decoded.id;

    if (recommendationType === "movies_series") {
      db.checkRecommendationExistsInWatchlist(
        userId,
        imdbID,
        (error, results) => {
          if (error) {
            return res
              .status(500)
              .json({ error: "Database error", details: error });
          }

          // Always respond with 200 and include the 'exists' flag
          return res.status(200).json({ exists: results.length > 0 });
        }
      );
    } else {
      db.checkRecommendationExistsInReadlist(
        userId,
        source,
        book_id,
        (error, results) => {
          if (error) {
            return res
              .status(500)
              .json({ error: "Database error", details: error });
          }

          // Always respond with 200 and include the 'exists' flag
          return res.status(200).json({ exists: results.length > 0 });
        }
      );
    }
  });
});

// Вземане на данни за общ брой на потребители в платформата
app.get("/stats/platform/users-count", (req, res) => {
  console.log("--Нови Препоръки--");
  db.getUsersCount((err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching users count" });
    }
    console.log("--Нови Препоръки--");
    res.json(result);
  });
});

// Вземане на данни за средна печалба на филми/сериали от билети и мета/имdb оценки в платформата
app.get("/stats/platform/average-scores", (req, res) => {
  db.getAverageBoxOfficeAndScores((err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error fetching average box office and ratings" });
    }
    res.json(result);
  });
});

// Вземане на данни за най-препоръчвани филми/сериали в платформата
app.get("/stats/platform/top-recommendations", (req, res) => {
  db.getTopRecommendationsPlatform((err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error fetching top recommendations" });
    }
    res.json(result);
  });
});

// Вземане на данни за най-препоръчвани държави, които създават филми/сериали в платформата
app.get("/stats/platform/top-countries", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  console.log("--Топ държави--");

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  db.getTopCountries(limit, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching top countries" });
    }
    console.log("--Топ държави--");
    res.json(result);
  });
});

// Вземане на данни за най-препоръчвани жанрове в платформата
app.get("/stats/platform/top-genres", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  db.getTopGenres(limit, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching top genres" });
    }
    res.json(result);
  });
});

// Вземане на данни за най-популярни жанрове във времето в платформата
app.get("/stats/platform/genre-popularity-over-time", async (req, res) => {
  console.log("--Популярност на жанровете във времето--");
  db.getGenrePopularityOverTime((err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error fetching genre popularity over time" });
    }
    console.log("--Популярност на жанровете във времето--");
    res.json(result);
  });
});

// Вземане на данни за най-препоръчвани актьори в платформата
app.get("/stats/platform/top-actors", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  console.log("--Топ препоръки--");

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  db.getTopActors(limit, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching top actors" });
    }
    console.log("--Топ препоръки--");
    res.json(result);
  });
});

// Вземане на данни за най-препоръчвани филмови режисьори в платформата
app.get("/stats/platform/top-directors", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  db.getTopDirectors(limit, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching top directors" });
    }
    res.json(result);
  });
});

// Вземане на данни за най-препоръчвани сценаристи в платформата
app.get("/stats/platform/top-writers", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  db.getTopWriters(limit, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching top writers" });
    }
    res.json(result);
  });
});

// Вземане на данни за награди оскар за всеки филм/сериал в платформата
app.get("/stats/platform/oscars-by-movie", async (req, res) => {
  db.getOscarsByMovie((err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching oscars" });
    }
    res.json(result);
  });
});

// Вземане на данни за всички награди за всеки филм/сериал в платформата
app.get("/stats/platform/total-awards-by-movie", async (req, res) => {
  db.getTotalAwardsByMovieOrSeries((err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching total awards" });
    }
    res.json(result);
  });
});

// Вземане на данни за общ брой на награди в платформата
app.get("/stats/platform/total-awards", async (req, res) => {
  db.getTotalAwardsCount((err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error fetching total awards count" });
    }
    res.json(result);
  });
});

// Вземане на данни за филмови режисьори в платформата, сортирани по успешност
app.get("/stats/platform/sorted-directors-by-prosperity", async (req, res) => {
  console.log("--Актьори, режисьори и сценаристи по Просперитет--");
  db.getSortedDirectorsByProsperity((err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching sorted directors" });
    }
    console.log("--Актьори, режисьори и сценаристи по Просперитет--");
    res.json(result);
  });
});

// Вземане на данни за актьори в платформата, сортирани по успешност
app.get("/stats/platform/sorted-actors-by-prosperity", async (req, res) => {
  db.getSortedActorsByProsperity((err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching sorted actors" });
    }
    res.json(result);
  });
});

// Вземане на данни за сценаристи в платформата, сортирани по успешност
app.get("/stats/platform/sorted-writers-by-prosperity", async (req, res) => {
  db.getSortedWritersByProsperity((err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching sorted writers" });
    }
    res.json(result);
  });
});

// Вземане на данни за филми в платформата, сортирани по успешност
app.get("/stats/platform/sorted-movies-by-prosperity", async (req, res) => {
  console.log("--Най-успешни филми по Просперитет, IMDb Рейтинг и Боксофис--");
  db.getSortedMoviesByProsperity((err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching sorted movies" });
    }
    console.log(
      "--Най-успешни филми по Просперитет, IMDb Рейтинг и Боксофис--"
    );
    res.json(result);
  });
});

// Вземане на данни за филми и сериали в платформата, сортирани по meta score
app.get(
  "/stats/platform/sorted-movies-and-series-by-metascore",
  async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    console.log("--Филми и сериали по оценки--");

    if (limit <= 0) {
      return res
        .status(400)
        .json({ error: "Лимитът трябва да е положително число." });
    }

    db.getTopMoviesAndSeriesByMetascore(limit, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching sorted movies by meta score" });
      }
      console.log("--Филми и сериали по оценки--");
      res.json(result);
    });
  }
);

// Вземане на данни за филми и сериали в платформата, сортирани по IMDb rating
app.get(
  "/stats/platform/sorted-movies-and-series-by-imdb-rating",
  async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;

    if (limit <= 0) {
      return res
        .status(400)
        .json({ error: "Лимитът трябва да е положително число." });
    }

    db.getTopMoviesAndSeriesByIMDbRating(limit, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching sorted movies by IMDb rating" });
      }
      res.json(result);
    });
  }
);

// Вземане на данни за филми и сериали в платформата, сортирани по rotten tomatoes rating
app.get(
  "/stats/platform/sorted-movies-and-series-by-rotten-tomatoes-rating",
  async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;

    if (limit <= 0) {
      return res
        .status(400)
        .json({ error: "Лимитът трябва да е положително число." });
    }

    db.getTopMoviesAndSeriesByRottenTomatoesRating(limit, (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Error fetching sorted movies by rotten tomatoes rating"
        });
      }
      res.json(result);
    });
  }
);

// Вземане на данни за най-препоръчвани филми/сериали на даден потребител
app.post("/stats/individual/top-recommendations", (req, res) => {
  const { token } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.getUsersTopRecommendations(userId, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching top recommendations" });
      }
      res.json(result);
    });
  });
});

// Вземане на данни за филми/сериали в списък за гледане на даден потребител
app.post("/stats/individual/watchlist", (req, res) => {
  const { token } = req.body;
  console.log("--Списък за гледане--");

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.getUsersWatchlist(userId, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching watchlist" });
      }
      console.log("--Списък за гледане--");
      res.json(result);
    });
  });
});

// Вземане на данни за книги в списък за четене на даден потребител
app.post("/stats/individual/readlist", (req, res) => {
  const { token } = req.body;
  console.log("--Списък за четене--");

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.getUsersReadlist(userId, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching readlist" });
      }
      console.log("--Списък за четене--");
      res.json(result);
    });
  });
});

// Вземане на данни за най-препоръчвани жанрове на даден потребител
app.post("/stats/individual/top-genres", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  console.log("--Индивидуални статистики--");

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  const { token } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.getUsersTopGenres(userId, limit, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching top genres" });
      }
      console.log("--Индивидуални статистики--");
      res.json(result);
    });
  });
});

// Вземане на данни за най-запазвани в списък за гледане жанрове на даден потребител
app.post("/stats/individual/watchlist-top-genres", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  const { token } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.getUsersTopGenresFromWatchlist(userId, limit, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching top genres from watchlist" });
      }
      res.json(result);
    });
  });
});

// Вземане на данни за най-препоръчвани актьори на даден потребител
app.post("/stats/individual/top-actors", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  const { token } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.getUsersTopActors(userId, limit, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching users top actors" });
      }
      res.json(result);
    });
  });
});

// Вземане на данни за най-запазвани в списък за гледане актьори на даден потребител
app.post("/stats/individual/watchlist-top-actors", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  const { token } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.getUsersTopActorsFromWatchlist(userId, limit, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching users watchlist top actors" });
      }
      res.json(result);
    });
  });
});

// Вземане на данни за най-препоръчвани режисьори на даден потребител
app.post("/stats/individual/top-directors", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  const { token } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.getUsersTopDirectors(userId, limit, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching users top directors" });
      }
      res.json(result);
    });
  });
});

// Вземане на данни за най-запазвани в списък за гледане режисьори на даден потребител
app.post("/stats/individual/watchlist-top-directors", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  const { token } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.getUsersTopDirectorsFromWatchlist(userId, limit, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching users watchlist top directors" });
      }
      res.json(result);
    });
  });
});

// Вземане на данни за най-препоръчвани сценаристи на даден потребител
app.post("/stats/individual/top-writers", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  const { token } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.getUsersTopWriters(userId, limit, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching users top writers" });
      }
      res.json(result);
    });
  });
});

// Вземане на данни за най-запазвани в списък за гледане сценаристи на даден потребител
app.post("/stats/individual/watchlist-top-writers", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  const { token } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.getUsersTopWritersWatchlist(userId, limit, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching users watchlist top writers" });
      }
      res.json(result);
    });
  });
});

// Вземане на данни за книга от Goodreads
app.get("/get-goodreads-data-for-a-book", (req, res) => {
  const { url } = req.query;

  // Проверка дали е подаден URL параметър в заявката
  if (!url) {
    return res.status(400).send("Грешка: URL параметър е необходим.");
  }

  // Стартиране на Python процес и подаване на URL като аргумент
  const pythonProcess = spawn(pythonPathLocal, ["./scraping/scraper.py", url]);

  let response = "";

  // Улавяне на данни от стандартния изход (stdout)
  pythonProcess.stdout.on("data", (data) => {
    response += data.toString();
  });

  // Улавяне на грешки от стандартния изход за грешки (stderr) - по избор за дебъгване
  pythonProcess.stderr.on("data", (data) => {
    console.error("Python скрипт stderr:", data.toString());
  });

  // Обработка на затварянето на процеса
  pythonProcess.on("close", (code) => {
    if (code === 0) {
      const jsonResponse = JSON.parse(response.trim());
      res.status(200).json(jsonResponse); // Връща JSON отговор на клиента
    } else {
      res.status(500).send("Грешка: Изпълнението на Python скрипта неуспешно");
    }
  });
});

// Вземане на JSON обект за книга от Goodreads
app.get("/get-goodreads-json-object-for-a-book", (req, res) => {
  const { url } = req.query;

  // Проверка дали е подаден URL параметър в заявката
  if (!url) {
    return res.status(400).send("Грешка: URL параметър е необходим.");
  }

  // Стартиране на Python процес и подаване на URL като аргумент
  const pythonProcess = spawn(pythonPathLocal, [
    "./scraping/scraper_script_tag_json.py",
    url
  ]);

  let response = "";

  // Улавяне на данни от стандартния изход (stdout)
  pythonProcess.stdout.on("data", (data) => {
    response += data.toString();
  });

  // Улавяне на грешки от стандартния изход за грешки (stderr) - по избор за дебъгване
  pythonProcess.stderr.on("data", (data) => {
    console.error("Python скрипт stderr:", data.toString());
  });

  // Обработка на затварянето на процеса
  pythonProcess.on("close", (code) => {
    if (code === 0) {
      const jsonResponse = JSON.parse(response.trim());
      res.status(200).json(jsonResponse); // Връща JSON отговор на клиента
    } else {
      res.status(500).send("Грешка: Изпълнението на Python скрипта неуспешно");
    }
  });
});

// Проверка дали даден филм/сериал е подходящ за конкретните потребителски предпочитания
app.post("/check-relevance", (req, res) => {
  const { userPreferences, recommendations } = req.body;

  if (!userPreferences || !recommendations) {
    return res.status(400).json({
      error: "Missing userPreferences object or recommendations array"
    });
  }

  // Обработване на всяка препоръка и изчисляване на релевантността
  const relevanceResults = recommendations.map((recommendation) => {
    const relevance = hf.checkRelevance(userPreferences, recommendation);

    return {
      imdbID: recommendation.imdbID,
      title_en: recommendation.title_en,
      title_bg: recommendation.title_bg,
      ...relevance
    };
  });

  // Връщане на резултатите като JSON
  res.json(relevanceResults);
});

// Проверка дали даден филм/сериал е подходящ за конкретните потребителски предпочитания - AI Анализатор страница
app.post("/check-relevance-for-last-saved-recommendations", (req, res) => {
  const { token } = req.body;
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;

    db.getLastUserPreferences(userId, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching last saved user recommendations." });
      }
      if (!result) {
        return res.json({
          message: "No user preferences found.",
          lastSavedUserPreferences: null,
          lastSavedRecommendations: [],
          relevanceResults: []
        });
      }
      db.getLastGeneratedMoviesSeriesRecommendations(
        userId,
        result.date,
        (err, recommendationsResult) => {
          if (err) {
            return res.status(500).json({
              error:
                "Error fetching last generated movies series recommendations."
            });
          }
          // Обработване на всяка препоръка и изчисляване на релевантността
          const relevanceResults = recommendationsResult.map(
            (recommendation) => {
              const relevance = hf.checkRelevance(result, recommendation);

              return {
                imdbID: recommendation.imdbID,
                title_en: recommendation.title_en,
                title_bg: recommendation.title_bg,
                ...relevance
              };
            }
          );

          // Връщане на резултатите като JSON
          res.json({
            lastSavedUserPreferences: result,
            lastSavedRecommendations: recommendationsResult,
            relevanceResults: relevanceResults
          });
        }
      );
    });
  });
});

// Запазване на данни за Precision на текущото генериране
app.post("/save-analysis", (req, res) => {
  const { token } = req.body;
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;

    db.saveAnalysis(userId, req.body, (err) => {
      if (err) return res.status(500).json({ error: "Error saving analysis." });

      res
        .status(201)
        .json({ message: "AI Precision Analysis saved successfully!" });
    });
  });
});

// Ендпоинт за изчисляване на средните метрики
app.get("/stats/ai/average-metrics", (req, res) => {
  // Изчисляване на средните стойности за precision, recall и F1 score
  db.calculateAverageMetrics((err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Грешка при изчисляването на метриките." });

    // Връщане на резултата като JSON отговор
    res.status(200).json(result);
  });
});

// Изчисляване на Precision на база всички препоръки, правени някога за даден потребител
app.post("/stats/ai/precision-total", (req, res) => {
  const { token, userPreferences } = req.body;

  // Проверка дали липсва обектът с предпочитания на потребителя
  if (!userPreferences) {
    return res.status(400).json({
      error: "Missing userPreferences object"
    });
  }

  // Проверка на валидността на токена
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;

    // Извличане на всички препоръки на даден потребител от базата данни
    db.getAllUsersDistinctRecommendations(userId, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error retrieving user recommendations" });
      }

      const total_recommendations_count = result.total_count; // Общият брой препоръки на даден потребител
      const recommendations = result.recommendations; // Масив с всички препоръки на даден потребител
      let relevant_recommendations_count = 0; // Броят на релевантните препоръки на даден потребител, които са му препоръчвани на него

      // Обработване на всяка препоръка и изчисляване на релевантността
      recommendations.map((recommendation) => {
        const relevance = hf.checkRelevance(userPreferences, recommendation);

        // Увеличаване на броя на релевантните препоръки, ако препоръката е релевантна
        if (relevance.isRelevant === true) {
          relevant_recommendations_count++;
        }

        return {
          imdbID: recommendation.imdbID,
          ...relevance
        };
      });

      // Изчисляване на Precision (закръгляне и на двете стойности до 16 знака след десетичната запетая и сравняване)
      const precision_exact =
        total_recommendations_count > 0
          ? Math.round(
              (relevant_recommendations_count / total_recommendations_count) *
                Math.pow(10, 16)
            ) / Math.pow(10, 16)
          : 0;

      const precision_fixed = parseFloat(precision_exact.toFixed(2)); // Закръглена до 2 знака
      const precision_percentage = parseFloat(
        (precision_exact * 100).toFixed(2)
      ); // Процентно представяне

      // Съхраняване на резултатите в базата данни
      db.savePrecision(
        userId,
        "precision",
        {
          precision_exact,
          precision_fixed,
          precision_percentage,
          relevant_recommendations_count,
          total_recommendations_count
        },
        (err) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Error saving AI precision stats" });
          }

          // Връщане на резултатите като JSON
          res.json({
            precision_exact,
            precision_fixed,
            precision_percentage,
            relevant_recommendations_count,
            total_recommendations_count
          });
        }
      );
    });
  });
});

// Изчисляване на Recall на база всички препоръки, правени някога в платформата
app.post("/stats/ai/recall-total", (req, res) => {
  const { token, userPreferences } = req.body;

  // Проверка дали липсва обектът с предпочитания на потребителя
  if (!userPreferences) {
    return res.status(400).json({
      error: "Missing userPreferences object"
    });
  }

  // Проверка на валидността на токена
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;

    // Извличане на всички препоръки на потребителите от базата данни
    db.getAllPlatformDistinctRecommendations((err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error retrieving recommendations" });
      }

      const total_platform_recommendations_count = result.total_count; // Общият брой препоръки в цялата платформа
      const recommendations = result.recommendations; // Масив с всички препоръки в цялата платформа
      let relevant_platform_recommendations_count = 0; // Броят на релевантните препоръки на даден потребител в цялата платформа, независимо дали те са му препоръчвани на него или не

      // Обработване на всяка препоръка и изчисляване на релевантността
      recommendations.forEach((recommendation) => {
        const relevance = hf.checkRelevance(userPreferences, recommendation);

        // Увеличаване на броя на релевантните препоръки, ако препоръката е релевантна
        if (relevance.isRelevant) {
          relevant_platform_recommendations_count++;
        }
      });

      // Извличане на всички препоръки на даден потребител от базата данни
      db.getAllUsersDistinctRecommendations(userId, (err, userResult) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error retrieving user recommendations" });
        }

        const total_user_recommendations_count = userResult.total_count; // Общият брой препоръки на даден потребител
        const userRecommendations = userResult.recommendations; // Масив с всички препоръки на даден потребител
        let relevant_user_recommendations_count = 0; // Броят на релевантните препоръки на даден потребител, които са му препоръчвани на него

        // Обработване на всяка препоръка и изчисляване на релевантността
        userRecommendations.map((recommendation) => {
          const relevance = hf.checkRelevance(userPreferences, recommendation);

          // Увеличаване на броя на релевантните препоръки, ако препоръката е релевантна
          if (relevance.isRelevant === true) {
            relevant_user_recommendations_count++;
          }
        });

        // Изчисляване на Recall - Броят на релевантните препоръки на даден потребител, които са му препоръчвани на него (True Positives - TP) / Броят на релевантните препоръки на даден потребител в цялата платформа, независимо дали те са му препоръчвани на него или не (True Positives + False Negatives -> TP + FN)
        // (закръгляне и на двете стойности до 16 знака след десетичната запетая и сравняване)
        const recall_exact =
          relevant_platform_recommendations_count > 0
            ? Math.round(
                (relevant_user_recommendations_count /
                  relevant_platform_recommendations_count) *
                  Math.pow(10, 16)
              ) / Math.pow(10, 16)
            : 0;

        const recall_fixed = parseFloat(recall_exact.toFixed(2)); // Закръглена до 2 знака
        const recall_percentage = parseFloat((recall_exact * 100).toFixed(2)); // Процентно представяне

        // Съхраняване на резултатите в базата данни
        db.saveRecall(
          userId,
          "recall",
          {
            recall_exact,
            recall_fixed,
            recall_percentage,
            relevant_user_recommendations_count,
            relevant_platform_recommendations_count,
            total_user_recommendations_count,
            total_platform_recommendations_count
          },
          (err) => {
            if (err) {
              return res
                .status(500)
                .json({ error: "Error saving AI recall stats" });
            }
            // Връщане на резултатите като JSON
            res.json({
              recall_exact,
              recall_fixed,
              recall_percentage,
              relevant_user_recommendations_count,
              relevant_platform_recommendations_count,
              total_user_recommendations_count,
              total_platform_recommendations_count
            });
          }
        );
      });
    });
  });
});

// Изчисляване на F1-score на база Precision и Recall
app.post("/stats/ai/f1-score", (req, res) => {
  const { token, precision_exact, recall_exact } = req.body;

  // Проверка на валидността на токена
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;

    // Проверка дали липсват входни стойности
    if (precision_exact === undefined || recall_exact === undefined) {
      return res.status(400).json({
        error: "Missing precision_exact or recall_exact"
      });
    }

    // Изчисляване на F1 Score по общата формула
    const f1_score =
      precision_exact + recall_exact === 0
        ? 0
        : (2 * precision_exact * recall_exact) /
          (precision_exact + recall_exact);

    // Закръгляне на F1 Score до 16 знака след десетичната запетая
    const f1_score_exact =
      Math.round(f1_score * Math.pow(10, 16)) / Math.pow(10, 16);

    const f1_score_fixed = parseFloat(f1_score_exact.toFixed(2)); // Закръглена до 2 знака
    const f1_score_percentage = parseFloat((f1_score_exact * 100).toFixed(2)); // Процентно представяне

    // Съхраняване на резултатите в базата данни
    db.saveF1Score(
      userId,
      "f1score",
      {
        f1_score_exact,
        f1_score_fixed,
        f1_score_percentage
      },
      (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error saving AI f1 score stats" });
        }
        // Връщане на резултата като JSON
        res.json({
          f1_score_exact,
          f1_score_fixed,
          f1_score_percentage
        });
      }
    );
  });
});

// Стартиране на сървъра
app.listen(5000, () => {
  console.log("Server started on port 5000.");
});
