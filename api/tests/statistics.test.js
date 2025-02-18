const db = require("../database");
const hf = require("../helper_functions");

// Мокираме целия обект с функции на базата данни
jest.mock("../database", () => ({
  query: jest.fn(), // Мокваме query функцията за заявки към базата данни
  getUsersCount: jest.fn(), // Мокваме getUsersCount функцията
  getAverageBoxOfficeAndScores: jest.fn(), // Мокваме getAverageBoxOfficeAndScores функцията
  getTopRecommendationsPlatform: jest.fn(), // Мокваме getTopRecommendationsPlatform функцията
  getTopCountries: jest.fn(), // Мокваме getTopCountries функцията
  getTopGenres: jest.fn(), // Мокваме getTopGenres функцията
  getGenrePopularityOverTime: jest.fn(), // Мокваме getGenrePopularityOverTime функцията
  getTopActors: jest.fn(), // Мокваме getTopActors функцията
  getTopDirectors: jest.fn(), // Мокваме getTopDirectors функцията
  getTopWriters: jest.fn(), // Мокваме getTopWriters функцията
  getOscarsByMovie: jest.fn(), // Мокваме getOscarsByMovie функцията
  getTotalAwardsByMovieOrSeries: jest.fn(), // Мокваме getTotalAwardsByMovieOrSeries функцията
  getTotalAwardsCount: jest.fn(), // Мокваме getTotalAwardsCount функцията
  getSortedDirectorsByProsperity: jest.fn(), // Мокваме getSortedDirectorsByProsperity функцията
  getSortedActorsByProsperity: jest.fn(), // Мокваме getSortedActorsByProsperity функцията
  getSortedWritersByProsperity: jest.fn(), // Мокваме getSortedWritersByProsperity функцията
  getSortedMoviesByProsperity: jest.fn(), // Мокваме getSortedMoviesByProsperity функцията
  getTopMoviesAndSeriesByMetascore: jest.fn(), // Мокваме getTopMoviesAndSeriesByMetascore функцията
  getTopMoviesAndSeriesByIMDbRating: jest.fn(), // Мокваме getTopMoviesAndSeriesByIMDbRating функцията
  getTopMoviesAndSeriesByRottenTomatoesRating: jest.fn(), // Мокваме getTopMoviesAndSeriesByRottenTomatoesRating функцията
  getUsersWatchlist: jest.fn(), // Мокваме getUsersWatchlist функцията
  getUsersReadlist: jest.fn(), // Мокваме getUsersReadlist функцията
  getAllUsersDistinctRecommendations: jest.fn(), // Мокваме getAllUsersDistinctRecommendations функцията
  getAllPlatformDistinctRecommendations: jest.fn(), // Мокваме getAllPlatformDistinctRecommendations функцията
  getLastGeneratedMoviesSeriesRecommendations: jest.fn() // Мокваме getLastGeneratedMoviesSeriesRecommendations функцията
}));

jest.mock("../helper_functions", () => ({
  translate: jest.fn() // Мокваме translate функцията
}));

// Тест за функцията getUsersCount
describe("getUsersCount", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да запази препоръка за филм/сериал в базата данни", () => {
    // Мокираме db.query за да симулираме резултат
    db.query.mockImplementationOnce((query, callback) => {
      callback(null, [{ user_count: 5 }]); // Симулираме резултат
    });

    // Действие: Извикваме функцията с тестови данни
    db.getUsersCount((err, result) => {
      // Проверка: Уверяваме се, че callback е извикан правилно
      expect(err).toBeNull(); // Няма грешка
      expect(mockCallback).toHaveBeenCalledWith(null, [{ user_count: 5 }]); // user_count трябва да е 5
      done(); // Извикваме done, за да покажем, че тестът е завършен
    });
  });
});

// Тест за getAverageBoxOfficeAndScores
describe("getAverageBoxOfficeAndScores", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да върне правилната средна стойност на бокс офиса и оценките", (done) => {
    // Мокираме db.getAverageBoxOfficeAndScores да симулира резултат
    db.getAverageBoxOfficeAndScores.mockImplementationOnce(
      (movieId, callback) => {
        callback(null, [{ avg_box_office: 1000000, avg_score: 8.5 }]); // Симулираме резултат
      }
    );

    // Действие: Извикваме функцията с тестови данни
    db.getAverageBoxOfficeAndScores(1, (err, result) => {
      // Проверка: Уверяваме се, че callback е извикан правилно
      expect(err).toBeNull();
      expect(result).toEqual([{ avg_box_office: 1000000, avg_score: 8.5 }]);
      done();
    });
  });
});

// Тест за getTopRecommendationsPlatform
describe("getTopRecommendationsPlatform", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да върне топ препоръките за платформата", (done) => {
    // Мокираме db.getTopRecommendationsPlatform да симулира резултат
    db.getTopRecommendationsPlatform.mockImplementationOnce((callback) => {
      callback(null, [{ title: "Top Movie", count: 10 }]); // Симулираме резултат
    });

    // Действие: Извикваме функцията
    db.getTopRecommendationsPlatform((err, result) => {
      // Проверка: Уверяваме се, че callback е извикан правилно
      expect(err).toBeNull();
      expect(result).toEqual([{ title: "Top Movie", count: 10 }]);
      done();
    });
  });
});

// Тест за getTopCountries
describe("getTopCountries", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да върне топ страните с най-много препоръки", (done) => {
    // Мокираме db.getTopCountries да симулира резултат
    db.getTopCountries.mockImplementationOnce((callback) => {
      callback(null, [
        { country: "USA", count: 20 },
        { country: "UK", count: 15 }
      ]); // Симулираме резултат
    });

    // Действие: Извикваме функцията
    db.getTopCountries((err, result) => {
      // Проверка: Уверяваме се, че callback е извикан правилно
      expect(err).toBeNull(); // Няма грешка
      expect(result).toEqual([
        { country: "USA", count: 20 },
        { country: "UK", count: 15 }
      ]); // Очакваме правилния резултат
      done(); // Завършваме теста
    });
  });
});

// Тест за getTopGenres
describe("getTopGenres", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да върне топ жанровете", (done) => {
    // Мокираме db.getTopGenres да симулира резултат
    db.getTopGenres.mockImplementationOnce((callback) => {
      callback(null, [
        { genre: "Action", count: 5 },
        { genre: "Drama", count: 4 }
      ]); // Симулираме резултат
    });

    // Действие: Извикваме функцията
    db.getTopGenres((err, result) => {
      // Проверка: Уверяваме се, че callback е извикан правилно
      expect(err).toBeNull();
      expect(result).toEqual([
        { genre: "Action", count: 5 },
        { genre: "Drama", count: 4 }
      ]);
      done();
    });
  });
});

// Тест за getGenrePopularityOverTime
describe("getGenrePopularityOverTime", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да върне популярността на жанровете с времето", (done) => {
    // Мокираме db.getGenrePopularityOverTime да симулира резултат
    db.getGenrePopularityOverTime.mockImplementationOnce((callback) => {
      callback(null, [
        { genre: "Action", year: 2020, popularity: 80 },
        { genre: "Comedy", year: 2021, popularity: 75 }
      ]); // Симулираме резултат с жанрове, година и популярност
    });

    // Действие: Извикваме функцията
    db.getGenrePopularityOverTime((err, result) => {
      // Проверка: Уверяваме се, че callback е извикан правилно
      expect(err).toBeNull(); // Няма грешка
      expect(result).toEqual([
        { genre: "Action", year: 2020, popularity: 80 },
        { genre: "Comedy", year: 2021, popularity: 75 }
      ]); // Очакваме правилния резултат
      done(); // Завършваме теста
    });
  });
});

// Тест за getTopActors
describe("getTopActors", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да върне най-добрите актьори по популярност с преведени имена", async () => {
    // Мокираме db.query да симулира резултат от заявката
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(null, [
        { actor: "Millie Bobby Brown", actor_count: 10 },
        { actor: "David Harbour", actor_count: 8 }
      ]); // Симулираме резултат с актьори и техния брой
    });

    // Мокираме hf.translate да преведе името на актьора
    const mockTranslate = jest
      .fn()
      .mockResolvedValueOnce("Мили Боби Браун")
      .mockResolvedValueOnce("Дейвид Харбър");

    // Мокираме хелпера hf с mockTranslate
    const hf = { translate: mockTranslate };

    // Действие: Извикваме функцията с тестови данни
    const limit = 2;
    db.getTopActors(limit, (err, result) => {
      // Проверка: Уверяваме се, че callback е извикан правилно
      expect(err).toBeNull(); // Няма грешка
      expect(result).toEqual([
        {
          actor_en: "Millie Bobby Brown",
          actor_bg: "Мили Боби Браун",
          actor_count: 10
        },
        { actor_en: "David Harbour", actor_bg: "Дейвид Харбър", actor_count: 8 }
      ]); // Очакваме преведени имена и правилния резултат

      // Проверка дали mockTranslate е бил извикан
      expect(mockTranslate).toHaveBeenCalledTimes(2);
      expect(mockTranslate).toHaveBeenCalledWith("Millie Bobby Brown");
      expect(mockTranslate).toHaveBeenCalledWith("David Harbour");
    });
  });
});

// Тест за getTopDirectors
describe("getTopDirectors", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да върне най-добрите режисьори по популярност с преведени имена", async () => {
    // Мокираме db.query да симулира резултат от заявката
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(null, [
        { director: "The Duffer Brothers", director_count: 12 },
        { director: "David Fincher", director_count: 9 }
      ]); // Симулираме резултат с режисьори и техния брой
    });

    // Мокираме hf.translate да преведе името на режисьора
    const mockTranslate = jest
      .fn()
      .mockResolvedValueOnce("Братята Дафър")
      .mockResolvedValueOnce("Дейвид Финчър");

    // Мокираме хелпера hf с mockTranslate
    const hf = { translate: mockTranslate };

    // Действие: Извикваме функцията с тестови данни
    const limit = 2;
    db.getTopDirectors(limit, (err, result) => {
      // Проверка: Уверяваме се, че callback е извикан правилно
      expect(err).toBeNull(); // Няма грешка
      expect(result).toEqual([
        {
          director_en: "The Duffer Brothers",
          director_bg: "Братята Дафър",
          director_count: 12
        },
        {
          director_en: "David Fincher",
          director_bg: "Дейвид Финчър",
          director_count: 9
        }
      ]); // Очакваме преведени имена и правилния резултат

      // Проверка дали mockTranslate е бил извикан
      expect(mockTranslate).toHaveBeenCalledTimes(2);
      expect(mockTranslate).toHaveBeenCalledWith("The Duffer Brothers");
      expect(mockTranslate).toHaveBeenCalledWith("David Fincher");
    });
  });
});

// Тест за getTopWriters
describe("getTopWriters", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да върне най-добрите сценаристи по популярност с преведени имена", async () => {
    // Мокираме db.query да симулира резултат от заявката
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(null, [
        { writer: "Steven Moffat", writer_count: 10 },
        { writer: "Chris Chibnall", writer_count: 8 }
      ]); // Симулираме резултат със сценаристи и техния брой
    });

    // Мокираме hf.translate да преведе името на сценариста
    const mockTranslate = jest
      .fn()
      .mockResolvedValueOnce("Стивън Моффат")
      .mockResolvedValueOnce("Крис Чибнъл");

    // Мокираме хелпера hf с mockTranslate
    const hf = { translate: mockTranslate };

    // Действие: Извикваме функцията с тестови данни
    const limit = 2;
    db.getTopWriters(limit, (err, result) => {
      // Проверка: Уверяваме се, че callback е извикан правилно
      expect(err).toBeNull(); // Няма грешка
      expect(result).toEqual([
        {
          writer_en: "Steven Moffat",
          writer_bg: "Стивън Моффат",
          writer_count: 10
        },
        {
          writer_en: "Chris Chibnall",
          writer_bg: "Крис Чибнъл",
          writer_count: 8
        }
      ]); // Очакваме преведени имена и правилния резултат

      // Проверка дали mockTranslate е бил извикан
      expect(mockTranslate).toHaveBeenCalledTimes(2);
      expect(mockTranslate).toHaveBeenCalledWith("Steven Moffat");
      expect(mockTranslate).toHaveBeenCalledWith("Chris Chibnall");
    });
  });
});

// Тест за getOscarsByMovie
describe("getOscarsByMovie", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да върне филмите с награди Оскар и техните номинации/победи", () => {
    // Мокираме db.query да симулира резултат от заявката
    db.query.mockImplementationOnce((query, callback) => {
      callback(null, [
        {
          id: 1,
          imdbID: "tt1234567",
          title_en: "Movie Title",
          title_bg: "Филмово Заглавие",
          type: "movie",
          awards: "Won 3 Oscars, Nominated for 2 Oscars",
          oscar_wins: 3,
          oscar_nominations: 2
        },
        {
          id: 2,
          imdbID: "tt7654321",
          title_en: "Another Movie",
          title_bg: "Друго Филм",
          type: "movie",
          awards: "Nominated for 1 Oscar",
          oscar_wins: 0,
          oscar_nominations: 1
        }
      ]); // Симулираме резултат с филм и награди
    });

    // Действие: Извикваме функцията
    db.getOscarsByMovie((err, result) => {
      // Проверка: Уверяваме се, че няма грешка
      expect(err).toBeNull();
      // Проверка: Резултатите трябва да съдържат филмите и правилните стойности за награди
      expect(result).toEqual([
        {
          id: 1,
          imdbID: "tt1234567",
          title_en: "Movie Title",
          title_bg: "Филмово Заглавие",
          type: "movie",
          awards: "Won 3 Oscars, Nominated for 2 Oscars",
          oscar_wins: 3,
          oscar_nominations: 2
        },
        {
          id: 2,
          imdbID: "tt7654321",
          title_en: "Another Movie",
          title_bg: "Друго Филм",
          type: "movie",
          awards: "Nominated for 1 Oscar",
          oscar_wins: 0,
          oscar_nominations: 1
        }
      ]); // Очакваме правилните стойности за оскарите

      done(); // Завършваме теста
    });
  });

  it("Трябва да обработи грешки от db.query коректно", () => {
    // Мокираме db.query да върне грешка
    db.query.mockImplementationOnce((query, callback) => {
      callback(new Error("Database error"), null);
    });

    // Действие: Извикваме функцията
    db.getOscarsByMovie((err, result) => {
      // Проверка: Проверяваме дали е върната грешка
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Database error");
      expect(result).toBeNull();
      done(); // Завършваме теста
    });
  });
});

// Тест за getTotalAwardsByMovieOrSeries
describe("getTotalAwardsByMovieOrSeries", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да върне филмите с общи награди и номинации", () => {
    // Мокираме db.query да симулира резултат от заявката
    db.query.mockImplementationOnce((query, callback) => {
      callback(null, [
        {
          id: 1,
          imdbID: "tt1234567",
          title_en: "Movie Title",
          title_bg: "Филмово Заглавие",
          type: "movie",
          awards: "3 wins, 2 nominations",
          total_wins: 3,
          total_nominations: 2
        },
        {
          id: 2,
          imdbID: "tt7654321",
          title_en: "Another Movie",
          title_bg: "Друго Филм",
          type: "movie",
          awards: "1 win, 1 nomination",
          total_wins: 1,
          total_nominations: 1
        }
      ]); // Симулираме резултат с филм и награди
    });

    // Действие: Извикваме функцията
    db.getTotalAwardsByMovieOrSeries((err, result) => {
      // Проверка: Уверяваме се, че няма грешка
      expect(err).toBeNull();
      // Проверка: Резултатите трябва да съдържат филмите и правилните стойности за награди
      expect(result).toEqual([
        {
          id: 1,
          imdbID: "tt1234567",
          title_en: "Movie Title",
          title_bg: "Филмово Заглавие",
          type: "movie",
          awards: "3 wins, 2 nominations",
          total_wins: 3,
          total_nominations: 2
        },
        {
          id: 2,
          imdbID: "tt7654321",
          title_en: "Another Movie",
          title_bg: "Друго Филм",
          type: "movie",
          awards: "1 win, 1 nomination",
          total_wins: 1,
          total_nominations: 1
        }
      ]); // Очакваме правилните стойности за наградите

      done(); // Завършваме теста
    });
  });

  it("Трябва да обработи грешки от db.query коректно", () => {
    // Мокираме db.query да върне грешка
    db.query.mockImplementationOnce((query, callback) => {
      callback(new Error("Database error"), null);
    });

    // Действие: Извикваме функцията
    db.getTotalAwardsByMovieOrSeries((err, result) => {
      // Проверка: Проверяваме дали е върната грешка
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Database error");
      expect(result).toBeNull();
      done(); // Завършваме теста
    });
  });
});

// Тест за getTotalAwardsCount
describe("getTotalAwardsCount", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да върне общия брой награди и номинации", () => {
    // Мокираме db.query да симулира резултат от заявката
    db.query.mockImplementationOnce((query, callback) => {
      callback(null, [
        {
          total_oscar_wins: 10,
          total_oscar_nominations: 15,
          total_awards_wins: 50,
          total_awards_nominations: 80
        }
      ]); // Симулираме резултат с общия брой награди
    });

    // Действие: Извикваме функцията
    db.getTotalAwardsCount((err, result) => {
      // Проверка: Уверяваме се, че няма грешка
      expect(err).toBeNull();
      // Проверка: Резултатите трябва да съдържат правилните стойности за наградите и номинациите
      expect(result).toEqual([
        {
          total_oscar_wins: 10,
          total_oscar_nominations: 15,
          total_awards_wins: 50,
          total_awards_nominations: 80
        }
      ]); // Очакваме правилните стойности за наградите

      done(); // Завършваме теста
    });
  });

  it("Трябва да обработи грешки от db.query коректно", () => {
    // Мокираме db.query да върне грешка
    db.query.mockImplementationOnce((query, callback) => {
      callback(new Error("Database error"), null);
    });

    // Действие: Извикваме функцията
    db.getTotalAwardsCount((err, result) => {
      // Проверка: Проверяваме дали е върната грешка
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Database error");
      expect(result).toBeNull();
      done(); // Завършваме теста
    });
  });
});

// Тест за getSortedDirectorsByProsperity
describe("getSortedDirectorsByProsperity", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да изчисли и сортира режисьорите по просперитет", () => {
    // Мокираме db.query да симулира резултат от заявката
    db.query.mockImplementationOnce((query, callback) => {
      callback(null, [
        {
          director: "Director A",
          imdbRating: 7.5,
          metascore: 80,
          boxOffice: "$500,000",
          rottenTomatoes: "85%",
          total_wins: 5,
          total_nominations: 10,
          avg_runtime: 120,
          total_recommendations: 15
        },
        {
          director: "Director B",
          imdbRating: 8.0,
          metascore: 85,
          boxOffice: "$1,000,000",
          rottenTomatoes: "90%",
          total_wins: 8,
          total_nominations: 12,
          avg_runtime: 130,
          total_recommendations: 20
        }
      ]); // Симулираме резултат от заявката
    });

    // Извикваме функцията
    db.getSortedDirectorsByProsperity((err, result) => {
      // Проверка: Уверяваме се, че няма грешка
      expect(err).toBeNull();
      // Проверка: Резултатите трябва да съдържат режисьорите с правилните данни
      expect(result).toEqual([
        {
          director: "Director B",
          imdbRating: 8.0,
          metascore: 85,
          boxOffice: "$1,000,000",
          rottenTomatoes: "90%",
          total_wins: 8,
          total_nominations: 12,
          avg_runtime: 130,
          total_recommendations: 20,
          prosperityScore: 1.0
        },
        {
          director: "Director A",
          imdbRating: 7.5,
          metascore: 80,
          boxOffice: "$500,000",
          rottenTomatoes: "85%",
          total_wins: 5,
          total_nominations: 10,
          avg_runtime: 120,
          total_recommendations: 15,
          prosperityScore: 0.75
        }
      ]); // Очакваме правилно сортирани режисьори по просперитет

      done(); // Завършваме теста
    });
  });

  it("Трябва да обработи грешки от db.query коректно", () => {
    // Мокираме db.query да върне грешка
    db.query.mockImplementationOnce((query, callback) => {
      callback(new Error("Database error"), null);
    });

    // Извикваме функцията
    db.getSortedDirectorsByProsperity((err, result) => {
      // Проверка: Проверяваме дали е върната грешка
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Database error");
      expect(result).toBeNull();
      done(); // Завършваме теста
    });
  });
});

// Тест за getSortedActorsByProsperity
describe("getSortedActorsByProsperity", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да изчисли и сортира актьорите по просперитет", () => {
    // Мокираме db.query да симулира резултат от заявката
    db.query.mockImplementationOnce((query, callback) => {
      callback(null, [
        {
          actor: "Actor A",
          avg_imdb_rating: 7.5,
          avg_metascore: 80,
          total_box_office: "$500,000",
          avg_rotten_tomatoes: "85%",
          total_wins: 5,
          total_nominations: 10,
          total_recommendations: 15
        },
        {
          actor: "Actor B",
          avg_imdb_rating: 8.0,
          avg_metascore: 85,
          total_box_office: "$1,000,000",
          avg_rotten_tomatoes: "90%",
          total_wins: 8,
          total_nominations: 12,
          total_recommendations: 20
        }
      ]); // Симулираме резултат от заявката
    });

    // Извикваме функцията
    db.getSortedActorsByProsperity((err, result) => {
      // Проверка: Уверяваме се, че няма грешка
      expect(err).toBeNull();
      // Проверка: Резултатите трябва да съдържат актьорите с правилните данни
      expect(result).toEqual([
        {
          actor: "Actor B",
          avg_imdb_rating: 8.0,
          avg_metascore: 85,
          total_box_office: "$1,000,000",
          avg_rotten_tomatoes: "90%",
          total_wins: 8,
          total_nominations: 12,
          total_recommendations: 20,
          prosperityScore: 1.0
        },
        {
          actor: "Actor A",
          avg_imdb_rating: 7.5,
          avg_metascore: 80,
          total_box_office: "$500,000",
          avg_rotten_tomatoes: "85%",
          total_wins: 5,
          total_nominations: 10,
          total_recommendations: 15,
          prosperityScore: 0.75
        }
      ]); // Очакваме правилно сортирани актьори по просперитет

      done(); // Завършваме теста
    });
  });

  it("Трябва да обработи грешки от db.query коректно", () => {
    // Мокираме db.query да върне грешка
    db.query.mockImplementationOnce((query, callback) => {
      callback(new Error("Database error"), null);
    });

    // Извикваме функцията
    db.getSortedActorsByProsperity((err, result) => {
      // Проверка: Проверяваме дали е върната грешка
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Database error");
      expect(result).toBeNull();
      done(); // Завършваме теста
    });
  });
});

// Тест за getSortedWritersByProsperity
describe("getSortedWritersByProsperity", () => {
  it("трябва да върне писателите сортирани по рейтинг на просперитет", () => {
    // Мокване на резултатите от базата данни
    const mockDbResults = [
      {
        writer: "Writer A",
        avg_imdb_rating: 8.5,
        avg_metascore: 75,
        total_box_office: "$100,000,000",
        avg_rotten_tomatoes: "85%",
        total_wins: 5,
        total_nominations: 10,
        imdbID: "tt1234567"
      },
      {
        writer: "Writer B",
        avg_imdb_rating: 7.0,
        avg_metascore: 65,
        total_box_office: "$50,000,000",
        avg_rotten_tomatoes: "60%",
        total_wins: 3,
        total_nominations: 8,
        imdbID: "tt2345678"
      }
    ];

    // Мокване на резултатите за превод
    hf.translate.mockResolvedValueOnce("Писател A");
    hf.translate.mockResolvedValueOnce("Писател B");

    // Мокваме функцията за query да върне резултатите
    db.query.mockImplementationOnce((query, callback) => {
      callback(null, mockDbResults);
    });

    // Извикване на тестируемата функция
    db.getSortedWritersByProsperity((err, result) => {
      // Проверки за резултатите
      expect(err).toBeNull();
      expect(result).toHaveLength(2); // Проверка за броя на писателите в резултата

      // Проверка за сортиране на писателите по просперитет
      expect(result[0].writer_bg).toBe("Писател A"); // Писател A трябва да е на първо място
      expect(result[1].writer_bg).toBe("Писател B"); // Писател B трябва да е на второ място

      // Проверка на просперитетто за Писател A
      expect(result[0].prosperityScore).toBeGreaterThan(
        result[1].prosperityScore
      ); // Писател A трябва да има по-висок рейтинг
    });
  });
});

// Тест за getSortedMoviesByProsperity
describe("getSortedMoviesByProsperity", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да върне филмите, сортирани по просперитет", () => {
    // Мокираме db.query да симулира резултат
    db.query.mockImplementationOnce((query, callback) => {
      callback(null, [
        {
          imdbID: "tt1234567",
          title_en: "Movie 1",
          title_bg: "Филм 1",
          type: "movie",
          imdbRating: 7.5,
          metascore: 80,
          total_box_office: "$500,000,000",
          rotten_tomatoes: "90%",
          total_recommendations: 50,
          total_wins: 5,
          total_nominations: 10,
          genre_en: "Action",
          genre_bg: "Екшън"
        },
        {
          imdbID: "tt2345678",
          title_en: "Movie 2",
          title_bg: "Филм 2",
          type: "movie",
          imdbRating: 8.0,
          metascore: 85,
          total_box_office: "$300,000,000",
          rotten_tomatoes: "80%",
          total_recommendations: 30,
          total_wins: 3,
          total_nominations: 7,
          genre_en: "Drama",
          genre_bg: "Драма"
        }
      ]);
    });

    // Действие: Извикваме функцията
    db.getSortedMoviesByProsperity((err, result) => {
      // Проверка: Уверяваме се, че callback е извикан правилно
      expect(err).toBeNull();
      expect(result).toEqual([
        {
          imdbID: "tt1234567",
          title_en: "Movie 1",
          title_bg: "Филм 1",
          type: "movie",
          imdbRating: 7.5,
          metascore: 80,
          total_box_office: "$500,000,000",
          rotten_tomatoes: "90%",
          total_recommendations: 50,
          total_wins: 5,
          total_nominations: 10,
          genre_en: "Action",
          genre_bg: "Екшън",
          prosperityScore: 2.35
        },
        {
          imdbID: "tt2345678",
          title_en: "Movie 2",
          title_bg: "Филм 2",
          type: "movie",
          imdbRating: 8.0,
          metascore: 85,
          total_box_office: "$300,000,000",
          rotten_tomatoes: "80%",
          total_recommendations: 30,
          total_wins: 3,
          total_nominations: 7,
          genre_en: "Drama",
          genre_bg: "Драма",
          prosperityScore: 1.9
        }
      ]);
      done();
    });
  });
});

// Тест за getTopMoviesAndSeriesByMetascore
describe("getTopMoviesAndSeriesByMetascore", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да върне топ филмите и сериалите, сортирани по метаоценка", () => {
    // Мокираме db.query да симулира резултат
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(null, [
        {
          imdbID: "tt1234567",
          title_en: "Movie 1",
          title_bg: "Филм 1",
          type: "movie",
          imdbRating: 8.0,
          metascore: 85,
          boxOffice: "$100,000,000",
          awards: "1 win, 2 nominations"
        },
        {
          imdbID: "tt2345678",
          title_en: "Movie 2",
          title_bg: "Филм 2",
          type: "movie",
          imdbRating: 7.5,
          metascore: 90,
          boxOffice: "$150,000,000",
          awards: "2 wins, 3 nominations"
        }
      ]);
    });

    // Действие: Извикваме функцията
    db.getTopMoviesAndSeriesByMetascore(2, (err, result) => {
      // Проверка: Уверяваме се, че callback е извикан правилно
      expect(err).toBeNull();
      expect(result).toEqual([
        {
          imdbID: "tt2345678",
          title_en: "Movie 2",
          title_bg: "Филм 2",
          type: "movie",
          imdbRating: 7.5,
          metascore: 90,
          boxOffice: "$150,000,000",
          awards: "2 wins, 3 nominations"
        },
        {
          imdbID: "tt1234567",
          title_en: "Movie 1",
          title_bg: "Филм 1",
          type: "movie",
          imdbRating: 8.0,
          metascore: 85,
          boxOffice: "$100,000,000",
          awards: "1 win, 2 nominations"
        }
      ]);
      done();
    });
  });
});

// Тест за getTopMoviesAndSeriesByIMDbRating
describe("getTopMoviesAndSeriesByIMDbRating", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да върне топ филмите и сериалите, сортирани по IMDb рейтинг", (done) => {
    // Мокираме db.getTopMoviesAndSeriesByIMDbRating да симулира резултат
    db.getTopMoviesAndSeriesByIMDbRating.mockImplementationOnce((callback) => {
      callback(null, [
        { title: "Inception", imdb_rating: 9.0 },
        { title: "The Dark Knight", imdb_rating: 8.9 }
      ]); // Симулираме резултат
    });

    // Действие: Извикваме функцията
    db.getTopMoviesAndSeriesByIMDbRating((err, result) => {
      // Проверка: Уверяваме се, че callback е извикан правилно
      expect(err).toBeNull();
      expect(result).toEqual([
        { title: "Inception", imdb_rating: 9.0 },
        { title: "The Dark Knight", imdb_rating: 8.9 }
      ]);
      done();
    });
  });
});

// Тест за getTopMoviesAndSeriesByRottenTomatoesRating
describe("getTopMoviesAndSeriesByRottenTomatoesRating", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да върне топ филмите и сериалите, сортирани по рейтинг на Rotten Tomatoes", () => {
    // Мокираме db.query да симулира резултат
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(null, [
        {
          imdbID: "tt1234567",
          title_en: "Movie 1",
          title_bg: "Филм 1",
          type: "movie",
          imdbRating: 8.0,
          metascore: 85,
          boxOffice: "$100,000,000",
          awards: "1 win, 2 nominations",
          ratings:
            '[{"Source": "Internet Movie Database", "Value": "8.0/10"}, {"Source": "Rotten Tomatoes", "Value": "85%"}]',
          rottenTomatoes: 85
        },
        {
          imdbID: "tt2345678",
          title_en: "Movie 2",
          title_bg: "Филм 2",
          type: "movie",
          imdbRating: 7.5,
          metascore: 90,
          boxOffice: "$150,000,000",
          awards: "2 wins, 3 nominations",
          ratings:
            '[{"Source": "Internet Movie Database", "Value": "7.5/10"}, {"Source": "Rotten Tomatoes", "Value": "90%"}]',
          rottenTomatoes: 90
        }
      ]);
    });

    // Действие: Извикваме функцията
    db.getTopMoviesAndSeriesByRottenTomatoesRating(2, (err, result) => {
      // Проверка: Уверяваме се, че callback е извикан правилно
      expect(err).toBeNull();
      expect(result).toEqual([
        {
          imdbID: "tt2345678",
          title_en: "Movie 2",
          title_bg: "Филм 2",
          type: "movie",
          imdbRating: 7.5,
          metascore: 90,
          boxOffice: "$150,000,000",
          awards: "2 wins, 3 nominations",
          ratings:
            '[{"Source": "Internet Movie Database", "Value": "7.5/10"}, {"Source": "Rotten Tomatoes", "Value": "90%"}]',
          rottenTomatoes: 90
        },
        {
          imdbID: "tt1234567",
          title_en: "Movie 1",
          title_bg: "Филм 1",
          type: "movie",
          imdbRating: 8.0,
          metascore: 85,
          boxOffice: "$100,000,000",
          awards: "1 win, 2 nominations",
          ratings:
            '[{"Source": "Internet Movie Database", "Value": "8.0/10"}, {"Source": "Rotten Tomatoes", "Value": "85%"}]',
          rottenTomatoes: 85
        }
      ]);
      done();
    });
  });
});

// Тест за getUsersWatchlist
describe("getUsersWatchlist", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да върне списъка за гледане на потребителя с изчислени резултати за просперитет", () => {
    // Мокираме db.query да симулира резултат
    db.query.mockImplementationOnce((query, callback) => {
      callback(null, [
        {
          user_id: 1,
          title_en: "Movie 1",
          imdbRating: 8.0,
          metascore: 85,
          boxOffice: "$100,000,000",
          awards: "1 win, 2 nominations",
          type: "movie"
        },
        {
          user_id: 1,
          title_en: "Movie 2",
          imdbRating: 7.5,
          metascore: 90,
          boxOffice: "$150,000,000",
          awards: "2 wins, 3 nominations",
          type: "movie"
        }
      ]);
    });

    // Действие: Извикваме функцията
    db.getUsersWatchlist(1, (err, result) => {
      // Проверка: Уверяваме се, че callback е извикан правилно
      expect(err).toBeNull();
      expect(result).toEqual({
        savedCount: { movies: 2, series: 0 },
        watchlist: [
          {
            user_id: 1,
            title_en: "Movie 1",
            imdbRating: 8.0,
            metascore: 85,
            boxOffice: "$100,000,000",
            awards: "1 win, 2 nominations",
            type: "movie",
            prosperityScore: 8.5 // Примерен изчислен резултат за просперитет
          },
          {
            user_id: 1,
            title_en: "Movie 2",
            imdbRating: 7.5,
            metascore: 90,
            boxOffice: "$150,000,000",
            awards: "2 wins, 3 nominations",
            type: "movie",
            prosperityScore: 8.3 // Примерен изчислен резултат за просперитет
          }
        ]
      });
      done();
    });
  });

  it("Трябва да върне съобщение, ако няма записи в списъка за гледане", () => {
    // Мокираме db.query да симулира резултат без записи
    db.query.mockImplementationOnce((query, callback) => {
      callback(null, []);
    });

    // Действие: Извикваме функцията
    db.getUsersWatchlist(1, (err, result) => {
      // Проверка: Уверяваме се, че няма записи в списъка
      expect(err).toBeNull();
      expect(result).toEqual({
        message: "Няма записи в списъка за гледане за този потребител."
      });
      done();
    });
  });
});

// Тест за getUsersReadlist
describe("getUsersReadlist", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да върне списъка за четене на потребителя", () => {
    // Мокираме db.query да симулира резултат
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(null, [
        {
          user_id: 1,
          title_en: "Book 1",
          author: "Author 1",
          type: "book"
        },
        {
          user_id: 1,
          title_en: "Book 2",
          author: "Author 2",
          type: "book"
        }
      ]);
    });

    // Действие: Извикваме функцията
    db.getUsersReadlist(1, (err, result) => {
      // Проверка: Уверяваме се, че callback е извикан правилно
      expect(err).toBeNull();
      expect(result).toEqual([
        {
          user_id: 1,
          title_en: "Book 1",
          author: "Author 1",
          type: "book"
        },
        {
          user_id: 1,
          title_en: "Book 2",
          author: "Author 2",
          type: "book"
        }
      ]);
      done();
    });
  });
});

// Тест за getAllUsersDistinctRecommendations
describe("getAllUsersDistinctRecommendations", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да върне всички различни препоръки за потребителя с общия брой препоръки", () => {
    // Мокираме db.query да симулира резултат
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(null, [
        {
          imdbID: "tt1234567",
          genre_en: "Action",
          type: "movie",
          runtime: 120,
          year: 2020,
          rated: "PG-13"
        },
        {
          imdbID: "tt7654321",
          genre_en: "Comedy",
          type: "series",
          runtime: 30,
          year: 2021,
          rated: "PG"
        }
      ]);
    });

    // Действие: Извикваме функцията
    db.getAllUsersDistinctRecommendations(1, (err, result) => {
      // Проверка: Уверяваме се, че callback е извикан правилно
      expect(err).toBeNull();
      expect(result).toEqual({
        total_count: 2, // Брой препоръки
        recommendations: [
          {
            imdbID: "tt1234567",
            genre_en: "Action",
            type: "movie",
            runtime: 120,
            year: 2020,
            rated: "PG-13"
          },
          {
            imdbID: "tt7654321",
            genre_en: "Comedy",
            type: "series",
            runtime: 30,
            year: 2021,
            rated: "PG"
          }
        ]
      });
      done();
    });
  });

  it("Трябва да върне съобщение, ако няма препоръки за потребителя", () => {
    // Мокираме db.query да симулира резултат без препоръки
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(null, []);
    });

    // Действие: Извикваме функцията
    db.getAllUsersDistinctRecommendations(1, (err, result) => {
      // Проверка: Уверяваме се, че няма препоръки
      expect(err).toBeNull();
      expect(result).toEqual({
        total_count: 0,
        recommendations: []
      });
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
    db.getAllUsersDistinctRecommendations(1, (err, result) => {
      // Проверка: Уверяваме се, че е върната грешка
      expect(err).toEqual(new Error(errorMessage));
      expect(result).toBeNull();
      done();
    });
  });
});

// Тест за getAllPlatformDistinctRecommendations
describe("getAllPlatformDistinctRecommendations", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да върне всички различни препоръки за платформата с общия брой препоръки", () => {
    // Мокираме db.query да симулира резултат
    db.query.mockImplementationOnce((query, callback) => {
      callback(null, [
        {
          imdbID: "tt1234567",
          genre_en: "Action",
          type: "movie",
          runtime: 120,
          year: 2020,
          rated: "PG-13"
        },
        {
          imdbID: "tt7654321",
          genre_en: "Comedy",
          type: "series",
          runtime: 30,
          year: 2021,
          rated: "PG"
        }
      ]);
    });

    // Действие: Извикваме функцията
    db.getAllPlatformDistinctRecommendations((err, result) => {
      // Проверка: Уверяваме се, че callback е извикан правилно
      expect(err).toBeNull();
      expect(result).toEqual({
        total_count: 2, // Брой препоръки
        recommendations: [
          {
            imdbID: "tt1234567",
            genre_en: "Action",
            type: "movie",
            runtime: 120,
            year: 2020,
            rated: "PG-13"
          },
          {
            imdbID: "tt7654321",
            genre_en: "Comedy",
            type: "series",
            runtime: 30,
            year: 2021,
            rated: "PG"
          }
        ]
      });
      done();
    });
  });

  it("Трябва да върне съобщение, ако няма препоръки за платформата", () => {
    // Мокираме db.query да симулира резултат без препоръки
    db.query.mockImplementationOnce((query, callback) => {
      callback(null, []);
    });

    // Действие: Извикваме функцията
    db.getAllPlatformDistinctRecommendations((err, result) => {
      // Проверка: Уверяваме се, че няма препоръки
      expect(err).toBeNull();
      expect(result).toEqual({
        total_count: 0,
        recommendations: []
      });
      done();
    });
  });

  it("Трябва да върне грешка, ако има проблем с изпълнението на заявката", () => {
    const errorMessage = "Database error";
    // Мокираме db.query да симулира грешка
    db.query.mockImplementationOnce((query, callback) => {
      callback(new Error(errorMessage), null);
    });

    // Действие: Извикваме функцията
    db.getAllPlatformDistinctRecommendations((err, result) => {
      // Проверка: Уверяваме се, че е върната грешка
      expect(err).toEqual(new Error(errorMessage));
      expect(result).toBeNull();
      done();
    });
  });
});

// Тест за getLastGeneratedMoviesSeriesRecommendations
describe("getLastGeneratedMoviesSeriesRecommendations", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да върне последните препоръки за даден потребител на определена дата", () => {
    // Мокираме db.query да симулира резултат
    db.query.mockImplementationOnce((query, params, callback) => {
      expect(params).toEqual([1, "2025-02-18"]); // Проверяваме, че параметрите са правилни
      callback(null, [
        {
          imdbID: "tt1234567",
          genre_en: "Action",
          type: "movie",
          runtime: 120,
          year: 2020,
          rated: "PG-13",
          date: "2025-02-18",
          user_id: 1
        }
      ]);
    });

    // Действие: Извикваме функцията
    db.getLastGeneratedMoviesSeriesRecommendations(
      1,
      "2025-02-18",
      (err, result) => {
        // Проверка: Уверяваме се, че callback е извикан правилно
        expect(err).toBeNull();
        expect(result).toEqual([
          {
            imdbID: "tt1234567",
            genre_en: "Action",
            type: "movie",
            runtime: 120,
            year: 2020,
            rated: "PG-13",
            date: "2025-02-18",
            user_id: 1
          }
        ]);
        done();
      }
    );
  });

  it("Трябва да върне празен масив, ако няма препоръки за дадената дата", () => {
    // Мокираме db.query да симулира резултат без препоръки
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(null, []);
    });

    // Действие: Извикваме функцията
    db.getLastGeneratedMoviesSeriesRecommendations(
      1,
      "2025-02-18",
      (err, result) => {
        // Проверка: Уверяваме се, че няма препоръки
        expect(err).toBeNull();
        expect(result).toEqual([]);
        done();
      }
    );
  });

  it("Трябва да върне грешка, ако има проблем с изпълнението на заявката", () => {
    const errorMessage = "Database error";
    // Мокираме db.query да симулира грешка
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(new Error(errorMessage), null);
    });

    // Действие: Извикваме функцията
    db.getLastGeneratedMoviesSeriesRecommendations(
      1,
      "2025-02-18",
      (err, result) => {
        // Проверка: Уверяваме се, че е върната грешка
        expect(err).toEqual(new Error(errorMessage));
        expect(result).toBeNull();
        done();
      }
    );
  });
});
