const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const db = require("./database");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
require("dotenv").config();

const whitelist = ["http://localhost:5174", "https://cinecompass.noit.eu"];
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
const EMAIL_USER = "no-reply@cinecompass-api.noit.eu";
const EMAIL_PASS = "Noit_2025";

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: "cinecompass-api.noit.eu", // Replace with your cPanel mail server
  port: 587, // Use 465 for SSL or 587 for TLS
  secure: false, // true for SSL (port 465), false for TLS (port 587)
  auth: {
    user: EMAIL_USER, // Your email address
    pass: EMAIL_PASS // Your email password
  },
  debug: true // Optional, logs SMTP communication for troubleshooting
});

// Signup Route
app.post("/signup", (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  db.checkEmailExists(email, (err, result) => {
    if (err) return res.status(500).json({ error: "Database query error" });

    if (result.length > 0) {
      return res
        .status(400)
        .json({ error: "Профил с този имейл вече съществува." });
    }

    // Generate a verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    // Temporarily store the code
    verificationCodes[email] = {
      code: verificationCode,
      firstName,
      lastName,
      password, // Store the password temporarily
      expiresAt: Date.now() + 15 * 60 * 1000 // Set 15 minutes validity
    };

    // Send the verification code via email
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "Шестцифрен код за потвърждение от Кино Компас",
      html: `
        <div style="text-align: center; background-color: rgba(244, 211, 139, 0.5); margin: 2% 3%; padding: 3% 1%; border: 4px dotted rgb(178, 50, 0); border-radius: 20px">
          <h2>Благодарим Ви за регистрацията в Кино Компас!</h2>
          <hr style="border: 0.5px solid rgb(178, 50, 0); width: 18%; margin-top: 6%; margin-bottom: 4%"></hr>
          <p>Вашият шестцифрен код е <strong style="font-size: 20px; color: rgb(178, 50, 0)">${verificationCode}</strong>.</p>
        </div>
        <div>
          <p style="border-radius: 5px; background-color: rgba(178, 50, 0, 0.2); text-align: center; font-size: 13px; margin: 5% 25% 0% 25%">Не сте поискали код? Игнорирайте този имейл.</p>
        </div>`
    };

    console.log("transporting");
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error: ", error);
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
    return res.status(401).json({ error: "No token provided" });
  }

  // Verify and decode the token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const userId = decoded.id; // Extract userId from the decoded token

    // Ensure the request count is reset daily
    db.checkAndResetRequestsDaily(userRequests); // Pass userRequests to the function

    // If the user doesn't have any data yet, initialize them
    if (!userRequests[userId]) {
      userRequests[userId] = { count: 0, lastRequestTime: new Date() };
    }

    // Check if the user has exceeded the max number of requests for today
    if (userRequests[userId].count >= MAX_REQUESTS_PER_DAY) {
      return res.status(400).json({
        error: "You have exceeded the maximum request limit for today!"
      });
    }

    // Proceed with handling the request
    userRequests[userId].count += 1;
    userRequests[userId].lastRequestTime = new Date();

    // Your logic for handling the submit goes here
    console.log("userRequests: ", userRequests);
    res.json({ message: "Request handled successfully!" });
  });
});

// Resend Route
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
    subject: "Нов шестцифрен код за потвърждение от Кино Компас",
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

// Verification Route
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

  // Proceed with user registration
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
      res.json({ message: "Успешно регистриран профил!" });
    }
  );
});

// Sign in Route
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
    res.json({ message: "Успешно влизане!", token });
  });
});

// Password Reset Request Route
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
    const resetLink = `https://cinecompass.noit.eu/resetpassword/resetcover/${token}`;

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "Промяна на паролата за Кино Компас",
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

// Password Reset Route
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

// Token Validation Route
app.post("/token-validation", (req, res) => {
  const { token } = req.body;

  jwt.verify(token, SECRET_KEY, (err) => {
    if (err) return res.json({ valid: false });
    res.json({ valid: true });
  });
});

// Get User Data Route
app.get("/user-data", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

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

// Save User Preferences Route
app.post("/save-user-preferences", (req, res) => {
  const {
    token,
    preferred_genres_en,
    preferred_genres_bg,
    mood,
    timeAvailability,
    preferred_age,
    preferred_type,
    preferred_actors,
    preferred_directors,
    preferred_countries,
    preferred_pacing,
    preferred_depth,
    preferred_target_group,
    interests,
    date
  } = req.body;

  // Verify the token to get the user ID
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ error: "Invalid token" });
    }

    const userId = decoded.id;

    console.log(
      "data: ",
      userId,
      preferred_genres_en,
      preferred_genres_bg,
      mood,
      timeAvailability,
      preferred_age,
      preferred_type,
      preferred_actors,
      preferred_directors,
      preferred_countries,
      preferred_pacing,
      preferred_depth,
      preferred_target_group,
      interests,
      date
    );
    // Save user preferences to the database
    db.saveUserPreferences(
      userId,
      preferred_genres_en,
      preferred_genres_bg,
      mood,
      timeAvailability,
      preferred_age,
      preferred_type,
      preferred_actors,
      preferred_directors,
      preferred_countries,
      preferred_pacing,
      preferred_depth,
      preferred_target_group,
      interests,
      date,
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res
          .status(201)
          .json({ message: "User preferences saved successfully!" });
      }
    );
  });
});

// Save Recommendation
app.post("/save-recommendation", (req, res) => {
  const {
    token,
    imdbID,
    title_en,
    title_bg,
    genre_en,
    genre_bg,
    reason,
    description,
    year,
    rated,
    released,
    runtime,
    director,
    writer,
    actors,
    plot,
    language,
    country,
    awards,
    poster,
    ratings,
    metascore,
    imdbRating,
    imdbVotes,
    type,
    DVD,
    boxOffice,
    production,
    website,
    totalSeasons,
    date
  } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.saveRecommendation(
      userId,
      imdbID,
      title_en,
      title_bg,
      genre_en,
      genre_bg,
      reason,
      description,
      year,
      rated,
      released,
      runtime,
      director,
      writer,
      actors,
      plot,
      language,
      country,
      awards,
      poster,
      ratings,
      metascore,
      imdbRating,
      imdbVotes,
      type,
      DVD,
      boxOffice,
      production,
      website,
      totalSeasons,
      date,
      (err, result) => {
        console.log(
          "title_en: \n" +
            title_en +
            "\n" +
            "title_bg: \n" +
            title_bg +
            "\n" +
            "genre_en: \n" +
            genre_en +
            "\n" +
            "genre_bg: \n" +
            genre_bg
        );
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "Recommendation added successfully!" });
      }
    );
  });
});

// Вземане на данни за общ брой на потребители в платформата
app.get("/stats/platform/users-count", (req, res) => {
  db.getUsersCount((err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching users count" });
    }
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
app.get("/stats/platform/top-recommendations-with-all-data", (req, res) => {
  db.getTopRecommendations((err, result) => {
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

  db.getTopCountries(limit, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching top countries" });
    }
    res.json(result);
  });
});

// Вземане на данни за най-препоръчвани жанрове в платформата
app.get("/stats/platform/top-genres", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  db.getTopGenres(limit, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching top genres" });
    }
    res.json(result);
  });
});

// Вземане на данни за най-популярни жанрове във времето в платформата
app.get("/stats/platform/genre-popularity-over-time", async (req, res) => {
  db.getGenrePopularityOverTime((err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error fetching genre popularity over time" });
    }
    res.json(result);
  });
});

// Вземане на данни за най-препоръчвани актьори в платформата
app.get("/stats/platform/top-actors", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  db.getTopActors(limit, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching top actors" });
    }
    res.json(result);
  });
});

// Вземане на данни за най-препоръчвани филмови режисьори в платформата
app.get("/stats/platform/top-directors", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

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
  db.getSortedDirectorsByProsperity((err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching sorted directors" });
    }
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
  db.getSortedMoviesByProsperity((err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching sorted movies" });
    }
    res.json(result);
  });
});

// Вземане на данни за филми и сериали в платформата, сортирани по meta score
app.get(
  "/stats/platform/sorted-movies-and-series-by-metascore",
  async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;

    db.getTopMoviesAndSeriesByMetascore(limit, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching sorted movies by meta score" });
      }
      res.json(result);
    });
  }
);

// Вземане на данни за филми и сериали в платформата, сортирани по IMDb rating
app.get(
  "/stats/platform/sorted-movies-and-series-by-imdb-rating",
  async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;

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

// Общ endpoint за статистики на началната страница в платформата
app.get("/stats/platform/all", async (req, res) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    // Verify the token
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Invalid token" });

      const userId = decoded.id;

      // Proceed with fetching user data
      db.getUserById(userId, (err, result) => {
        if (err) return res.status(500).json({ error: "Database query error" });
        if (result.length === 0) {
          return res.status(404).json({ error: "User not found!" });
        }

        // User data fetched successfully
        const user = result[0];

        // User is authenticated, now fetch platform statistics
        const limit = parseInt(req.query.limit) || 10;

        // Run all queries in parallel
        Promise.all([
          new Promise((resolve, reject) =>
            db.getUsersCount((err, result) =>
              err ? reject(err) : resolve(result)
            )
          ),
          new Promise((resolve, reject) =>
            db.getTopRecommendations((err, result) =>
              err ? reject(err) : resolve(result)
            )
          ),
          new Promise((resolve, reject) =>
            db.getTopGenres(limit, (err, result) =>
              err ? reject(err) : resolve(result)
            )
          ),
          new Promise((resolve, reject) =>
            db.getGenrePopularityOverTime((err, result) =>
              err ? reject(err) : resolve(result)
            )
          ),
          new Promise((resolve, reject) =>
            db.getTopActors(limit, (err, result) =>
              err ? reject(err) : resolve(result)
            )
          ),
          new Promise((resolve, reject) =>
            db.getTopDirectors(limit, (err, result) =>
              err ? reject(err) : resolve(result)
            )
          ),
          new Promise((resolve, reject) =>
            db.getTopWriters(limit, (err, result) =>
              err ? reject(err) : resolve(result)
            )
          ),
          new Promise((resolve, reject) =>
            db.getOscarsByMovie((err, result) =>
              err ? reject(err) : resolve(result)
            )
          ),
          new Promise((resolve, reject) =>
            db.getTotalAwardsByMovieOrSeries((err, result) =>
              err ? reject(err) : resolve(result)
            )
          ),
          new Promise((resolve, reject) =>
            db.getTotalAwardsCount((err, result) =>
              err ? reject(err) : resolve(result)
            )
          ),
          new Promise((resolve, reject) =>
            db.getSortedDirectorsByProsperity((err, result) =>
              err ? reject(err) : resolve(result)
            )
          ),
          new Promise((resolve, reject) =>
            db.getSortedActorsByProsperity((err, result) =>
              err ? reject(err) : resolve(result)
            )
          ),
          new Promise((resolve, reject) =>
            db.getSortedWritersByProsperity((err, result) =>
              err ? reject(err) : resolve(result)
            )
          ),
          new Promise((resolve, reject) =>
            db.getSortedMoviesByProsperity((err, result) =>
              err ? reject(err) : resolve(result)
            )
          ),
          new Promise((resolve, reject) =>
            db.getTopMoviesAndSeriesByMetascore(limit, (err, result) =>
              err ? reject(err) : resolve(result)
            )
          ),
          new Promise((resolve, reject) =>
            db.getTopMoviesAndSeriesByIMDbRating(limit, (err, result) =>
              err ? reject(err) : resolve(result)
            )
          ),
          new Promise((resolve, reject) =>
            db.getTopMoviesAndSeriesByRottenTomatoesRating(
              limit,
              (err, result) => (err ? reject(err) : resolve(result))
            )
          ),
          new Promise((resolve, reject) =>
            db.getAverageBoxOfficeAndScores((err, result) =>
              err ? reject(err) : resolve(result)
            )
          ),
          new Promise((resolve, reject) =>
            db.getTopCountries(limit, (err, result) =>
              err ? reject(err) : resolve(result)
            )
          )
        ])
          .then(
            ([
              usersCount,
              topRecommendations,
              topGenres,
              genrePopularityOverTime,
              topActors,
              topDirectors,
              topWriters,
              oscarsByMovie,
              totalAwardsByMovieOrSeries,
              totalAwards,
              sortedDirectorsByProsperity,
              sortedActorsByProsperity,
              sortedWritersByProsperity,
              sortedMoviesByProsperity,
              sortedMoviesAndSeriesByMetascore,
              sortedMoviesAndSeriesByIMDbRating,
              sortedMoviesAndSeriesByRottenTomatoesRating,
              averageBoxOfficeAndScores,
              topCountries
            ]) => {
              // Return the statistics in the response
              res.json({
                user,
                usersCount,
                topRecommendations,
                topGenres,
                genrePopularityOverTime,
                topActors,
                topDirectors,
                topWriters,
                oscarsByMovie,
                totalAwardsByMovieOrSeries,
                totalAwards,
                sortedDirectorsByProsperity,
                sortedActorsByProsperity,
                sortedWritersByProsperity,
                sortedMoviesByProsperity,
                sortedMoviesAndSeriesByMetascore,
                sortedMoviesAndSeriesByIMDbRating,
                sortedMoviesAndSeriesByRottenTomatoesRating,
                averageBoxOfficeAndScores,
                topCountries
              });
            }
          )
          .catch((error) => {
            res
              .status(500)
              .json({ error: "Error fetching data", details: error.message });
          });
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Unexpected error", details: error.message });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server started on port 5000.");
});
