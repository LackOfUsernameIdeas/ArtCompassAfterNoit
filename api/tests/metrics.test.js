const db = require("../database"); // Импортиране на mock версия на базата данни

// Мокираме целия обект с функции на базата данни
jest.mock("../database", () => ({
  savePrecision: jest.fn(), // Мокваме savePrecision функцията
  saveRecall: jest.fn(), // Мокваме saveRecall функцията
  saveF1Score: jest.fn(), // Мокваме saveF1Score функцията
  saveAnalysis: jest.fn(), // Мокваме saveAnalysis функцията
  calculateAverageMetrics: jest.fn(), // Мокваме calculateAverageMetrics функцията
  query: jest.fn() // Мокваме query функцията за заявки към базата данни
}));

// Тест за savePrecision
describe("savePrecision", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да запише нови стойности за Precision, ако стойностите се променят", () => {
    // Мокираме db.query да симулира резултат за последните запазени стойности
    db.query.mockImplementationOnce((query, values, callback) => {
      expect(values).toEqual([1, "movie", 0.85, 0.9, 80, 100]);
      callback(null, { affectedRows: 1 });
    });

    // Мокираме db.query да симулира предишни резултати
    db.query.mockImplementationOnce((query, values, callback) => {
      expect(values).toEqual([1, "movie"]);
      callback(null, [
        {
          precision_exact: 0.75
        }
      ]);
    });

    // Данни, които ще се записват
    const data = {
      precision_exact: 0.85,
      precision_fixed: 0.9,
      precision_percentage: 80,
      relevant_recommendations_count: 100,
      total_recommendations_count: 150
    };

    // Действие: Извикваме функцията
    db.savePrecision(1, "movie", data, (err, result) => {
      // Проверка: Уверяваме се, че данните са записани
      expect(err).toBeNull();
      expect(result).toEqual({ affectedRows: 1 });
      done();
    });
  });

  it("Трябва да върне съобщение, ако няма нови данни за записване", () => {
    // Мокираме db.query да симулира резултат за последните запазени стойности
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, [
        {
          precision_exact: 0.85
        }
      ]);
    });

    // Данни, които ще се запишат (няма промяна)
    const data = {
      precision_exact: 0.85,
      precision_fixed: 0.9,
      precision_percentage: 80,
      relevant_recommendations_count: 100,
      total_recommendations_count: 150
    };

    // Действие: Извикваме функцията
    db.savePrecision(1, "movie", data, (err, result) => {
      // Проверка: Уверяваме се, че няма нови данни за запазване
      expect(err).toBeNull();
      expect(result).toEqual({ message: "No new Precision data to save." });
      done();
    });
  });

  it("Трябва да върне грешка, ако има проблем с изпълнението на запитването", () => {
    const errorMessage = "Database error";
    // Мокираме db.query да симулира грешка
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(new Error(errorMessage), null);
    });

    // Данни за теста
    const data = {
      precision_exact: 0.85,
      precision_fixed: 0.9,
      precision_percentage: 80,
      relevant_recommendations_count: 100,
      total_recommendations_count: 150
    };

    // Действие: Извикваме функцията
    db.savePrecision(1, "movie", data, (err, result) => {
      // Проверка: Уверяваме се, че е върната грешка
      expect(err).toEqual(new Error(errorMessage));
      expect(result).toBeNull();
      done();
    });
  });
});

// Тест за saveRecall
describe("saveRecall", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да запише нови стойности за Recall, ако данните се променят", () => {
    // Мокираме db.query да симулира резултат за последните запазени стойности
    db.query.mockImplementationOnce((query, values, callback) => {
      expect(values).toEqual([1, "movie", 0.8, 0.9, 85, 5, 10, 15, 20]);
      callback(null, { affectedRows: 1 });
    });

    // Мокираме db.query да симулира предишни резултати
    db.query.mockImplementationOnce((query, values, callback) => {
      expect(values).toEqual([1, "movie"]);
      callback(null, [
        {
          recall_exact: 0.7,
          relevant_platform_recommendations_count: 4,
          total_platform_recommendations_count: 18
        }
      ]);
    });

    // Данни, които ще се записват
    const data = {
      recall_exact: 0.8,
      recall_fixed: 0.9,
      recall_percentage: 85,
      relevant_user_recommendations_count: 5,
      relevant_platform_recommendations_count: 10,
      total_user_recommendations_count: 15,
      total_platform_recommendations_count: 20
    };

    // Действие: Извикваме функцията
    db.saveRecall(1, "movie", data, (err, result) => {
      // Проверка: Уверяваме се, че данните са записани
      expect(err).toBeNull();
      expect(result).toEqual({ affectedRows: 1 });
      done();
    });
  });

  it("Трябва да върне съобщение, ако няма нови данни за запазване", () => {
    // Мокираме db.query да симулира резултат за последните запазени стойности
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, [
        {
          recall_exact: 0.8,
          relevant_platform_recommendations_count: 10,
          total_platform_recommendations_count: 20
        }
      ]);
    });

    // Данни, които ще се запишат (няма промяна)
    const data = {
      recall_exact: 0.8,
      recall_fixed: 0.9,
      recall_percentage: 85,
      relevant_user_recommendations_count: 5,
      relevant_platform_recommendations_count: 10,
      total_user_recommendations_count: 15,
      total_platform_recommendations_count: 20
    };

    // Действие: Извикваме функцията
    db.saveRecall(1, "movie", data, (err, result) => {
      // Проверка: Уверяваме се, че няма нови данни за запазване
      expect(err).toBeNull();
      expect(result).toEqual({ message: "No new recall data to save." });
      done();
    });
  });

  it("Трябва да върне грешка, ако има проблем с изпълнението на запитването", () => {
    const errorMessage = "Database error";
    // Мокираме db.query да симулира грешка
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(new Error(errorMessage), null);
    });

    // Данни за теста
    const data = {
      recall_exact: 0.8,
      recall_fixed: 0.9,
      recall_percentage: 85,
      relevant_user_recommendations_count: 5,
      relevant_platform_recommendations_count: 10,
      total_user_recommendations_count: 15,
      total_platform_recommendations_count: 20
    };

    // Действие: Извикваме функцията
    db.saveRecall(1, "movie", data, (err, result) => {
      // Проверка: Уверяваме се, че е върната грешка
      expect(err).toEqual(new Error(errorMessage));
      expect(result).toBeNull();
      done();
    });
  });
});

// Тест за saveF1Score
describe("saveF1Score", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да запише нови стойности за F1 Score, ако стойностите се променят", () => {
    // Мокираме db.query да симулира резултат за последните запазени стойности
    db.query.mockImplementationOnce((query, values, callback) => {
      expect(values).toEqual([1, "movie", 0.85, 0.9, 80]);
      callback(null, { affectedRows: 1 });
    });

    // Мокираме db.query да симулира предишни резултати
    db.query.mockImplementationOnce((query, values, callback) => {
      expect(values).toEqual([1, "movie"]);
      callback(null, [
        {
          f1_score_exact: 0.75
        }
      ]);
    });

    // Данни, които ще се записват
    const data = {
      f1_score_exact: 0.85,
      f1_score_fixed: 0.9,
      f1_score_percentage: 80
    };

    // Действие: Извикваме функцията
    db.saveF1Score(1, "movie", data, (err, result) => {
      // Проверка: Уверяваме се, че данните са записани
      expect(err).toBeNull();
      expect(result).toEqual({ affectedRows: 1 });
      done();
    });
  });

  it("Трябва да върне съобщение, ако няма нови данни за записване", () => {
    // Мокираме db.query да симулира резултат за последните запазени стойности
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, [
        {
          f1_score_exact: 0.85
        }
      ]);
    });

    // Данни, които ще се запишат (няма промяна)
    const data = {
      f1_score_exact: 0.85,
      f1_score_fixed: 0.9,
      f1_score_percentage: 80
    };

    // Действие: Извикваме функцията
    db.saveF1Score(1, "movie", data, (err, result) => {
      // Проверка: Уверяваме се, че няма нови данни за запазване
      expect(err).toBeNull();
      expect(result).toEqual({ message: "No new F1 Score data to save." });
      done();
    });
  });

  it("Трябва да върне грешка, ако има проблем с изпълнението на запитването", () => {
    const errorMessage = "Database error";
    // Мокираме db.query да симулира грешка
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(new Error(errorMessage), null);
    });

    // Данни за теста
    const data = {
      f1_score_exact: 0.85,
      f1_score_fixed: 0.9,
      f1_score_percentage: 80
    };

    // Действие: Извикваме функцията
    db.saveF1Score(1, "movie", data, (err, result) => {
      // Проверка: Уверяваме се, че е върната грешка
      expect(err).toEqual(new Error(errorMessage));
      expect(result).toBeNull();
      done();
    });
  });
});

// Тест за saveAnalysis
describe("saveAnalysis", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да запише данни за анализа на потребителя", () => {
    // Мокираме db.query да симулира успешно записване
    db.query.mockImplementationOnce((query, values, callback) => {
      expect(values).toEqual([
        1,
        20,
        50,
        0.8,
        80,
        JSON.stringify([
          { movieId: 1, relevance: 1 },
          { movieId: 2, relevance: 0.8 }
        ]),
        "2025-02-18"
      ]);
      callback(null, { affectedRows: 1 });
    });

    // Данни за анализа
    const data = {
      relevantCount: 20,
      totalCount: 50,
      precisionValue: 0.8,
      precisionPercentage: 80,
      relevantRecommendations: [
        { movieId: 1, relevance: 1 },
        { movieId: 2, relevance: 0.8 }
      ],
      date: "2025-02-18"
    };

    // Действие: Извикваме функцията
    db.saveAnalysis(1, data, (err, result) => {
      // Проверка: Уверяваме се, че данните са записани
      expect(err).toBeNull();
      expect(result).toEqual({ affectedRows: 1 });
      done();
    });
  });

  it("Трябва да върне грешка, ако има проблем с изпълнението на запитването", () => {
    const errorMessage = "Database error";
    // Мокираме db.query да симулира грешка
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(new Error(errorMessage), null);
    });

    // Данни за теста
    const data = {
      relevantCount: 20,
      totalCount: 50,
      precisionValue: 0.8,
      precisionPercentage: 80,
      relevantRecommendations: [
        { movieId: 1, relevance: 1 },
        { movieId: 2, relevance: 0.8 }
      ],
      date: "2025-02-18"
    };

    // Действие: Извикваме функцията
    db.saveAnalysis(1, data, (err, result) => {
      // Проверка: Уверяваме се, че е върната грешка
      expect(err).toEqual(new Error(errorMessage));
      expect(result).toBeNull();
      done();
    });
  });
});

// Тест за calculateAverageMetrics
describe("calculateAverageMetrics", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест
  });

  it("Трябва да изчисли и върне средни стойности за precision, recall и f1 score", () => {
    // Мокираме db.query да симулира резултати за двете заявки
    db.query.mockImplementationOnce((query, callback) => {
      callback(null, [
        {
          avg_precision: 0.75,
          avg_recall: 0.8,
          avg_f1_score: 0.77
        }
      ]);
    });

    db.query.mockImplementationOnce((query, callback) => {
      callback(null, [
        {
          average_precision_last_round: 0.78
        }
      ]);
    });

    // Действие: Извикваме функцията
    db.calculateAverageMetrics((err, result) => {
      // Проверка: Уверяваме се, че резултатите са коректни
      expect(err).toBeNull();
      expect(result).toEqual({
        average_precision: 0.75,
        average_precision_percentage: "75.00",
        average_precision_last_round: 0.78,
        average_precision_last_round_percentage: "78.00",
        average_recall: 0.8,
        average_recall_percentage: "80.00",
        average_f1_score: 0.77,
        average_f1_score_percentage: "77.00"
      });
      done();
    });
  });

  it("Трябва да върне грешка, ако има проблем с извършването на query заявките", () => {
    const errorMessage = "Database error";

    // Мокираме db.query да симулира грешка за първата заявка
    db.query.mockImplementationOnce((query, callback) => {
      callback(new Error(errorMessage), null);
    });

    // Действие: Извикваме функцията
    db.calculateAverageMetrics((err, result) => {
      // Проверка: Уверяваме се, че е върната грешка
      expect(err).toEqual(new Error(errorMessage));
      expect(result).toBeNull();
      done();
    });
  });
});
