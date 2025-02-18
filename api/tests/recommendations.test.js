const db = require("../database"); // Импортиране на mock версия на базата данни

// Мокираме целия обект с функции на базата данни
jest.mock("../database", () => ({
  saveMovieSeriesRecommendation: jest.fn(), // Мокваме функция за запазване на препоръка за филм/сериал
  saveBookRecommendation: jest.fn(), // Мокваме функция за запазване на препоръка за книга
  saveToWatchlist: jest.fn(), // Мокваме функция за добавяне на препоръка към watchlist
  saveToReadlist: jest.fn(), // Мокваме функция за добавяне на препоръка към readlist
  removeFromWatchlist: jest.fn(), // Мокваме функция за премахване на препоръка от watchlist
  removeFromReadlist: jest.fn(), // Мокваме функция за премахване на препоръка от readlist
  checkRecommendationExistsInWatchlist: jest.fn(), // Мокваме функция за проверка дали препоръката съществува в watchlist
  checkRecommendationExistsInReadlist: jest.fn(), // Мокваме функция за проверка дали препоръката съществува в readlist
  getUsersTopRecommendations: jest.fn(), // Мокваме функция за извличане на топ препоръки за потребител
  query: jest.fn() // Мокваме query функцията за заявки към базата данни
}));

// Примерна информация за тестване
const testUserId = 1;
const testMovieData = {
  imdbID: "tt1234567",
  title_en: "Test Movie",
  title_bg: "Тестов Филм",
  genre_en: "Action",
  genre_bg: "Екшън",
  reason: "For Action Lovers",
  description: "A great action-packed movie.",
  year: 2023,
  rated: "PG-13",
  released: "2023-01-01",
  runtime: 120,
  director: "John Doe",
  writer: "Jane Smith",
  actors: "Actor One, Actor Two",
  plot: "The plot of the movie.",
  language: "English",
  country: "USA",
  awards: "Won 1 Oscar",
  poster: "https://example.com/poster.jpg",
  ratings: { imdb: 8.5, metacritic: 75 },
  metascore: 75,
  imdbRating: 8.5,
  imdbVotes: 5000,
  type: "movie",
  DVD: "2023-05-01",
  boxOffice: "$1000000",
  production: "Production Company",
  website: "https://example.com",
  totalSeasons: null,
  date: "2023-02-18"
};
const testBookData = {
  google_books_id: "googlebook123",
  goodreads_id: "goodreads123",
  title_en: "Test Book",
  original_title: "Оригинално заглавие",
  title_bg: "Тестова Книга",
  author: "John Author",
  genre_en: "Fiction",
  genre_bg: "Фикция",
  description: "A test book description.",
  language: "English",
  origin: "USA",
  date_of_first_issue: "2023-01-01",
  date_of_issue: "2023-01-01",
  publisher: "Test Publisher",
  goodreads_rating: 4.5,
  goodreads_ratings_count: 1000,
  goodreads_reviews_count: 200,
  reason: "For Fiction Lovers",
  adaptations: "None",
  ISBN_10: "1234567890",
  ISBN_13: "123-4567890123",
  page_count: 300,
  book_format: "Hardcover",
  imageLink: "https://example.com/image.jpg",
  literary_awards: "None",
  setting: "Modern",
  characters: "Main Character",
  series: "No",
  source: "GoogleBooks"
};

// Тест за функцията saveMovieSeriesRecommendation
describe("saveMovieSeriesRecommendation", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да запази препоръка за филм/сериал в базата данни", () => {
    // Мокираме db.query за да симулираме успешен запис
    db.query.mockImplementation((query, values, callback) => {
      expect(query).toContain("INSERT INTO movies_series_recommendations"); // Проверка за SQL заявката
      callback(null, { insertId: 1 }); // Симулираме успешен запис с insertId = 1
    });

    // Действие: Извикваме функцията с тестови данни
    db.saveMovieSeriesRecommendation(
      testUserId,
      testMovieData,
      (err, result) => {
        // Проверка: Уверяваме се, че callback е извикан правилно
        expect(err).toBeNull(); // Няма грешка
        expect(result).toHaveProperty("insertId", 1); // insertId трябва да е 1 (както е върнато от мока)
        done(); // Извикваме done, за да покажем, че тестът е завършен
      }
    );
  });
});

// Тест за функцията saveBookRecommendation
describe("saveBookRecommendation", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест, за да избегнем намеса
  });

  it("Трябва да запази препоръка за книга в базата данни", () => {
    // Мокираме db.query за да симулираме успешен запис
    db.query.mockImplementation((query, values, callback) => {
      expect(query).toContain("INSERT INTO books_recommendations"); // Проверка за SQL заявката
      expect(values).toEqual(
        expect.arrayContaining([testUserId, testBookData.google_books_id])
      ); // Проверка за стойностите
      callback(null, { insertId: 1 }); // Симулираме успешен запис с insertId = 1
    });

    // Действие: Извикваме функцията с тестови данни
    db.saveBookRecommendation(testUserId, testBookData, (err, result) => {
      // Проверка: Уверяваме се, че callback е извикан правилно
      expect(err).toBeNull(); // Няма грешка
      expect(result).toHaveProperty("insertId", 1); // insertId трябва да е 1 (както е върнато от мока)
      done(); // Извикваме done, за да покажем, че тестът е завършен
    });
  });
});

// Тест за функцията saveToWatchlist
describe("saveToWatchlist", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест, за да избегнем намеса
  });

  it("Трябва да добави филм в watchlist", () => {
    db.query.mockImplementation((query, values, callback) => {
      expect(query).toContain("INSERT INTO watchlist"); // Проверка за SQL заявката
      expect(values).toEqual(
        expect.arrayContaining([testUserId, testMovieData.imdbID])
      ); // Проверка за стойностите
      callback(null, { affectedRows: 1 }); // Симулираме успешен запис в базата
    });

    db.saveToWatchlist(testUserId, testMovieData, (err, result) => {
      expect(err).toBeNull(); // Няма грешки
      expect(result.affectedRows).toBe(1); // Проверка дали записът е успешен
      done();
    });
  });
});

// Тест за функцията saveToReadlist
describe("saveToReadlist", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да запази книга в readlist", () => {
    // Мокираме db.query за да симулираме успешен запис
    db.query.mockImplementation((query, values, callback) => {
      expect(query).toContain("INSERT INTO readlist");
      expect(values).toEqual([
        1, // userId
        "google_books_id_example", // google_books_id
        null, // goodreads_id
        "Example Title" // title_en
        // Добавете други стойности, базирани на тестовите данни
      ]);
      callback(null, { insertId: 1 }); // Симулираме успешен запис
    });

    // Действие: Извикваме функцията с тестови данни
    db.saveToReadlist(
      1,
      {
        google_books_id: "google_books_id_example",
        title_en: "Example Title"
        // Добавете други необходими полета тук
      },
      (err, result) => {
        expect(err).toBeNull(); // Няма грешка
        expect(result).toHaveProperty("insertId", 1); // insertId трябва да бъде върнат
        done(); // Извикваме done, за да покажем, че тестът е завършен
      }
    );
  });
});

// Тест за функцията removeFromWatchlist
describe("removeFromWatchlist", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест, за да избегнем намеса
  });
  it("Трябва да премахне филм от watchlist", () => {
    const imdbID = testMovieData.imdbID;

    db.query.mockImplementation((query, values, callback) => {
      expect(query).toContain("DELETE FROM watchlist"); // Проверка за SQL заявката
      expect(values).toEqual([testUserId, imdbID]); // Проверка за стойностите
      callback(null, { affectedRows: 1 }); // Имитиране на успешен премахване
    });

    db.removeFromWatchlist(testUserId, imdbID, (err, result) => {
      expect(err).toBeNull(); // Няма грешки
      expect(result.affectedRows).toBe(1); // Проверка дали премахването е успешно
      done();
    });
  });
});

// Тест за функцията removeFromReadlist
describe("removeFromReadlist", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистване на моковете след всеки тест
  });

  it("should remove a book from the readlist using GoogleBooks ID", () => {
    db.query.mockImplementation((query, values, callback) => {
      expect(query).toContain("DELETE FROM readlist"); // Проверка дали заявката съдържа DELETE от readlist
      expect(values).toEqual([1, "google_books_id_example"]); // userId и google_books_id
      callback(null, { affectedRows: 1 }); // Симулиране на успешно изтриване
    });

    // Действие: Извикване на функцията с тестови данни
    db.removeFromReadlist(
      1,
      "GoogleBooks",
      "google_books_id_example",
      (err, result) => {
        expect(err).toBeNull(); // Не трябва да има грешка
        expect(result).toHaveProperty("affectedRows", 1); // affectedRows трябва да е 1
        done(); // Показва, че тестът е завършен
      }
    );
  });

  it("should remove a book from the readlist using Goodreads ID", () => {
    db.query.mockImplementation((query, values, callback) => {
      expect(query).toContain("DELETE FROM readlist"); // Проверка дали заявката съдържа DELETE от readlist
      expect(values).toEqual([1, "goodreads_id_example"]); // userId и goodreads_id
      callback(null, { affectedRows: 1 }); // Симулиране на успешно изтриване
    });

    // Действие: Извикване на функцията с тестови данни
    db.removeFromReadlist(
      1,
      "Goodreads",
      "goodreads_id_example",
      (err, result) => {
        expect(err).toBeNull(); // Не трябва да има грешка
        expect(result).toHaveProperty("affectedRows", 1); // affectedRows трябва да е 1
        done(); // Показва, че тестът е завършен
      }
    );
  });
});

// Тест за функцията checkRecommendationExistsInWatchlist
describe("checkRecommendationExistsInWatchlist", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мокът след всеки тест, за да избегнем намеса
  });
  it("Трябва да проверим дали препоръката вече съществува в watchlist", () => {
    const imdbID = testMovieData.imdbID;

    db.query.mockImplementation((query, values, callback) => {
      expect(query).toContain("SELECT * FROM watchlist"); // Проверка за SQL заявката
      expect(values).toEqual([testUserId, imdbID]); // Проверка за стойностите
      callback(null, [{ imdbID: imdbID }]); // Имитиране на съществуваща препоръка
    });

    db.checkRecommendationExistsInWatchlist(
      testUserId,
      imdbID,
      (err, result) => {
        expect(err).toBeNull(); // Няма грешки
        expect(result.length).toBeGreaterThan(0); // Препоръката съществува в watchlist
        done();
      }
    );
  });
});

// Тест за функцията checkRecommendationExistsInReadlist
describe("checkRecommendationExistsInReadlist", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистване на моковете след всеки тест
  });

  it("should check if a book exists in the readlist using GoogleBooks ID", () => {
    db.query.mockImplementation((query, values, callback) => {
      expect(query).toContain("SELECT * FROM readlist"); // Проверка дали заявката съдържа SELECT от readlist
      expect(values).toEqual([1, "google_books_id_example"]); // userId и google_books_id
      callback(null, [{ google_books_id: "google_books_id_example" }]); // Симулиране на намерена книга
    });

    // Действие: Извикване на функцията с тестови данни
    db.checkRecommendationExistsInReadlist(
      1,
      "GoogleBooks",
      "google_books_id_example",
      (err, result) => {
        expect(err).toBeNull(); // Не трябва да има грешка
        expect(result).toHaveLength(1); // Резултатът трябва да съдържа един елемент
        done(); // Показва, че тестът е завършен
      }
    );
  });

  it("should check if a book exists in the readlist using Goodreads ID", () => {
    db.query.mockImplementation((query, values, callback) => {
      expect(query).toContain("SELECT * FROM readlist"); // Проверка дали заявката съдържа SELECT от readlist
      expect(values).toEqual([1, "goodreads_id_example"]); // userId и goodreads_id
      callback(null, [{ goodreads_id: "goodreads_id_example" }]); // Симулиране на намерена книга
    });

    // Действие: Извикване на функцията с тестови данни
    db.checkRecommendationExistsInReadlist(
      1,
      "Goodreads",
      "goodreads_id_example",
      (err, result) => {
        expect(err).toBeNull(); // Не трябва да има грешка
        expect(result).toHaveLength(1); // Резултатът трябва да съдържа един елемент
        done(); // Показва, че тестът е завършен
      }
    );
  });
});

// Тест за функцията getUsersTopRecommendations
describe("getUsersTopRecommendations", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест, за да избегнем намеса
  });
  it("Трябва да върне най-добрите препоръки за потребителя", () => {
    db.query.mockImplementation((query, callback) => {
      expect(query).toContain("SELECT * FROM movies_series_recommendations"); // Проверка за SQL заявката
      callback(null, [{ title_en: "Test Movie", recommendations: 10 }]); // Имитиране на резултати
    });

    db.getUsersTopRecommendations(testUserId, (err, result) => {
      expect(err).toBeNull(); // Няма грешки
      expect(result.length).toBeGreaterThan(0); // Връща препоръки
      expect(result[0].title_en).toBe("Test Movie"); // Проверка на заглавието на филма
      done();
    });
  });
});
