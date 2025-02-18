const db = require("../database");
const hf = require("../helper_functions");

// Мокираме целия обект с функции на базата данни
jest.mock("../database", () => ({
  query: jest.fn(), // Мокваме query функцията за заявки към базата данни
  saveMoviesSeriesUserPreferences: jest.fn(), // Мокваме saveMoviesSeriesUserPreferences функцията
  saveBooksUserPreferences: jest.fn(), // Мокваме saveBooksUserPreferences функцията
  getLastUserPreferences: jest.fn(), // Мокваме getLastUserPreferences функцията
  getUsersTopGenres: jest.fn(), // Мокваме getUsersTopGenres функцията
  getUsersTopGenresFromWatchlist: jest.fn(), // Мокваме getUsersTopGenresFromWatchlist функцията
  getUsersTopActors: jest.fn(), // Мокваме getUsersTopActors функцията
  getUsersTopActorsFromWatchlist: jest.fn(), // Мокваме getUsersTopActorsFromWatchlist функцията
  getUsersTopDirectors: jest.fn(), // Мокваме getUsersTopDirectors функцията
  getUsersTopDirectorsFromWatchlist: jest.fn(), // Мокваме getUsersTopDirectorsFromWatchlist функцията
  getUsersTopWriters: jest.fn(), // Мокваме getUsersTopWriters функцията
  getUsersTopWritersFromWatchlist: jest.fn() // Мокваме getUsersTopWritersFromWatchlist функцията
}));

jest.mock("../helper_functions", () => ({
  translate: jest.fn() // Мокваме translate функцията
}));

const testUserId = 1;
const testPreferencesMoviesSeries = {
  preferred_genres_en: "Action, Comedy",
  preferred_genres_bg: "Екшън, Комедия",
  mood: "Happy",
  timeAvailability: "Evening",
  preferred_age: "18-35",
  preferred_type: "Movie",
  preferred_actors: "Actor One, Actor Two",
  preferred_directors: "Director One",
  preferred_countries: "USA, UK",
  preferred_pacing: "Fast",
  preferred_depth: "Moderate",
  preferred_target_group: "Adults",
  interests: "Sports, Adventure",
  date: "2025-02-18"
};

const testPreferencesBooks = {
  preferred_genres_en: "Fantasy, Mystery",
  preferred_genres_bg: "Фентъзи, Мистерия",
  mood: "Adventurous",
  preferred_authors: "Author One, Author Two",
  preferred_origin: "UK",
  preferred_pacing: "Moderate",
  preferred_depth: "Deep",
  preferred_target_group: "Teens",
  interests: "History, Magic",
  date: "2025-02-18"
};

// Тест за функцията saveMoviesSeriesUserPreferences
describe("saveMoviesSeriesUserPreferences", () => {
  it("Трябва да запише предпочитанията на потребителя за филми/сериали в базата данни", () => {
    // Мокираме успешен отговор от базата данни
    db.query.mockImplementation((sql, values, callback) => {
      callback(null, { insertId: 1 }); // Симулираме успешен резултат
    });

    db.saveMoviesSeriesUserPreferences(
      testUserId,
      testPreferencesMoviesSeries,
      (err, result) => {
        expect(err).toBeNull(); // Няма да има грешка
        expect(result).toHaveProperty("insertId", 1); // Очакваме да получим insertId
        done(); // Завършване на теста
      }
    );
  });

  it("Трябва да обработва грешки при записване на предпочитанията на потребителя за филми/сериали", () => {
    // Мокираме грешка от базата данни
    db.query.mockImplementation((sql, values, callback) => {
      callback(new Error("Database error"), null); // Симулираме грешка
    });

    db.saveMoviesSeriesUserPreferences(
      testUserId,
      testPreferencesMoviesSeries,
      (err, result) => {
        expect(err).toBeInstanceOf(Error); // Очакваме грешка
        expect(err.message).toBe("Database error"); // Проверяваме съобщението за грешката
        expect(result).toBeNull(); // Няма да има резултат
        done(); // Завършване на теста
      }
    );
  });
});

// Тест за функцията saveBooksUserPreferences
describe("saveBooksUserPreferences", () => {
  it("Трябва да запише предпочитанията на потребителя за книги в базата данни", () => {
    // Мокираме успешен отговор от базата данни
    db.query.mockImplementation((sql, values, callback) => {
      callback(null, { insertId: 1 }); // Симулираме успешен резултат
    });

    db.saveBooksUserPreferences(
      testUserId,
      testPreferencesBooks,
      (err, result) => {
        expect(err).toBeNull(); // Няма да има грешка
        expect(result).toHaveProperty("insertId", 1); // Очакваме да получим insertId
        done(); // Завършване на теста
      }
    );
  });

  it("Трябва да обработва грешки при записване на предпочитанията на потребителя за книги", () => {
    // Мокираме грешка от базата данни
    db.query.mockImplementation((sql, values, callback) => {
      callback(new Error("Database error"), null); // Симулираме грешка
    });

    db.saveBooksUserPreferences(
      testUserId,
      testPreferencesBooks,
      (err, result) => {
        expect(err).toBeInstanceOf(Error); // Очакваме грешка
        expect(err.message).toBe("Database error"); // Проверяваме съобщението за грешката
        expect(result).toBeNull(); // Няма да има резултат
        done(); // Завършване на теста
      }
    );
  });
});

// Тест за getLastUserPreferences
describe("getLastUserPreferences", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да върне последните предпочитания за даден потребител", () => {
    // Мокираме db.query да симулира резултат
    db.query.mockImplementationOnce((query, params, callback) => {
      expect(params).toEqual([1]); // Проверяваме, че параметрите са правилни
      callback(null, [
        {
          user_id: 1,
          genre_en: "Action",
          type: "movie",
          date: "2025-02-18",
          imdbRating: 8.5
        }
      ]);
    });

    // Действие: Извикваме функцията
    db.getLastUserPreferences(1, (err, result) => {
      // Проверка: Уверяваме се, че callback е извикан правилно
      expect(err).toBeNull();
      expect(result).toEqual({
        user_id: 1,
        genre_en: "Action",
        type: "movie",
        date: "2025-02-18",
        imdbRating: 8.5
      });
      done();
    });
  });

  it("Трябва да върне null, ако няма последни предпочитания за потребителя", () => {
    // Мокираме db.query да симулира резултат без предпочитания
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(null, []);
    });

    // Действие: Извикваме функцията
    db.getLastUserPreferences(1, (err, result) => {
      // Проверка: Уверяваме се, че няма последни предпочитания
      expect(err).toBeNull();
      expect(result).toBeNull();
      done();
    });
  });

  it("Трябва да върне грешка, ако има проблем с изпълнението на заявката", () => {
    const errorMessage = "Database error";
    // Мокираме db.query да симулира грешка
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(new Error(errorMessage), null);
    });

    // Действие: Извикваме функцията
    db.getLastUserPreferences(1, (err, result) => {
      // Проверка: Уверяваме се, че е върната грешка
      expect(err).toEqual(new Error(errorMessage));
      expect(result).toBeNull();
      done();
    });
  });
});

// Тест за функцията getUsersTopGenres
describe("getUsersTopGenres", () => {
  it("should return top genres for the user", () => {
    const userId = 1;
    const limit = 5;

    // Мок на резултатите от базата данни
    db.query.mockImplementation((query, params, callback) => {
      callback(null, [
        { genre_en: "Action", genre_bg: "Екшън", count: 10 },
        { genre_en: "Comedy", genre_bg: "Комедия", count: 8 }
      ]);
    });

    db.getUsersTopGenres(userId, limit, (err, results) => {
      // Проверка за липса на грешки
      expect(err).toBeNull();

      // Проверка дали резултатите съдържат правилни жанрове
      expect(results).toEqual([
        { genre_en: "Action", genre_bg: "Екшън", count: 10 },
        { genre_en: "Comedy", genre_bg: "Комедия", count: 8 }
      ]);

      done();
    });
  });
});

// Тест за функцията getUsersTopGenresFromWatchlist
describe("getUsersTopGenresFromWatchlist", () => {
  it("should return top genres from watchlist for the user", () => {
    const userId = 1;
    const limit = 5;

    // Мок на резултатите от базата данни
    db.query.mockImplementation((query, params, callback) => {
      callback(null, [
        { genre_en: "Action", genre_bg: "Екшън", count: 6 },
        { genre_en: "Thriller", genre_bg: "Трилър", count: 4 }
      ]);
    });

    db.getUsersTopGenresFromWatchlist(userId, limit, (err, results) => {
      // Проверка за липса на грешки
      expect(err).toBeNull();

      // Проверка дали резултатите съдържат правилни жанрове
      expect(results).toEqual([
        { genre_en: "Action", genre_bg: "Екшън", count: 6 },
        { genre_en: "Thriller", genre_bg: "Трилър", count: 4 }
      ]);

      done();
    });
  });
});

// Тест за функцията getUsersTopActors
describe("getUsersTopActors", () => {
  it("should return top actors with prosperity data for the user", () => {
    const userId = 1;
    const limit = 5;

    // Мок на резултатите от базата данни
    db.query.mockImplementation((query, params, callback) => {
      if (query.includes("movies_series_recommendations")) {
        callback(null, [
          { actor: "Millie Bobby Brown", recommendations_count: 5 },
          { actor: "David Harbour", recommendations_count: 3 }
        ]);
      } else if (query.includes("UniqueMovies")) {
        callback(null, [
          {
            actor: "Millie Bobby Brown",
            avg_imdb_rating: 8.2,
            avg_metascore: 75,
            total_box_office: "$500M",
            avg_rotten_tomatoes: "85%",
            movie_series_count: 10,
            total_recommendations: 8,
            total_wins: 3,
            total_nominations: 2
          },
          {
            actor: "David Harbour",
            avg_imdb_rating: 7.5,
            avg_metascore: 70,
            total_box_office: "$400M",
            avg_rotten_tomatoes: "80%",
            movie_series_count: 8,
            total_recommendations: 5,
            total_wins: 2,
            total_nominations: 1
          }
        ]);
      }
    });

    db.getUsersTopActors(userId, limit, (err, results) => {
      // Проверка за липса на грешки
      expect(err).toBeNull();

      // Проверка дали резултатите съдържат актьори с правилни данни за просперитет
      expect(results).toEqual([
        {
          actor_en: "Millie Bobby Brown",
          actor_bg: "Мили Боби Браун",
          recommendations_count: 5,
          avg_imdb_rating: 8.2,
          avg_metascore: 75,
          total_box_office: "$500M",
          avg_rotten_tomatoes: "85%",
          movie_series_count: 10,
          total_recommendations: 8,
          total_wins: 3,
          total_nominations: 2,
          prosperityScore: 7.88
        },
        {
          actor_en: "David Harbour",
          actor_bg: "Дейвид Харбър",
          recommendations_count: 3,
          avg_imdb_rating: 7.5,
          avg_metascore: 70,
          total_box_office: "$400M",
          avg_rotten_tomatoes: "80%",
          movie_series_count: 8,
          total_recommendations: 5,
          total_wins: 2,
          total_nominations: 1,
          prosperityScore: 6.61
        }
      ]);

      done();
    });
  });
});

// Тест за функцията getUsersTopActorsFromWatchlist
describe("getUsersTopActorsFromWatchlist", () => {
  const testUserId = 1;
  const testLimit = 5;

  it("should return top actors from the watchlist with prosperity data", async () => {
    // Мока на заявката за база данни за получаване на топ актьори от watchlist-а
    db.query.mockImplementationOnce((sql, values, callback) => {
      callback(null, [
        { actor: "Actor One", saved_count: 10 },
        { actor: "Actor Two", saved_count: 8 }
      ]);
    });

    // Мока на функцията за превод
    hf.translate = jest.fn((actor) => {
      if (actor === "Actor One") return Promise.resolve("Актьор Едно");
      if (actor === "Actor Two") return Promise.resolve("Актьор Две");
    });

    // Мока на резултата от заявката за просперитет (prosperity)
    db.query.mockImplementationOnce((sql, values, callback) => {
      callback(null, [
        {
          actor: "Actor One",
          avg_imdb_rating: 8.5,
          avg_metascore: 75,
          total_box_office: "$500,000,000",
          avg_rotten_tomatoes: "80%",
          movie_series_count: 20,
          total_saved_count: 10,
          total_wins: 5,
          total_nominations: 3,
          prosperityScore: 85.3
        },
        {
          actor: "Actor Two",
          avg_imdb_rating: 7.5,
          avg_metascore: 70,
          total_box_office: "$400,000,000",
          avg_rotten_tomatoes: "70%",
          movie_series_count: 15,
          total_saved_count: 8,
          total_wins: 3,
          total_nominations: 2,
          prosperityScore: 80.1
        }
      ]);
    });

    // Извикване на тестирана функция
    db.getUsersTopActorsFromWatchlist(testUserId, testLimit, (err, result) => {
      // Проверка за липса на грешки и правилен формат на данните
      expect(err).toBeNull();
      expect(result).toHaveLength(2); // Очакват се двама актьори
      expect(result[0]).toHaveProperty("actor_en", "Actor One");
      expect(result[0]).toHaveProperty("actor_bg", "Актьор Едно");
      expect(result[0]).toHaveProperty("prosperityScore", 85.3);
      expect(result[1]).toHaveProperty("actor_en", "Actor Two");
      expect(result[1]).toHaveProperty("actor_bg", "Актьор Две");
      expect(result[1]).toHaveProperty("prosperityScore", 80.1);
    });
  });

  it("should handle no actors found in the watchlist", async () => {
    // Мока на заявката за база данни за случай без актьори
    db.query.mockImplementationOnce((sql, values, callback) => {
      callback(null, []);
    });

    // Извикване на тестирана функция
    db.getUsersTopActorsFromWatchlist(testUserId, testLimit, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual({
        message: "No top actors from watchlist found for the user."
      });
    });
  });

  it("should handle errors from database query", async () => {
    // Мока на грешка от заявката за база данни
    db.query.mockImplementationOnce((sql, values, callback) => {
      callback(new Error("Database error"), null);
    });

    // Извикване на тестирана функция
    db.getUsersTopActorsFromWatchlist(testUserId, testLimit, (err, result) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Database error");
    });
  });
});

// Тест за функцията getUsersTopDirectors
describe("getUsersTopDirectors", () => {
  it("should return top directors with prosperity data for the user", () => {
    const userId = 1;
    const limit = 5;

    // Мок на резултатите от базата данни
    db.query.mockImplementation((query, params, callback) => {
      if (query.includes("movies_series_recommendations")) {
        callback(null, [
          { director: "The Duffer Brothers", recommendations_count: 5 },
          { director: "Steven Spielberg", recommendations_count: 3 }
        ]);
      } else if (query.includes("UniqueMovies")) {
        callback(null, [
          {
            director: "The Duffer Brothers",
            avg_imdb_rating: 8.9,
            avg_metascore: 80,
            total_box_office: "$700M",
            avg_rotten_tomatoes: "91%",
            movie_series_count: 10,
            total_recommendations: 15,
            total_wins: 5,
            total_nominations: 4
          },
          {
            director: "Steven Spielberg",
            avg_imdb_rating: 8.0,
            avg_metascore: 75,
            total_box_office: "$500M",
            avg_rotten_tomatoes: "85%",
            movie_series_count: 8,
            total_recommendations: 10,
            total_wins: 4,
            total_nominations: 3
          }
        ]);
      }
    });

    db.getUsersTopDirectors(userId, limit, (err, results) => {
      // Проверка за липса на грешки
      expect(err).toBeNull();

      // Проверка дали резултатите съдържат режисьори с правилни данни за просперитет
      expect(results).toEqual([
        {
          director_en: "The Duffer Brothers",
          director_bg: "Дъфер Брадърс",
          recommendations_count: 5,
          avg_imdb_rating: 8.9,
          avg_metascore: 80,
          total_box_office: "$700M",
          avg_rotten_tomatoes: "91%",
          movie_series_count: 10,
          total_recommendations: 15,
          total_wins: 5,
          total_nominations: 4,
          prosperityScore: 8.31
        },
        {
          director_en: "Steven Spielberg",
          director_bg: "Стивън Спилбърг",
          recommendations_count: 3,
          avg_imdb_rating: 8.0,
          avg_metascore: 75,
          total_box_office: "$500M",
          avg_rotten_tomatoes: "85%",
          movie_series_count: 8,
          total_recommendations: 10,
          total_wins: 4,
          total_nominations: 3,
          prosperityScore: 7.47
        }
      ]);

      done();
    });
  });
});

// Тест за функцията getUsersTopDirectorsFromWatchlist
describe("getUsersTopDirectorsFromWatchlist", () => {
  const testUserId = 1;
  const testLimit = 5;

  it("should return top directors from the watchlist with prosperity data", async () => {
    // Мока на заявката за база данни за получаване на топ режисьори от watchlist-а
    db.query.mockImplementationOnce((sql, values, callback) => {
      callback(null, [
        { director: "The Duffer Brothers", saved_count: 10 },
        { director: "Christopher Nolan", saved_count: 8 }
      ]);
    });

    // Мока на функцията за превод
    hf.translate = jest.fn((director) => {
      if (director === "The Duffer Brothers")
        return Promise.resolve("Дъфер Брадърс");
      if (director === "Christopher Nolan")
        return Promise.resolve("Кристофър Нолан");
    });

    // Мока на резултата от заявката за просперитет (prosperity)
    db.query.mockImplementationOnce((sql, values, callback) => {
      callback(null, [
        {
          director: "The Duffer Brothers",
          avg_imdb_rating: 8.9,
          avg_metascore: 80,
          total_box_office: "$700,000,000",
          avg_rotten_tomatoes: "91%",
          movie_series_count: 10,
          total_saved_count: 10,
          total_wins: 5,
          total_nominations: 4,
          prosperityScore: 88.2
        },
        {
          director: "Christopher Nolan",
          avg_imdb_rating: 8.5,
          avg_metascore: 85,
          total_box_office: "$800,000,000",
          avg_rotten_tomatoes: "90%",
          movie_series_count: 12,
          total_saved_count: 8,
          total_wins: 6,
          total_nominations: 5,
          prosperityScore: 87.1
        }
      ]);
    });

    // Извикване на тестирана функция
    db.getUsersTopDirectorsFromWatchlist(
      testUserId,
      testLimit,
      (err, result) => {
        // Проверка за липса на грешки и правилен формат на данните
        expect(err).toBeNull();
        expect(result).toHaveLength(2); // Очакват се двама режисьори
        expect(result[0]).toHaveProperty("director_en", "The Duffer Brothers");
        expect(result[0]).toHaveProperty("director_bg", "Дъфер Брадърс");
        expect(result[0]).toHaveProperty("prosperityScore", 88.2);
        expect(result[1]).toHaveProperty("director_en", "Christopher Nolan");
        expect(result[1]).toHaveProperty("director_bg", "Кристофър Нолан");
        expect(result[1]).toHaveProperty("prosperityScore", 87.1);
      }
    );
  });

  it("should handle no directors found in the watchlist", async () => {
    // Мока на заявката за база данни за случай без режисьори
    db.query.mockImplementationOnce((sql, values, callback) => {
      callback(null, []);
    });

    // Извикване на тестирана функция
    db.getUsersTopDirectorsFromWatchlist(
      testUserId,
      testLimit,
      (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual({
          message: "No top directors from watchlist found for the user."
        });
      }
    );
  });

  it("should handle errors from database query", async () => {
    // Мока на грешка от заявката за база данни
    db.query.mockImplementationOnce((sql, values, callback) => {
      callback(new Error("Database error"), null);
    });

    // Извикване на тестирана функция
    db.getUsersTopDirectorsFromWatchlist(
      testUserId,
      testLimit,
      (err, result) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Database error");
      }
    );
  });
});

// Тест за функцията getUsersTopWriters
describe("getUsersTopWriters", () => {
  it("should return top writers with prosperity data for the user", () => {
    const userId = 1;
    const limit = 5;

    // Мок на резултатите от базата данни
    db.query.mockImplementation((query, params, callback) => {
      if (query.includes("movies_series_recommendations")) {
        callback(null, [
          { writer: "J.K. Rowling", recommendations_count: 5 },
          { writer: "George R.R. Martin", recommendations_count: 3 }
        ]);
      } else if (query.includes("UniqueMovies")) {
        callback(null, [
          {
            writer: "J.K. Rowling",
            avg_imdb_rating: 9.0,
            avg_metascore: 85,
            total_box_office: "$1,200,000,000",
            avg_rotten_tomatoes: "95%",
            movie_series_count: 15,
            total_recommendations: 20,
            total_wins: 7,
            total_nominations: 5
          },
          {
            writer: "George R.R. Martin",
            avg_imdb_rating: 8.5,
            avg_metascore: 80,
            total_box_office: "$900,000,000",
            avg_rotten_tomatoes: "90%",
            movie_series_count: 12,
            total_recommendations: 18,
            total_wins: 6,
            total_nominations: 4
          }
        ]);
      }
    });

    db.getUsersTopWriters(userId, limit, (err, results) => {
      // Проверка за липса на грешки
      expect(err).toBeNull();

      // Проверка дали резултатите съдържат писатели с правилни данни за просперитет
      expect(results).toEqual([
        {
          writer_en: "J.K. Rowling",
          writer_bg: "Дж.К. Роулинг",
          recommendations_count: 5,
          avg_imdb_rating: 9.0,
          avg_metascore: 85,
          total_box_office: "$1,200,000,000",
          avg_rotten_tomatoes: "95%",
          movie_series_count: 15,
          total_recommendations: 20,
          total_wins: 7,
          total_nominations: 5,
          prosperityScore: 9.04
        },
        {
          writer_en: "George R.R. Martin",
          writer_bg: "Джордж Р.Р. Мартин",
          recommendations_count: 3,
          avg_imdb_rating: 8.5,
          avg_metascore: 80,
          total_box_office: "$900,000,000",
          avg_rotten_tomatoes: "90%",
          movie_series_count: 12,
          total_recommendations: 18,
          total_wins: 6,
          total_nominations: 4,
          prosperityScore: 8.58
        }
      ]);

      done();
    });
  });
});

// Тест за функцията getUsersTopWritersFromWatchlist
describe("getUsersTopWritersFromWatchlist", () => {
  const testUserId = 1;
  const testLimit = 5;

  it("should return top writers from the watchlist with prosperity data", async () => {
    // Мока на заявката за база данни за получаване на топ писатели от watchlist-а
    db.query.mockImplementationOnce((sql, values, callback) => {
      callback(null, [
        { writer: "J.K. Rowling", saved_count: 10 },
        { writer: "J.R.R. Tolkien", saved_count: 8 }
      ]);
    });

    // Мока на функцията за превод
    hf.translate = jest.fn((writer) => {
      if (writer === "J.K. Rowling") return Promise.resolve("Дж.К. Роулинг");
      if (writer === "J.R.R. Tolkien") return Promise.resolve("Дж.Р.Р. Толкин");
    });

    // Мока на резултата от заявката за просперитет (prosperity)
    db.query.mockImplementationOnce((sql, values, callback) => {
      callback(null, [
        {
          writer: "J.K. Rowling",
          avg_imdb_rating: 9.0,
          avg_metascore: 85,
          total_box_office: "$1,200,000,000",
          avg_rotten_tomatoes: "95%",
          movie_series_count: 15,
          total_saved_count: 10,
          total_wins: 7,
          total_nominations: 5,
          prosperityScore: 89.2
        },
        {
          writer: "J.R.R. Tolkien",
          avg_imdb_rating: 8.8,
          avg_metascore: 82,
          total_box_office: "$1,000,000,000",
          avg_rotten_tomatoes: "92%",
          movie_series_count: 12,
          total_saved_count: 8,
          total_wins: 6,
          total_nominations: 4,
          prosperityScore: 87.9
        }
      ]);
    });

    // Извикване на тестирана функция
    db.getUsersTopWritersFromWatchlist(testUserId, testLimit, (err, result) => {
      // Проверка за липса на грешки и правилен формат на данните
      expect(err).toBeNull();
      expect(result).toHaveLength(2); // Очакват се двама писатели
      expect(result[0]).toHaveProperty("writer_en", "J.K. Rowling");
      expect(result[0]).toHaveProperty("writer_bg", "Дж.К. Роулинг");
      expect(result[0]).toHaveProperty("prosperityScore", 89.2);
      expect(result[1]).toHaveProperty("writer_en", "J.R.R. Tolkien");
      expect(result[1]).toHaveProperty("writer_bg", "Дж.Р.Р. Толкин");
      expect(result[1]).toHaveProperty("prosperityScore", 87.9);
    });
  });

  it("should handle no writers found in the watchlist", async () => {
    // Мока на заявката за база данни за случай без писатели
    db.query.mockImplementationOnce((sql, values, callback) => {
      callback(null, []);
    });

    // Извикване на тестирана функция
    db.getUsersTopWritersFromWatchlist(testUserId, testLimit, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual({
        message: "No top writers from watchlist found for the user."
      });
    });
  });

  it("should handle errors from database query", async () => {
    // Мока на грешка от заявката за база данни
    db.query.mockImplementationOnce((sql, values, callback) => {
      callback(new Error("Database error"), null);
    });

    // Извикване на тестирана функция
    db.getUsersTopWritersFromWatchlist(testUserId, testLimit, (err, result) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Database error");
    });
  });
});
