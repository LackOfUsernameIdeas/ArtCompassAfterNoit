const mysql = require("mysql2");
const dbOpts = require("./config.js").dbOpts;
const dbOptsLocal = require("./config.js").dbOptsLocal;
const hf = require("./helper_functions");
require("dotenv").config();

const db = mysql.createConnection(dbOptsLocal);
// const db = mysql.createConnection(dbOpts);

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

const checkEmailExists = (email, callback) => {
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], callback);
};

const createUser = (firstName, lastName, email, hashedPassword, callback) => {
  const query =
    "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
  db.query(query, [firstName, lastName, email, hashedPassword], callback);
};

const findUserByEmail = (email, callback) => {
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], callback);
};

const updateUserPassword = (userId, hashedPassword, callback) => {
  const query = "UPDATE users SET password = ? WHERE id = ?";
  db.query(query, [hashedPassword, userId], callback);
};

const getUserById = (userId, callback) => {
  const query =
    "SELECT id, first_name, last_name, email FROM users WHERE id = ?";
  db.query(query, [userId], callback);
};

const saveRecommendation = (
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
  callback
) => {
  const query = `INSERT INTO recommendations (
  user_id, imdbID, title_en, title_bg, genre_en, genre_bg, reason, description, year,
  rated, released, runtime, director, writer, actors, plot, language, 
  country, awards, poster, ratings, metascore, imdbRating, imdbVotes, 
  type, DVD, boxOffice, production, website, totalSeasons, date
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  const values = [
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
    JSON.stringify(ratings),
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
  ];

  db.query(query, values, callback);
};

const saveToWatchlist = (
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
  callback
) => {
  const query = `INSERT INTO watchlist (
  user_id, imdbID, title_en, title_bg, genre_en, genre_bg, reason, description, year,
  rated, released, runtime, director, writer, actors, plot, language, 
  country, awards, poster, ratings, metascore, imdbRating, imdbVotes, 
  type, DVD, boxOffice, production, website, totalSeasons
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  const values = [
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
    JSON.stringify(ratings),
    metascore,
    imdbRating,
    imdbVotes,
    type,
    DVD,
    boxOffice,
    production,
    website,
    totalSeasons
  ];

  db.query(query, values, callback);
};

const saveUserPreferences = (
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
  callback
) => {
  const sql = `INSERT INTO user_preferences (user_id, preferred_genres_en, preferred_genres_bg, mood, timeAvailability, preferred_age, preferred_type, preferred_actors, preferred_directors, preferred_countries, preferred_pacing, preferred_depth, preferred_target_group, interests, date)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
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
  ];

  db.query(sql, values, (err, result) => {
    callback(err, result);
  });
};

const getUsersCount = (callback) => {
  const query = `
    SELECT COUNT(*) AS user_count
    FROM users
  `;
  db.query(query, callback);
};

const getAverageBoxOfficeAndScores = (callback) => {
  const query = `
    SELECT 
      CONCAT('$', FORMAT(AVG(boxOffice), 0)) AS average_box_office,
      ROUND(AVG(metascore), 2) AS average_metascore,
      ROUND(AVG(imdbRating), 2) AS average_imdb_rating,
      CONCAT(ROUND(AVG(rottenTomatoes), 2), '%') AS average_rotten_tomatoes
    FROM (
      SELECT DISTINCT imdbID, 
        CAST(REPLACE(REPLACE(boxOffice, '$', ''), ',', '') AS DECIMAL(15, 2)) AS boxOffice,
        CAST(metascore AS DECIMAL(15, 2)) AS metascore,
        CAST(imdbRating AS DECIMAL(15, 2)) AS imdbRating,
        CAST(
          REPLACE(JSON_UNQUOTE(JSON_EXTRACT(ratings, '$[1].Value')), '%', '') AS DECIMAL(5, 2)
        ) AS rottenTomatoes
      FROM recommendations
      WHERE boxOffice IS NOT NULL AND boxOffice != 'N/A'
        AND metascore IS NOT NULL
        AND imdbRating IS NOT NULL
        AND JSON_EXTRACT(ratings, '$[1].Source') = 'Rotten Tomatoes'
    ) AS distinct_data;
  `;
  db.query(query, callback);
};

const getTopRecommendationsPlatform = (callback) => {
  const query = `
    SELECT 
        r.id,
        r.imdbID,
        r.title_en,
        r.title_bg,
        r.type,
        r.awards,
        COUNT(*) AS recommendations,

        -- Extract Oscar wins as an integer (if available)
        COALESCE(
            CASE 
                WHEN r.awards REGEXP 'Won [0-9]+ Oscar' OR r.awards REGEXP 'Won [0-9]+ Oscars' 
                THEN CAST(NULLIF(SUBSTRING_INDEX(SUBSTRING_INDEX(r.awards, 'Won ', -1), ' Oscar', 1), '') AS UNSIGNED)
                ELSE 0
            END, 
            0
        ) AS oscar_wins,

        -- Extract Oscar nominations as an integer (if available)
        COALESCE(
            CASE 
                WHEN r.awards REGEXP 'Nominated for [0-9]+ Oscar' OR r.awards REGEXP 'Nominated for [0-9]+ Oscars' 
                THEN CAST(NULLIF(SUBSTRING_INDEX(SUBSTRING_INDEX(r.awards, 'Nominated for ', -1), ' Oscar', 1), '') AS UNSIGNED)
                ELSE 0
            END, 
            0
        ) AS oscar_nominations,

        -- Extract total wins as an integer
        COALESCE(
            CAST(NULLIF(REGEXP_SUBSTR(r.awards, '([0-9]+) win(s)?'), '') AS UNSIGNED), 
            0
        ) AS total_wins,

        -- Extract total nominations as an integer
        COALESCE(
            CAST(NULLIF(REGEXP_SUBSTR(r.awards, '([0-9]+) nomination(s)?'), '') AS UNSIGNED), 
            0
        ) AS total_nominations
    FROM 
        recommendations r
    GROUP BY 
        r.title_en
    ORDER BY 
        recommendations DESC
    LIMIT 10;
  `;

  db.query(query, callback);
};

const getTopCountries = (limit, callback) => {
  const query = `
    SELECT country, COUNT(*) AS count
    FROM (
      SELECT 
        TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(r.country, ',', numbers.n), ',', -1)) AS country
      FROM recommendations r
      INNER JOIN (
        SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION
        SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
      ) AS numbers 
      ON CHAR_LENGTH(r.country) - CHAR_LENGTH(REPLACE(r.country, ',', '')) >= numbers.n - 1
    ) AS subquery
    GROUP BY country
    ORDER BY count DESC
    LIMIT ?
  `;
  db.query(query, [limit], async (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    // Translate each country and return the result
    const translatedResults = await Promise.all(
      results.map(async (row) => {
        const translatedCountry = await hf.translate(row.country);
        return {
          country_en: row.country,
          country_bg: translatedCountry,
          count: row.count
        };
      })
    );

    // Pass the translated results to the callback
    callback(null, translatedResults);
  });
};

const getTopGenres = (limit, callback) => {
  const query = `
    SELECT genre_en, genre_bg, COUNT(*) AS count
      FROM (
        SELECT 
          TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(r.genre_en, ',', numbers.n), ',', -1)) AS genre_en,
          TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(r.genre_bg, ',', numbers.n), ',', -1)) AS genre_bg
        FROM recommendations r
        INNER JOIN (
          SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION
          SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
        ) AS numbers 
        ON CHAR_LENGTH(r.genre_en) - CHAR_LENGTH(REPLACE(r.genre_en, ',', '')) >= numbers.n - 1
        AND CHAR_LENGTH(r.genre_bg) - CHAR_LENGTH(REPLACE(r.genre_bg, ',', '')) >= numbers.n - 1
      ) AS subquery
    GROUP BY genre_en, genre_bg
    ORDER BY count DESC
    LIMIT ?
  `;
  db.query(query, [limit], callback);
};

const getGenrePopularityOverTime = (callback) => {
  const query = `
    SELECT 
        TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(genre_en, ',', numbers.n), ',', -1)) AS genre_en,
        TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(genre_bg, ',', numbers.n), ',', -1)) AS genre_bg,
        CASE 
            WHEN LOCATE('–', year) > 0 THEN LEFT(year, LOCATE('–', year) - 1)
            ELSE year
        END AS "year",
        COUNT(*) AS genre_count
    FROM 
        recommendations
        JOIN (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5) numbers 
        ON CHAR_LENGTH(genre_en) - CHAR_LENGTH(REPLACE(genre_en, ',', '')) >= numbers.n - 1
    GROUP BY 
        genre_en, genre_bg, year
    ORDER BY 
        year, genre_en;
  `;

  db.query(query, (err, results) => {
    if (err) {
      return callback(err);
    }

    // Transform results into the desired structure with cumulative sums for genre_count
    const formattedResults = results.reduce((acc, row) => {
      const { year, genre_en, genre_bg, genre_count } = row;

      // Initialize the year object if it doesn't exist
      if (!acc[year]) {
        acc[year] = {};
      }

      // If genre exists, add to the existing genre_count, otherwise set it
      if (acc[year][genre_en]) {
        acc[year][genre_en].genre_count += genre_count;
      } else {
        acc[year][genre_en] = {
          genre_en,
          genre_bg,
          genre_count
        };
      }

      return acc;
    }, {});

    callback(null, formattedResults);
  });
};

const getTopActors = (limit, callback) => {
  const query = `
  SELECT actor, COUNT(*) AS actor_count
  FROM (
    SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(actors, ',', n.n), ',', -1)) AS actor
    FROM recommendations
    CROSS JOIN (
        SELECT a.N + b.N * 10 + 1 AS n
        FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
              UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
        , (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
           UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
        ORDER BY n
    ) n
    WHERE n.n <= 1 + (LENGTH(actors) - LENGTH(REPLACE(actors, ',', '')))
      AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(actors, ',', n.n), ',', -1)) != 'N/A'
  ) AS actor_list
  GROUP BY actor
  ORDER BY actor_count DESC
  LIMIT ?`;
  db.query(query, [limit], async (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    // Превеждане на името на всеки актьор
    const translatedResults = await Promise.all(
      results.map(async (row) => {
        const translatedActor = await hf.translate(row.actor);
        return {
          actor_en: row.actor,
          actor_bg: translatedActor,
          actor_count: row.actor_count
        };
      })
    );

    callback(null, translatedResults);
  });
};

const getTopDirectors = (limit, callback) => {
  const query = `
  SELECT director, COUNT(*) AS director_count
  FROM (
    SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(director, ',', n.n), ',', -1)) AS director
    FROM recommendations
    CROSS JOIN (
        SELECT a.N + b.N * 10 + 1 AS n
        FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
              UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
        , (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
           UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
        ORDER BY n
    ) n
    WHERE n.n <= 1 + (LENGTH(director) - LENGTH(REPLACE(director, ',', '')))
      AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(director, ',', n.n), ',', -1)) != 'N/A'
  ) AS director_list
  GROUP BY director
  ORDER BY director_count DESC
  LIMIT ?`;
  db.query(query, [limit], async (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    // Превеждане на името на всеки режисьор
    const translatedResults = await Promise.all(
      results.map(async (row) => {
        const translatedDirector = await hf.translate(row.director);
        return {
          director_en: row.director,
          director_bg: translatedDirector,
          director_count: row.director_count
        };
      })
    );

    callback(null, translatedResults);
  });
};

const getTopWriters = (limit, callback) => {
  const query = `
  SELECT writer, COUNT(*) AS writer_count
  FROM (
    SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(writer, ',', n.n), ',', -1)) AS writer
    FROM recommendations
    CROSS JOIN (
        SELECT a.N + b.N * 10 + 1 AS n
        FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
              UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
        , (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
           UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
        ORDER BY n
    ) n
    WHERE n.n <= 1 + (LENGTH(writer) - LENGTH(REPLACE(writer, ',', '')))
      AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(writer, ',', n.n), ',', -1)) != 'N/A'
  ) AS writer_list
  GROUP BY writer
  ORDER BY writer_count DESC
  LIMIT ?`;
  db.query(query, [limit], async (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    // Превеждане на името на всеки сценарист
    const translatedResults = await Promise.all(
      results.map(async (row) => {
        const translatedWriter = await hf.translate(row.writer);
        return {
          writer_en: row.writer,
          writer_bg: translatedWriter,
          writer_count: row.writer_count
        };
      })
    );

    callback(null, translatedResults);
  });
};

const getOscarsByMovie = (callback) => {
  const query = `
  SELECT 
        r.id,
        r.imdbID,           
        r.title_en,
        r.title_bg,
        r.type,
        r.awards,           

        -- Extract Oscar wins as an integer
        COALESCE(
            CAST(NULLIF(SUBSTRING_INDEX(SUBSTRING_INDEX(r.awards, 'Won ', -1), ' Oscar', 1), '') AS UNSIGNED), 
            0
        ) AS oscar_wins,

        -- Extract Oscar nominations as an integer
        COALESCE(
            CAST(NULLIF(SUBSTRING_INDEX(SUBSTRING_INDEX(r.awards, 'Nominated for ', -1), ' Oscar', 1), '') AS UNSIGNED), 
            0
        ) AS oscar_nominations

  FROM 
        recommendations r
  WHERE 
        r.awards IS NOT NULL
        AND (
            r.awards REGEXP 'Won [0-9]+ Oscar' OR 
            r.awards REGEXP 'Won [0-9]+ Oscars' OR 
            r.awards REGEXP 'Nominated for [0-9]+ Oscar' OR 
            r.awards REGEXP 'Nominated for [0-9]+ Oscars'
        )
  GROUP BY 
        r.imdbID;
  `;
  db.query(query, callback);
};

const getTotalAwardsByMovieOrSeries = (callback) => {
  const query = `
  SELECT  
        r.id,
        r.imdbID,          
        r.title_en,
        r.title_bg,
        r.type,
        r.awards,           

        -- Extract total wins as an integer
        COALESCE(
            CAST(NULLIF(REGEXP_SUBSTR(r.awards, '([0-9]+) win(s)?'), '') AS UNSIGNED), 
            0
        ) AS total_wins,

        -- Extract total nominations as an integer
        COALESCE(
            CAST(NULLIF(REGEXP_SUBSTR(r.awards, '([0-9]+) nomination(s)?'), '') AS UNSIGNED), 
            0
        ) AS total_nominations

  FROM 
        recommendations r
  WHERE 
        r.awards IS NOT NULL
  GROUP BY 
        r.imdbID;
  `;
  db.query(query, callback);
};

const getTotalAwardsCount = (callback) => {
  const query = `
  SELECT 
    -- Calculate total Oscar wins distinctly
    (
        SELECT 
            SUM(
                COALESCE(
                    CAST(NULLIF(SUBSTRING_INDEX(SUBSTRING_INDEX(r2.awards, 'Won ', -1), ' Oscar', 1), '') AS UNSIGNED), 
                    0
                )
            )
        FROM 
            (SELECT DISTINCT imdbID, awards FROM recommendations WHERE awards IS NOT NULL 
              AND (awards REGEXP 'Won [0-9]+ Oscar' OR awards REGEXP 'Won [0-9]+ Oscars')) r2
    ) AS total_oscar_wins,

    -- Calculate total Oscar nominations distinctly
    (
        SELECT 
            SUM(
                COALESCE(
                    CAST(NULLIF(SUBSTRING_INDEX(SUBSTRING_INDEX(r2.awards, 'Nominated for ', -1), ' Oscar', 1), '') AS UNSIGNED), 
                    0
                )
            )
        FROM 
            (SELECT DISTINCT imdbID, awards FROM recommendations WHERE awards IS NOT NULL 
              AND (awards REGEXP 'Nominated for [0-9]+ Oscar' OR awards REGEXP 'Nominated for [0-9]+ Oscars')) r2
    ) AS total_oscar_nominations,

    -- Calculate total wins from all awards distinctly
    (
        SELECT 
            SUM(
                COALESCE(
                    CAST(NULLIF(REGEXP_SUBSTR(r2.awards, '([0-9]+) wins'), '') AS UNSIGNED), 
                    0
                )
            )
        FROM 
            (SELECT DISTINCT imdbID, awards FROM recommendations WHERE awards IS NOT NULL 
              AND (awards REGEXP '([0-9]+) wins' OR awards REGEXP '([0-9]+) win')) r2
    ) AS total_awards_wins,

    -- Calculate total nominations from all awards distinctly
    (
        SELECT 
            SUM(
                COALESCE(
                    CAST(NULLIF(REGEXP_SUBSTR(r2.awards, '([0-9]+) nominations'), '') AS UNSIGNED), 
                    0
                )
            )
        FROM 
            (SELECT DISTINCT imdbID, awards FROM recommendations WHERE awards IS NOT NULL 
              AND (awards REGEXP '([0-9]+) nominations' OR awards REGEXP '([0-9]+) nomination')) r2
    ) AS total_awards_nominations;
  `;
  db.query(query, callback);
};

const getSortedDirectorsByProsperity = (callback) => {
  const query = `
  WITH RECURSIVE DirectorSplit AS (
    SELECT 
        id, 
        TRIM(SUBSTRING_INDEX(director, ',', 1)) AS director,
        SUBSTRING_INDEX(director, ',', -1) AS remaining_directors,
        imdbRating,
        metascore,
        boxOffice,
        runtime,
        awards,
        imdbID,
        ratings,
        type
    FROM recommendations
    WHERE director IS NOT NULL 
      AND director != 'N/A'
    UNION ALL
    SELECT 
        id,
        TRIM(SUBSTRING_INDEX(remaining_directors, ',', 1)) AS director,
        SUBSTRING_INDEX(remaining_directors, ',', -1) AS remaining_directors,
        imdbRating,
        metascore,
        boxOffice,
        runtime,
        awards,
        imdbID,
        ratings,
        type
    FROM DirectorSplit
    WHERE remaining_directors LIKE '%,%'
  ),
  UniqueMovies AS (
      SELECT 
          DISTINCT imdbID,
          director,
          imdbRating,
          metascore,
          boxOffice,
          runtime,
          awards,
          CAST(
              REPLACE(
                JSON_UNQUOTE(JSON_EXTRACT(ratings, '$[1].Value')), '%', ''
              ) AS DECIMAL(5, 2)
          ) AS rottenTomatoes
      FROM 
          DirectorSplit
      WHERE director IS NOT NULL AND director != 'N/A'
  ),
  DirectorRecommendations AS (
    SELECT director, COUNT(*) AS total_recommendations  -- Count all recommendations for each director
    FROM (
      SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(director, ',', n.n), ',', -1)) AS director
      FROM recommendations
      CROSS JOIN (
          SELECT a.N + b.N * 10 + 1 AS n
          FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
          , (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
            UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
          ORDER BY n
      ) n
      WHERE n.n <= 1 + (LENGTH(director) - LENGTH(REPLACE(director, ',', '')))  -- Split the director list by comma
        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(director, ',', n.n), ',', -1)) != 'N/A'
    ) AS director_list
    GROUP BY director
    ORDER BY total_recommendations DESC
  )
  SELECT 
      um.director,
      ROUND(AVG(um.imdbRating), 2) AS avg_imdb_rating,
      AVG(um.metascore) AS avg_metascore,
      CONCAT('$', FORMAT(SUM(CASE 
              WHEN um.boxOffice IS NULL OR um.boxOffice = 'N/A' 
              THEN 0 
              ELSE CAST(REPLACE(REPLACE(um.boxOffice, '$', ''), ',', '') AS UNSIGNED) 
          END), 0)) AS total_box_office,
      CONCAT(ROUND(AVG(um.rottenTomatoes), 0), '%') AS avg_rotten_tomatoes,
      COUNT(DISTINCT um.imdbID) AS movie_count,  -- Count distinct movies
      COALESCE(dr.total_recommendations, 0) AS total_recommendations,  -- Total recommendations from join
      AVG(CASE 
              WHEN um.runtime IS NULL OR um.runtime = 'N/A' OR um.runtime < 30 
              THEN NULL 
              ELSE um.runtime 
          END) AS avg_runtime,
      SUM(CASE 
              WHEN um.awards IS NOT NULL THEN 
                  CASE 
                      WHEN um.awards LIKE '1 win%' THEN 1
                      ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ win(s)') AS UNSIGNED), 0)
                  END
              ELSE 0 
          END) AS total_wins,
      SUM(CASE 
              WHEN um.awards IS NOT NULL THEN 
                  CASE 
                      WHEN um.awards LIKE '1 nomination%' THEN 1
                      ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ nomination(s)') AS UNSIGNED), 0)
                  END
              ELSE 0 
          END) AS total_nominations
  FROM 
      UniqueMovies um
  LEFT JOIN 
      DirectorRecommendations dr ON um.director = dr.director  -- Join to get total recommendations
  WHERE 
      um.boxOffice IS NOT NULL 
      AND um.boxOffice != 'N/A'
      AND um.metascore IS NOT NULL 
      AND um.metascore != 'N/A'
      AND um.rottenTomatoes IS NOT NULL
  GROUP BY 
      um.director
  ORDER BY 
      avg_imdb_rating DESC
  LIMIT 100`;
  // HAVING
  // movie_count > 1
  db.query(query, async (err, results) => {
    if (err) return callback(err);

    const weights = {
      total_wins: 0.3,
      total_nominations: 0.25,
      total_box_office: 0.15,
      avg_metascore: 0.1,
      avg_imdb_rating: 0.1,
      avg_rotten_tomatoes: 0.1
    };

    const maxBoxOffice = Math.max(
      ...results.map((director) => {
        const totalBoxOffice =
          parseFloat(director.total_box_office.replace(/[$,]/g, "")) || 0;
        return totalBoxOffice;
      })
    );

    console.log(
      Math.max(
        ...results.map((director) => {
          const totalBoxOffice =
            parseFloat(director.total_box_office.replace(/[$,]/g, "")) || 0;
          return totalBoxOffice;
        })
      )
    );

    const directorsWithProsperity = results.map((director) => {
      const totalWins = director.total_wins || 0;
      const totalNominations = director.total_nominations || 0;
      const totalBoxOffice =
        parseFloat(director.total_box_office.replace(/[$,]/g, "")) || 0;
      const normalizedBoxOffice = maxBoxOffice
        ? totalBoxOffice / maxBoxOffice
        : 0;
      const avgMetascore = director.avg_metascore || 0;
      const avgIMDbRating = director.avg_imdb_rating || 0;
      const avgRottenTomatoes = director.avg_rotten_tomatoes
        ? parseFloat(director.avg_rotten_tomatoes.replace("%", "")) / 100
        : 0;

      console.log(
        "getSortedDirectorsByProsperity",
        director.director,
        totalWins,
        totalNominations,
        totalBoxOffice,
        maxBoxOffice,
        normalizedBoxOffice,
        avgMetascore,
        avgIMDbRating,
        avgRottenTomatoes
      );
      const prosperityScore =
        totalWins * weights.total_wins +
        totalNominations * weights.total_nominations +
        normalizedBoxOffice * weights.total_box_office +
        avgMetascore * weights.avg_metascore +
        avgIMDbRating * weights.avg_imdb_rating +
        avgRottenTomatoes * weights.avg_rotten_tomatoes;

      return {
        ...director,
        prosperityScore: Number(prosperityScore.toFixed(2))
      };
    });

    const translatedResults = await Promise.all(
      directorsWithProsperity.map(async (row) => {
        const translatedDirector = await hf.translate(row.director);
        return {
          director_bg: translatedDirector,
          ...row
        };
      })
    );

    translatedResults.sort((a, b) => b.prosperityScore - a.prosperityScore);

    callback(null, translatedResults);
  });
};

const getSortedActorsByProsperity = (callback) => {
  const query = `
  WITH RECURSIVE ActorSplit AS (
  SELECT 
      id, 
      TRIM(SUBSTRING_INDEX(actors, ',', 1)) AS actor,
      SUBSTRING_INDEX(actors, ',', -1) AS remaining_actors,
      imdbRating,
      metascore,
      boxOffice,
      awards,
      imdbID,
      ratings,
      type
  FROM recommendations
  WHERE actors IS NOT NULL 
    AND actors != 'N/A'
  UNION ALL
  SELECT 
      id,
      TRIM(SUBSTRING_INDEX(remaining_actors, ',', 1)) AS actor,
      SUBSTRING_INDEX(remaining_actors, ',', -1) AS remaining_actors,
      imdbRating,
      metascore,
      boxOffice,
      awards,
      imdbID,
      ratings,
      type
  FROM ActorSplit
  WHERE remaining_actors LIKE '%,%'
  ),
  UniqueMovies AS (
    SELECT 
        DISTINCT imdbID,
        actor,
        imdbRating,
        metascore,
        boxOffice,
        awards,
        ratings
    FROM 
        ActorSplit
    WHERE actor IS NOT NULL AND actor != 'N/A'
  ),
  ActorRecommendations AS (
    SELECT actor, COUNT(*) AS total_recommendations  -- Count all recommendations for each actor
    FROM (
      SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(actors, ',', n.n), ',', -1)) AS actor
      FROM recommendations
      CROSS JOIN (
          SELECT a.N + b.N * 10 + 1 AS n
          FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
          , (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
            UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
          ORDER BY n
      ) n
      WHERE n.n <= 1 + (LENGTH(actors) - LENGTH(REPLACE(actors, ',', '')))  -- Split the actor list by comma
        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(actors, ',', n.n), ',', -1)) != 'N/A'
    ) AS actor_list
    GROUP BY actor
    ORDER BY total_recommendations DESC
  )
  SELECT 
    um.actor,
    ROUND(AVG(um.imdbRating), 2) AS avg_imdb_rating,
    AVG(um.metascore) AS avg_metascore,
    CONCAT('$', FORMAT(SUM(CASE 
            WHEN um.boxOffice IS NULL OR um.boxOffice = 'N/A' 
            THEN 0 
            ELSE CAST(REPLACE(REPLACE(um.boxOffice, '$', ''), ',', '') AS UNSIGNED) 
        END), 0)) AS total_box_office,
    CONCAT(ROUND(AVG(CAST(REPLACE(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(um.ratings, '$[1].Value')), '%', ''), ',', '') AS DECIMAL(5,2))), 0), '%') AS avg_rotten_tomatoes, -- Average Rotten Tomatoes rating
    COUNT(DISTINCT um.imdbID) AS movie_count,  -- Count distinct movies
    COALESCE(ar.total_recommendations, 0) AS total_recommendations,  -- Total recommendations from join
    SUM(CASE 
            WHEN um.awards IS NOT NULL THEN 
                CASE 
                    WHEN um.awards LIKE '1 win%' THEN 1
                    ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ win(s)') AS UNSIGNED), 0)
                END
            ELSE 0 
        END) AS total_wins,  -- Total wins

    SUM(CASE 
            WHEN um.awards IS NOT NULL THEN 
                CASE 
                    WHEN um.awards LIKE '1 nomination%' THEN 1
                    ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ nomination(s)') AS UNSIGNED), 0)
                END
            ELSE 0 

        END) AS total_nominations  -- Total nominations
  FROM 
      UniqueMovies um
  LEFT JOIN 
      ActorRecommendations ar ON um.actor = ar.actor  -- Join to get total recommendations
  WHERE 
      um.boxOffice IS NOT NULL 
      AND um.boxOffice != 'N/A'
      AND um.metascore IS NOT NULL 
      AND um.metascore != 'N/A'
  GROUP BY 
      um.actor
  ORDER BY 
      avg_imdb_rating DESC
  LIMIT 100`;

  db.query(query, async (err, results) => {
    if (err) return callback(err);

    // Изчисляване на резултатите за просперитет
    const weights = {
      total_wins: 0.3,
      total_nominations: 0.25,
      total_box_office: 0.15,
      avg_metascore: 0.1,
      avg_imdb_rating: 0.1,
      avg_rotten_tomatoes: 0.1
    };

    // Намиране на максималната стойност на бокс офис, за да се нормализира
    const maxBoxOffice = Math.max(
      ...results.map((actor) => {
        const totalBoxOffice =
          parseFloat(actor.total_box_office.replace(/[$,]/g, "")) || 0;
        return totalBoxOffice;
      })
    );

    const actorsWithProsperity = results.map((actor) => {
      const totalWins = actor.total_wins || 0; // Уверете се, че няма null стойности
      const totalNominations = actor.total_nominations || 0;

      // Парсиране и нормализиране на стойността на бокс офис
      const totalBoxOffice =
        parseFloat(actor.total_box_office.replace(/[$,]/g, "")) || 0;

      // Нормализиране на стойността на бокс офис в мащаб 0-1
      const normalizedBoxOffice = maxBoxOffice
        ? totalBoxOffice / maxBoxOffice
        : 0;

      const avgIMDbRating = actor.avg_imdb_rating || 0;
      const avgMetascore = actor.avg_metascore || 0; // Добавяне на metascore
      const avgRottenTomatoes = actor.avg_rotten_tomatoes
        ? parseFloat(actor.avg_rotten_tomatoes.replace("%", "")) / 100
        : 0;

      const prosperityScore =
        totalWins * weights.total_wins +
        totalNominations * weights.total_nominations +
        normalizedBoxOffice * weights.total_box_office +
        avgMetascore * weights.avg_metascore +
        avgIMDbRating * weights.avg_imdb_rating +
        avgRottenTomatoes * weights.avg_rotten_tomatoes;

      return {
        ...actor,
        prosperityScore: Number(prosperityScore.toFixed(2))
      };
    });

    // Превеждане на имената на всеки актьор
    const translatedResults = await Promise.all(
      actorsWithProsperity.map(async (row) => {
        const translatedActor = await hf.translate(row.actor);
        return {
          actor_bg: translatedActor,
          ...row
        };
      })
    );

    translatedResults.sort((a, b) => b.prosperityScore - a.prosperityScore);

    callback(null, translatedResults);
  });
};

const getSortedWritersByProsperity = (callback) => {
  const query = `  
  WITH RECURSIVE WriterSplit AS (
    SELECT 
        id, 
        TRIM(SUBSTRING_INDEX(writer, ',', 1)) AS writer,
        SUBSTRING_INDEX(writer, ',', -1) AS remaining_writers,
        imdbRating,
        metascore,
        boxOffice,
        awards,
        imdbID,
        ratings,
        type
    FROM recommendations
    WHERE writer IS NOT NULL 
      AND writer != 'N/A'
    UNION ALL
    SELECT 
        id,
        TRIM(SUBSTRING_INDEX(remaining_writers, ',', 1)) AS writer,
        SUBSTRING_INDEX(remaining_writers, ',', -1) AS remaining_writers,
        imdbRating,
        metascore,
        boxOffice,
        awards,
        imdbID,
        ratings,
        type
    FROM WriterSplit
    WHERE remaining_writers LIKE '%,%'
  ),
  UniqueMovies AS (
      SELECT 
          DISTINCT imdbID,
          writer,
          imdbRating,
          metascore,
          boxOffice,
          awards,
          ratings
      FROM 
          WriterSplit
      WHERE writer IS NOT NULL AND writer != 'N/A'
  ),
  WriterRecommendations AS (
    SELECT writer, COUNT(*) AS total_recommendations  -- Count all recommendations for each writer
    FROM (
      SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(writer, ',', n.n), ',', -1)) AS writer
      FROM recommendations
      CROSS JOIN (
          SELECT a.N + b.N * 10 + 1 AS n
          FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
          , (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
            UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
          ORDER BY n
      ) n
      WHERE n.n <= 1 + (LENGTH(writer) - LENGTH(REPLACE(writer, ',', '')))  -- Split the writer list by comma
        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(writer, ',', n.n), ',', -1)) != 'N/A'
    ) AS writer_list
    GROUP BY writer
    ORDER BY total_recommendations DESC
  )
  SELECT 
      um.writer,
      ROUND(AVG(um.imdbRating), 2) AS avg_imdb_rating,
      AVG(um.metascore) AS avg_metascore,
      CONCAT('$', FORMAT(SUM(CASE 
              WHEN um.boxOffice IS NULL OR um.boxOffice = 'N/A' 
              THEN 0 
              ELSE CAST(REPLACE(REPLACE(um.boxOffice, '$', ''), ',', '') AS UNSIGNED) 
          END), 0)) AS total_box_office,
      CONCAT(ROUND(AVG(CAST(REPLACE(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(um.ratings, '$[1].Value')), '%', ''), ',', '') AS DECIMAL(5,2))), 0), '%') AS avg_rotten_tomatoes, -- Average Rotten Tomatoes rating
      COUNT(DISTINCT um.imdbID) AS movie_count,  -- Count distinct movies
      COALESCE(wr.total_recommendations, 0) AS total_recommendations,  -- Total recommendations from join
      SUM(CASE 
              WHEN um.awards IS NOT NULL THEN 
                  CASE 
                      WHEN um.awards LIKE '1 win%' THEN 1
                      ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ win(s)') AS UNSIGNED), 0)
                  END
              ELSE 0 
          END) AS total_wins,  -- Total wins

      SUM(CASE 
              WHEN um.awards IS NOT NULL THEN 
                  CASE 
                      WHEN um.awards LIKE '1 nomination%' THEN 1
                      ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ nomination(s)') AS UNSIGNED), 0)
                  END
              ELSE 0 

          END) AS total_nominations  -- Total nominations
  FROM 
      UniqueMovies um
  LEFT JOIN 
      WriterRecommendations wr ON um.writer = wr.writer  -- Join to get total recommendations
  WHERE 
      um.boxOffice IS NOT NULL 
      AND um.boxOffice != 'N/A'
      AND um.metascore IS NOT NULL 
      AND um.metascore != 'N/A'
  GROUP BY 
      um.writer
  ORDER BY 
      avg_imdb_rating DESC
  LIMIT 100`;

  // HAVING
  // COUNT(DISTINCT um.imdbID) > 1
  db.query(query, async (err, results) => {
    if (err) return callback(err);

    // Calculate prosperity scores
    const weights = {
      total_wins: 0.3,
      total_nominations: 0.25,
      total_box_office: 0.15,
      avg_metascore: 0.1,
      avg_imdb_rating: 0.1,
      avg_rotten_tomatoes: 0.1
    };

    // Find maximum box office value to normalize
    const maxBoxOffice = Math.max(
      ...results.map((writer) => {
        const totalBoxOffice =
          parseFloat(writer.total_box_office.replace(/[$,]/g, "")) || 0;
        return totalBoxOffice;
      })
    );

    const writersWithProsperity = results.map((writer) => {
      const totalWins = writer.total_wins || 0; // Ensure no null values
      const totalNominations = writer.total_nominations || 0;

      // Parse and normalize the box office value
      const totalBoxOffice =
        parseFloat(writer.total_box_office.replace(/[$,]/g, "")) || 0;

      // Normalize the box office value to a scale of 0-1
      const normalizedBoxOffice = maxBoxOffice
        ? totalBoxOffice / maxBoxOffice
        : 0;

      const avgIMDbRating = writer.avg_imdb_rating || 0;
      const avgMetascore = writer.avg_metascore || 0;
      const avgRottenTomatoes = writer.avg_rotten_tomatoes
        ? parseFloat(writer.avg_rotten_tomatoes.replace("%", "")) / 100
        : 0;

      // Calculate prosperity score using weighted values
      const prosperityScore =
        totalWins * weights.total_wins +
        totalNominations * weights.total_nominations +
        normalizedBoxOffice * weights.total_box_office +
        avgIMDbRating * weights.avg_imdb_rating +
        avgMetascore * weights.avg_metascore +
        avgRottenTomatoes * weights.avg_rotten_tomatoes;

      return {
        ...writer,
        prosperityScore: Number(prosperityScore.toFixed(2)) // Round to two decimal places
      };
    });

    // Translate each writer's name
    const translatedResults = await Promise.all(
      writersWithProsperity.map(async (row) => {
        const translatedWriter = await hf.translate(row.writer);
        return {
          writer_bg: translatedWriter,
          ...row
        };
      })
    );

    translatedResults.sort((a, b) => b.prosperityScore - a.prosperityScore);

    callback(null, translatedResults);
  });
};

const getSortedMoviesByProsperity = (callback) => {
  const query = `
  WITH RECURSIVE MovieSplit AS (
      SELECT 
          id, 
          TRIM(SUBSTRING_INDEX(imdbID, ',', 1)) AS imdbID,
          SUBSTRING_INDEX(imdbID, ',', -1) AS remaining_ids,
          imdbRating,
          metascore,
          boxOffice,
          awards,
          ratings,
          title_en,
          title_bg,
          type,
          genre_en, 
          genre_bg   
      FROM recommendations
      WHERE imdbID IS NOT NULL 
        AND imdbID != 'N/A'
      UNION ALL
      SELECT 
          id,
          TRIM(SUBSTRING_INDEX(remaining_ids, ',', 1)) AS imdbID,
          SUBSTRING_INDEX(remaining_ids, ',', -1) AS remaining_ids,
          imdbRating,
          metascore,
          boxOffice,
          awards,
          ratings,
          title_en,
          title_bg,
          type,
          genre_en, 
          genre_bg  
      FROM MovieSplit
      WHERE remaining_ids LIKE '%,%'
  ),
  UniqueMovies AS (
      SELECT 
          DISTINCT imdbID,
          MAX(title_en) AS title_en,
          MAX(title_bg) AS title_bg,
          MAX(type) AS type,
          MAX(imdbRating) AS imdbRating,
          MAX(metascore) AS metascore,
          MAX(boxOffice) AS boxOffice,
          MAX(awards) AS awards,
          MAX(ratings) AS ratings,
          MAX(genre_en) AS genre_en, 
          MAX(genre_bg) AS genre_bg  
      FROM 
          MovieSplit
      WHERE imdbID IS NOT NULL 
        AND imdbID != 'N/A'
      GROUP BY 
          imdbID
  ),
  MovieRecommendations AS (
      SELECT 
          imdbID,
          COUNT(*) AS total_recommendations
      FROM 
          recommendations
      WHERE 
          imdbID IS NOT NULL 
          AND imdbID != 'N/A'
      GROUP BY 
          imdbID
  )
  SELECT 
      um.imdbID,
      um.title_en,
      um.title_bg,
      um.type,
      um.imdbRating,
      um.metascore,
      CONCAT('$', FORMAT(MAX(CASE 
              WHEN boxOffice IS NULL OR boxOffice = 'N/A' THEN 0 
              ELSE CAST(REPLACE(REPLACE(um.boxOffice, '$', ''), ',', '') AS UNSIGNED) 
          END), 0)) AS total_box_office,
      JSON_UNQUOTE(JSON_EXTRACT(um.ratings, '$[1].Value')) AS rotten_tomatoes,
      COALESCE(mr.total_recommendations, 0) AS total_recommendations,
      SUM(CASE 
              WHEN um.awards IS NOT NULL THEN 
                  CASE 
                      WHEN um.awards LIKE '1 win%' THEN 1
                      ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ win(s)') AS UNSIGNED), 0)
                  END
              ELSE 0 
          END) AS total_wins,
      SUM(CASE 
              WHEN um.awards IS NOT NULL THEN 
                  CASE 
                      WHEN um.awards LIKE '1 nomination%' THEN 1
                      ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ nomination(s)') AS UNSIGNED), 0)
                  END
              ELSE 0 
          END) AS total_nominations,
      um.genre_en AS genre_en, 
      um.genre_bg AS genre_bg   
  FROM 
      UniqueMovies um
  LEFT JOIN 
      MovieRecommendations mr ON um.imdbID = mr.imdbID
  WHERE 
      um.boxOffice IS NOT NULL 
      AND um.boxOffice != 'N/A'
      AND um.metascore IS NOT NULL 
      AND um.metascore != 'N/A'
  GROUP BY 
      um.imdbID, um.title_en, um.title_bg, um.type, um.imdbRating, um.metascore, um.genre_en
  ORDER BY 
      um.imdbRating DESC
  LIMIT 100
  `;

  db.query(query, (err, results) => {
    if (err) return callback(err);

    // Изчисляване на просперитета на филмите
    const weights = {
      total_wins: 0.3,
      total_nominations: 0.25,
      total_box_office: 0.15,
      avg_metascore: 0.1,
      avg_imdb_rating: 0.1,
      avg_rotten_tomatoes: 0.1
    };

    // Намиране на максималната стойност на бокс офис, за да се нормализира
    const maxBoxOffice = Math.max(
      ...results.map((movie) => {
        const totalBoxOffice =
          parseFloat(movie.total_box_office.replace(/[$,]/g, "")) || 0;
        return totalBoxOffice;
      })
    );

    const moviesWithProsperity = results.map((movie) => {
      const totalWins = movie.total_wins || 0; // Осигуряване, че няма null стойности
      const totalNominations = movie.total_nominations || 0;

      // Парсиране и нормализиране на стойността на бокс офис
      const totalBoxOffice =
        parseFloat(movie.total_box_office.replace(/[$,]/g, "")) || 0;

      // Нормализиране на стойността на бокс офис в мащаб 0-1
      const normalizedBoxOffice = maxBoxOffice
        ? totalBoxOffice / maxBoxOffice
        : 0;

      const avgIMDbRating = movie.imdbRating || 0;
      const avgMetascore = movie.metascore || 0; // Добавяне на метаоценка
      const avgRottenTomatoes = movie.avg_rotten_tomatoes
        ? parseFloat(movie.avg_rotten_tomatoes.replace("%", "")) / 100
        : 0;

      // Изчисляване на просперитета чрез тежести на стойностите
      const prosperityScore =
        totalWins * weights.total_wins +
        totalNominations * weights.total_nominations +
        normalizedBoxOffice * weights.total_box_office +
        avgIMDbRating * weights.avg_imdb_rating +
        avgMetascore * weights.avg_metascore +
        avgRottenTomatoes * weights.avg_rotten_tomatoes;

      return {
        ...movie,
        prosperityScore: Number(prosperityScore.toFixed(2)) // Округляване до два десетични знака
      };
    });

    // Сортиране по просперитет
    moviesWithProsperity.sort((a, b) => b.prosperityScore - a.prosperityScore);

    callback(null, moviesWithProsperity);
  });
};

const getTopMoviesAndSeriesByMetascore = (limit, callback) => {
  const query = `
  SELECT 
      imdbID,
      title_en,
      title_bg,
      type,
      imdbRating,
      metascore,
      boxOffice,
      awards
  FROM (
      SELECT 
          imdbID,
          title_en,
          title_bg,
          type,
          imdbRating,
          metascore,
          boxOffice,
          awards,
          ROW_NUMBER() OVER (PARTITION BY imdbID ORDER BY metascore DESC) AS row_num
      FROM recommendations
      WHERE imdbID IS NOT NULL 
        AND imdbID != 'N/A'
        AND metascore IS NOT NULL
        AND metascore != 'N/A'
  ) AS ranked
  WHERE row_num = 1
  ORDER BY metascore DESC
  LIMIT ?;
  `;
  db.query(query, [limit], callback);
};

const getTopMoviesAndSeriesByIMDbRating = (limit, callback) => {
  const query = `
  SELECT 
      imdbID,
      title_en,
      title_bg,
      type,
      imdbRating,
      metascore,
      boxOffice,
      awards
  FROM (
      SELECT 
          imdbID,
          title_en,
          title_bg,
          type,
          imdbRating,
          metascore,
          boxOffice,
          awards,
          ROW_NUMBER() OVER (PARTITION BY imdbID ORDER BY imdbRating DESC) AS row_num
      FROM recommendations
      WHERE imdbID IS NOT NULL 
        AND imdbID != 'N/A'
        AND imdbRating IS NOT NULL
        AND imdbRating != 'N/A'
  ) AS ranked
  WHERE row_num = 1
  ORDER BY imdbRating DESC
  LIMIT ?;
  `;
  db.query(query, [limit], callback);
};

const getTopMoviesAndSeriesByRottenTomatoesRating = (limit, callback) => {
  const query = `
  SELECT 
      imdbID,
      title_en,
      title_bg,
      type,
      imdbRating,
      metascore,
      boxOffice,
      awards,
      ratings,
      rottenTomatoes
    FROM (
      SELECT 
          imdbID,
          title_en,
          title_bg,
          type,
          imdbRating,
          metascore,
          boxOffice,
          awards,
          ratings,
      
          -- Extract Rotten Tomatoes score as a decimal, if available
          CAST(
              REPLACE(
                  JSON_UNQUOTE(JSON_EXTRACT(ratings, '$[1].Value')), '%', ''
              ) AS DECIMAL(5, 2)
          ) AS rottenTomatoes,

          -- Assign row number based on Rotten Tomatoes score in descending order
          ROW_NUMBER() OVER (PARTITION BY imdbID ORDER BY 
              CAST(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(ratings, '$[1].Value')), '%', '') AS DECIMAL(5, 2)) DESC
          ) AS row_num

      FROM recommendations
      WHERE imdbID IS NOT NULL 
        AND imdbID != 'N/A'
        AND JSON_UNQUOTE(JSON_EXTRACT(ratings, '$[1].Value')) IS NOT NULL
        AND JSON_UNQUOTE(JSON_EXTRACT(ratings, '$[1].Value')) != 'N/A'
  ) AS ranked
  WHERE row_num = 1
  ORDER BY rottenTomatoes DESC
  LIMIT ?;
  `;
  db.query(query, [limit], callback);
};

const getUsersTopRecommendations = (userId, callback) => {
  const query = `
    SELECT 
        r.id,
        r.imdbID,
        r.title_en,
        r.title_bg,
        r.type,
        r.awards,
        COUNT(*) AS recommendations,

        -- Extract Oscar wins as an integer (if available)
        COALESCE(
            CASE 
                WHEN r.awards REGEXP 'Won [0-9]+ Oscar' OR r.awards REGEXP 'Won [0-9]+ Oscars' 
                THEN CAST(NULLIF(SUBSTRING_INDEX(SUBSTRING_INDEX(r.awards, 'Won ', -1), ' Oscar', 1), '') AS UNSIGNED)
                ELSE 0
            END, 
            0
        ) AS oscar_wins,

        -- Extract Oscar nominations as an integer (if available)
        COALESCE(
            CASE 
                WHEN r.awards REGEXP 'Nominated for [0-9]+ Oscar' OR r.awards REGEXP 'Nominated for [0-9]+ Oscars' 
                THEN CAST(NULLIF(SUBSTRING_INDEX(SUBSTRING_INDEX(r.awards, 'Nominated for ', -1), ' Oscar', 1), '') AS UNSIGNED)
                ELSE 0
            END, 
            0
        ) AS oscar_nominations,

        -- Extract total wins as an integer
        COALESCE(
            CAST(NULLIF(REGEXP_SUBSTR(r.awards, '([0-9]+) win(s)?'), '') AS UNSIGNED), 
            0
        ) AS total_wins,

        -- Extract total nominations as an integer
        COALESCE(
            CAST(NULLIF(REGEXP_SUBSTR(r.awards, '([0-9]+) nomination(s)?'), '') AS UNSIGNED), 
            0
        ) AS total_nominations,

        -- Include additional fields
        COALESCE(CAST(r.imdbRating AS DECIMAL(3, 1)), 0) AS imdbRating,
        COALESCE(CAST(r.metascore AS UNSIGNED), 0) AS metascore,
        COALESCE(
            CAST(REPLACE(REPLACE(r.boxOffice, '$', ''), ',', '') AS UNSIGNED),
            0
        ) AS boxOffice
    FROM 
        recommendations r
    WHERE 
        r.user_id = ${userId}
    GROUP BY 
        r.title_en
    ORDER BY 
        recommendations DESC;
  `;

  db.query(query, (err, results) => {
    // Calculate prosperity score for each recommendation
    const weights = {
      total_wins: 0.3,
      total_nominations: 0.25,
      total_box_office: 0.15,
      avg_metascore: 0.1,
      avg_imdb_rating: 0.1,
      avg_rotten_tomatoes: 0.1
    };

    // Намиране на максималната стойност на бокс офис, за да се нормализира
    const maxBoxOffice = Math.max(
      ...results.map((movie) => {
        const totalBoxOffice = movie.boxOffice
          ? parseFloat(movie.boxOffice.replace(/[$,]/g, "")) || 0
          : 0; // Handle undefined boxOffice
        return totalBoxOffice;
      })
    );

    const recommendationsWithProsperity = results.map((movie) => {
      const totalWins = movie.total_wins || 0; // Ensure no null values
      const totalNominations = movie.total_nominations || 0;

      // Parse and normalize the box office value
      const totalBoxOffice = movie.boxOffice
        ? parseFloat(movie.boxOffice.replace(/[$,]/g, "")) || 0
        : 0; // Handle undefined boxOffice

      // Normalize the box office value on a 0-1 scale
      const normalizedBoxOffice = maxBoxOffice
        ? totalBoxOffice / maxBoxOffice
        : 0;

      const avgIMDbRating = movie.imdbRating || 0;
      const avgMetascore = movie.metascore || 0; // Add Metascore
      const avgRottenTomatoes = movie.avg_rotten_tomatoes
        ? parseFloat(movie.avg_rotten_tomatoes.replace("%", "")) / 100
        : 0;

      // Calculate prosperity score using weighted values
      const prosperityScore =
        totalWins * weights.total_wins +
        totalNominations * weights.total_nominations +
        normalizedBoxOffice * weights.total_box_office +
        avgIMDbRating * weights.avg_imdb_rating +
        avgMetascore * weights.avg_metascore +
        avgRottenTomatoes * weights.avg_rotten_tomatoes;

      return {
        ...movie,
        prosperityScore: Number(prosperityScore.toFixed(2)) // Round to 2 decimal places
      };
    });

    // Count the number of series and movies
    const recommendationsCount = recommendationsWithProsperity.reduce(
      (acc, rec) => {
        if (rec.type === "movie") {
          acc.movies++;
        } else if (rec.type === "series") {
          acc.series++;
        }
        return acc;
      },
      { movies: 0, series: 0 }
    );

    // Include recommendationsCount and sorted recommendations in the response
    callback(null, {
      recommendationsCount,
      recommendations: recommendationsWithProsperity
    });
  });
};

const getUsersTopGenres = (userId, limit, callback) => {
  const query = `
    SELECT genre_en, genre_bg, COUNT(*) AS count
    FROM (
      SELECT 
        TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(r.genre_en, ',', numbers.n), ',', -1)) AS genre_en,
        TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(r.genre_bg, ',', numbers.n), ',', -1)) AS genre_bg
      FROM recommendations r
      INNER JOIN (
        SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION
        SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
      ) AS numbers 
      ON CHAR_LENGTH(r.genre_en) - CHAR_LENGTH(REPLACE(r.genre_en, ',', '')) >= numbers.n - 1
      AND CHAR_LENGTH(r.genre_bg) - CHAR_LENGTH(REPLACE(r.genre_bg, ',', '')) >= numbers.n - 1
      WHERE r.user_id = ?
    ) AS subquery
    GROUP BY genre_en, genre_bg
    ORDER BY count DESC
    LIMIT ?
  `;
  db.query(query, [userId, limit], callback);
};

const getUsersTopActors = (userId, limit, callback) => {
  const query = `
    SELECT actor, COUNT(*) AS recommendations_count
    FROM (
      SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(actors, ',', n.n), ',', -1)) AS actor
      FROM recommendations
      CROSS JOIN (
          SELECT a.N + b.N * 10 + 1 AS n
          FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a,
              (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
          ORDER BY n
      ) n
      WHERE user_id = ? 
        AND n.n <= 1 + (LENGTH(actors) - LENGTH(REPLACE(actors, ',', '')))
        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(actors, ',', n.n), ',', -1)) != 'N/A'
    ) AS actor_list
    GROUP BY actor
    ORDER BY recommendations_count DESC
    LIMIT ?;
  `;

  db.query(query, [userId, limit], async (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    // Translate actor names
    const translatedResults = await Promise.all(
      results.map(async (row) => {
        const translatedActor = await hf.translate(row.actor);
        return {
          actor_en: row.actor,
          actor_bg: translatedActor,
          recommendations_count: row.recommendations_count
        };
      })
    );

    // Fetch prosperity data for the actors
    const actors = translatedResults
      .map((actor) => `'${actor.actor_en}'`)
      .join(","); // Ensuring correct formatting for IN clause

    const prosperityQuery = `
      WITH RECURSIVE ActorSplit AS (
        SELECT 
            id, 
            TRIM(SUBSTRING_INDEX(actors, ',', 1)) AS actor,
            SUBSTRING_INDEX(actors, ',', -1) AS remaining_actors,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            imdbID,
            ratings,
            type
        FROM recommendations
        WHERE actors IS NOT NULL 
          AND actors != 'N/A'
        UNION ALL
        SELECT 
            id,
            TRIM(SUBSTRING_INDEX(remaining_actors, ',', 1)) AS actor,
            SUBSTRING_INDEX(remaining_actors, ',', -1) AS remaining_actors,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            imdbID,
            ratings,
            type
        FROM ActorSplit
        WHERE remaining_actors LIKE '%,%'
      ),
      UniqueMovies AS (
        SELECT 
            DISTINCT imdbID,
            actor,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            ratings
        FROM ActorSplit
        WHERE actor IS NOT NULL AND actor != 'N/A'
      ),
      ActorRecommendations AS (
        SELECT actor, COUNT(*) AS total_recommendations  -- Count all recommendations for each actor
        FROM (
          SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(actors, ',', n.n), ',', -1)) AS actor
          FROM recommendations
          CROSS JOIN (
              SELECT a.N + b.N * 10 + 1 AS n
              FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
              , (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
              ORDER BY n
          ) n
          WHERE n.n <= 1 + (LENGTH(actors) - LENGTH(REPLACE(actors, ',', '')))  -- Split the actor list by comma
            AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(actors, ',', n.n), ',', -1)) != 'N/A'
        ) AS actor_list
        GROUP BY actor
        ORDER BY total_recommendations DESC
      )
      SELECT 
        um.actor,
        ROUND(AVG(um.imdbRating), 2) AS avg_imdb_rating,
        AVG(um.metascore) AS avg_metascore,
        CONCAT('$', FORMAT(SUM(CASE 
                WHEN um.boxOffice IS NULL OR um.boxOffice = 'N/A' 
                THEN 0 
                ELSE CAST(REPLACE(REPLACE(um.boxOffice, '$', ''), ',', '') AS UNSIGNED) 
            END), 0)) AS total_box_office,
        CONCAT(ROUND(AVG(CAST(REPLACE(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(um.ratings, '$[1].Value')), '%', ''), ',', '') AS DECIMAL(5,2))), 0), '%') AS avg_rotten_tomatoes,
        COUNT(DISTINCT um.imdbID) AS movie_series_count,
        COALESCE(ar.total_recommendations, 0) AS total_recommendations,
        SUM(CASE 
                WHEN um.awards IS NOT NULL THEN 
                    CASE 
                        WHEN um.awards LIKE '1 win%' THEN 1
                        ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ win(s)') AS UNSIGNED), 0)
                    END
                ELSE 0 
            END) AS total_wins,
        SUM(CASE 
                WHEN um.awards IS NOT NULL THEN 
                    CASE 
                        WHEN um.awards LIKE '1 nomination%' THEN 1
                        ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ nomination(s)') AS UNSIGNED), 0)
                    END
                ELSE 0 
            END) AS total_nominations
      FROM 
          UniqueMovies um
      LEFT JOIN 
          ActorRecommendations ar ON um.actor = ar.actor
      WHERE 
          um.actor IN (${actors})
      GROUP BY 
          um.actor
      ORDER BY 
          avg_imdb_rating DESC;
    `;

    db.query(prosperityQuery, async (err, prosperityResults) => {
      if (err) {
        callback(err, null);
        return;
      }

      // Calculate prosperity score for each actor
      const maxBoxOffice = Math.max(
        ...prosperityResults.map((actor) => {
          const totalBoxOffice =
            parseFloat(actor.total_box_office.replace(/[$,]/g, "")) || 0;
          return totalBoxOffice;
        })
      );

      const weights = {
        total_wins: 0.3,
        total_nominations: 0.25,
        total_box_office: 0.15,
        avg_metascore: 0.1,
        avg_imdb_rating: 0.1,
        avg_rotten_tomatoes: 0.1
      };

      const actorsWithProsperity = prosperityResults.map((actor) => {
        const totalWins = actor.total_wins || 0;
        const totalNominations = actor.total_nominations || 0;

        const totalBoxOffice =
          parseFloat(actor.total_box_office.replace(/[$,]/g, "")) || 0;
        const normalizedBoxOffice = maxBoxOffice
          ? totalBoxOffice / maxBoxOffice
          : 0;

        const avgIMDbRating = actor.avg_imdb_rating || 0;
        const avgMetascore = actor.avg_metascore || 0;
        const avgRottenTomatoes = actor.avg_rotten_tomatoes
          ? parseFloat(actor.avg_rotten_tomatoes.replace("%", "")) / 100
          : 0;

        const prosperityScore =
          totalWins * weights.total_wins +
          totalNominations * weights.total_nominations +
          normalizedBoxOffice * weights.total_box_office +
          avgMetascore * weights.avg_metascore +
          avgIMDbRating * weights.avg_imdb_rating +
          avgRottenTomatoes * weights.avg_rotten_tomatoes;

        return {
          ...actor,
          prosperityScore: Number(prosperityScore.toFixed(2))
        };
      });

      // Combine the top actors with their prosperity data
      const combinedResults = translatedResults.map((actor) => {
        const prosperity = actorsWithProsperity.find(
          (result) => result.actor === actor.actor_en
        ) || {
          prosperityScore: "N/A",
          total_box_office: "N/A",
          avg_imdb_rating: "N/A",
          avg_metascore: "N/A",
          avg_rotten_tomatoes: "N/A",
          movie_series_count: "N/A",
          total_recommendations: "N/A",
          total_wins: "N/A",
          total_nominations: "N/A"
        };
        return {
          ...actor,
          ...prosperity
        };
      });

      // Remove unnecessary fields
      const filteredResults = combinedResults.map((actorData) => {
        const { actor, ...rest } = actorData;
        return rest;
      });

      const sortedResults = filteredResults.sort(
        (a, b) => b.total_recommendations - a.total_recommendations
      );

      callback(null, sortedResults);
    });
  });
};

const getUsersTopDirectors = (userId, limit, callback) => {
  const query = `
    SELECT director, COUNT(*) AS recommendations_count
    FROM (
      SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(director, ',', n.n), ',', -1)) AS director
      FROM recommendations
      CROSS JOIN (
          SELECT a.N + b.N * 10 + 1 AS n
          FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a,
              (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
          ORDER BY n
      ) n
      WHERE user_id = ? 
        AND n.n <= 1 + (LENGTH(director) - LENGTH(REPLACE(director, ',', '')))
        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(director, ',', n.n), ',', -1)) != 'N/A'
    ) AS director_list
    GROUP BY director
    ORDER BY recommendations_count DESC
    LIMIT ?;
  `;

  db.query(query, [userId, limit], async (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    // Translate director names
    const translatedResults = await Promise.all(
      results.map(async (row) => {
        const translatedDirector = await hf.translate(row.director);
        return {
          director_en: row.director,
          director_bg: translatedDirector,
          recommendations_count: row.recommendations_count
        };
      })
    );

    // Fetch prosperity data for the directors
    const directors = translatedResults
      .map((director) => `'${director.director_en}'`)
      .join(","); // Ensuring correct formatting for IN clause

    console.log("directors: ", directors);
    const prosperityQuery = `
      WITH RECURSIVE DirectorSplit AS (
        SELECT 
            id, 
            TRIM(SUBSTRING_INDEX(director, ',', 1)) AS director,
            SUBSTRING_INDEX(director, ',', -1) AS remaining_directors,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            imdbID,
            ratings,
            type
        FROM recommendations
        WHERE director IS NOT NULL 
          AND director != 'N/A'
        UNION ALL
        SELECT 
            id,
            TRIM(SUBSTRING_INDEX(remaining_directors, ',', 1)) AS director,
            SUBSTRING_INDEX(remaining_directors, ',', -1) AS remaining_directors,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            imdbID,
            ratings,
            type
        FROM DirectorSplit
        WHERE remaining_directors LIKE '%,%'
      ),
      UniqueMovies AS (
        SELECT 
            DISTINCT imdbID,
            director,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            ratings
        FROM DirectorSplit
        WHERE director IS NOT NULL AND director != 'N/A'
      ),
      DirectorRecommendations AS (
        SELECT director, COUNT(*) AS total_recommendations  -- Count all recommendations for each director
        FROM (
          SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(director, ',', n.n), ',', -1)) AS director
          FROM recommendations
          CROSS JOIN (
              SELECT a.N + b.N * 10 + 1 AS n
              FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
              , (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
              ORDER BY n
          ) n
          WHERE n.n <= 1 + (LENGTH(director) - LENGTH(REPLACE(director, ',', '')))  -- Split the director list by comma
            AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(director, ',', n.n), ',', -1)) != 'N/A'
        ) AS director_list
        GROUP BY director
        ORDER BY total_recommendations DESC
      )
      SELECT 
        um.director,
        ROUND(AVG(um.imdbRating), 2) AS avg_imdb_rating,
        AVG(um.metascore) AS avg_metascore,
        CONCAT('$', FORMAT(SUM(CASE 
                WHEN um.boxOffice IS NULL OR um.boxOffice = 'N/A' 
                THEN 0 
                ELSE CAST(REPLACE(REPLACE(um.boxOffice, '$', ''), ',', '') AS UNSIGNED) 
            END), 0)) AS total_box_office,
        CONCAT(ROUND(AVG(CAST(REPLACE(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(um.ratings, '$[1].Value')), '%', ''), ',', '') AS DECIMAL(5,2))), 0), '%') AS avg_rotten_tomatoes,
        COUNT(DISTINCT um.imdbID) AS movie_series_count,
        COALESCE(dr.total_recommendations, 0) AS total_recommendations,
        SUM(CASE 
                WHEN um.awards IS NOT NULL THEN 
                    CASE 
                        WHEN um.awards LIKE '1 win%' THEN 1
                        ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ win(s)') AS UNSIGNED), 0)
                    END
                ELSE 0 
            END) AS total_wins,
        SUM(CASE 
                WHEN um.awards IS NOT NULL THEN 
                    CASE 
                        WHEN um.awards LIKE '1 nomination%' THEN 1
                        ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ nomination(s)') AS UNSIGNED), 0)
                    END
                ELSE 0 
            END) AS total_nominations
      FROM 
          UniqueMovies um
      LEFT JOIN 
          DirectorRecommendations dr ON um.director = dr.director
      WHERE 
          um.director IN (${directors})
      GROUP BY 
          um.director
      ORDER BY 
          avg_imdb_rating DESC;
    `;

    db.query(prosperityQuery, async (err, prosperityResults) => {
      if (err) {
        callback(err, null);
        return;
      }

      // Calculate prosperity score for each director
      const maxBoxOffice = Math.max(
        ...prosperityResults.map((director) => {
          const totalBoxOffice =
            parseFloat(director.total_box_office.replace(/[$,]/g, "")) || 0;
          return totalBoxOffice;
        })
      );

      console.log(
        ...prosperityResults.map((director) => {
          const totalBoxOffice =
            parseFloat(director.total_box_office.replace(/[$,]/g, "")) || 0;
          return totalBoxOffice;
        })
      );

      const weights = {
        total_wins: 0.3,
        total_nominations: 0.25,
        total_box_office: 0.15,
        avg_metascore: 0.1,
        avg_imdb_rating: 0.1,
        avg_rotten_tomatoes: 0.1
      };

      const directorsWithProsperity = prosperityResults.map((director) => {
        const totalWins = director.total_wins || 0;
        const totalNominations = director.total_nominations || 0;

        const totalBoxOffice =
          parseFloat(director.total_box_office.replace(/[$,]/g, "")) || 0;
        const normalizedBoxOffice = maxBoxOffice
          ? totalBoxOffice / maxBoxOffice
          : 0;

        const avgIMDbRating = director.avg_imdb_rating || 0;
        const avgMetascore = director.avg_metascore || 0;
        const avgRottenTomatoes = director.avg_rotten_tomatoes
          ? parseFloat(director.avg_rotten_tomatoes.replace("%", "")) / 100
          : 0;

        console.log(
          "getUsersTopDirectors",
          director.director,
          totalWins,
          totalNominations,
          totalBoxOffice,
          maxBoxOffice,
          normalizedBoxOffice,
          avgMetascore,
          avgIMDbRating,
          avgRottenTomatoes
        );
        const prosperityScore =
          totalWins * weights.total_wins +
          totalNominations * weights.total_nominations +
          normalizedBoxOffice * weights.total_box_office +
          avgMetascore * weights.avg_metascore +
          avgIMDbRating * weights.avg_imdb_rating +
          avgRottenTomatoes * weights.avg_rotten_tomatoes;

        return {
          ...director,
          prosperityScore: Number(prosperityScore.toFixed(2))
        };
      });

      // Combine the top directors with their prosperity data
      const combinedResults = translatedResults.map((director) => {
        const prosperity = directorsWithProsperity.find(
          (result) => result.director === director.director_en
        ) || {
          prosperityScore: "N/A",
          total_box_office: "N/A",
          avg_imdb_rating: "N/A",
          avg_metascore: "N/A",
          avg_rotten_tomatoes: "N/A",
          movie_series_count: "N/A",
          total_recommendations: "N/A",
          total_wins: "N/A",
          total_nominations: "N/A"
        };
        return {
          ...director,
          ...prosperity
        };
      });

      // Remove unnecessary fields
      const filteredResults = combinedResults.map((directorData) => {
        const { director, ...rest } = directorData;
        return rest;
      });

      const sortedResults = filteredResults.sort(
        (a, b) => b.recommendations_count - a.recommendations_count
      );

      callback(null, sortedResults);
    });
  });
};

const getUsersTopWriters = (userId, limit, callback) => {
  const query = `
    SELECT writer, COUNT(*) AS recommendations_count
    FROM (
      SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(writer, ',', n.n), ',', -1)) AS writer
      FROM recommendations
      CROSS JOIN (
          SELECT a.N + b.N * 10 + 1 AS n
          FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a,
              (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
          ORDER BY n
      ) n
      WHERE user_id = ? 
        AND n.n <= 1 + (LENGTH(writer) - LENGTH(REPLACE(writer, ',', '')))
        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(writer, ',', n.n), ',', -1)) != 'N/A'
    ) AS writer_list
    GROUP BY writer
    ORDER BY recommendations_count DESC
    LIMIT ?;
  `;

  db.query(query, [userId, limit], async (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    // Translate writer names
    const translatedResults = await Promise.all(
      results.map(async (row) => {
        const translatedWriter = await hf.translate(row.writer);
        return {
          writer_en: row.writer,
          writer_bg: translatedWriter,
          recommendations_count: row.recommendations_count
        };
      })
    );

    // Fetch prosperity data for the writers
    const writers = translatedResults
      .map((writer) => `'${writer.writer_en}'`)
      .join(","); // Ensuring correct formatting for IN clause

    const prosperityQuery = `
      WITH RECURSIVE WriterSplit AS (
        SELECT 
            id, 
            TRIM(SUBSTRING_INDEX(writer, ',', 1)) AS writer,
            SUBSTRING_INDEX(writer, ',', -1) AS remaining_writers,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            imdbID,
            ratings,
            type
        FROM recommendations
        WHERE writer IS NOT NULL 
          AND writer != 'N/A'
        UNION ALL
        SELECT 
            id,
            TRIM(SUBSTRING_INDEX(remaining_writers, ',', 1)) AS writer,
            SUBSTRING_INDEX(remaining_writers, ',', -1) AS remaining_writers,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            imdbID,
            ratings,
            type
        FROM WriterSplit
        WHERE remaining_writers LIKE '%,%'
      ),
      UniqueMovies AS (
        SELECT 
            DISTINCT imdbID,
            writer,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            ratings
        FROM WriterSplit
        WHERE writer IS NOT NULL AND writer != 'N/A'
      ),
      WriterRecommendations AS (
        SELECT writer, COUNT(*) AS total_recommendations  -- Count all recommendations for each writer
        FROM (
          SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(writer, ',', n.n), ',', -1)) AS writer
          FROM recommendations
          CROSS JOIN (
              SELECT a.N + b.N * 10 + 1 AS n
              FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
              , (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
              ORDER BY n
          ) n
          WHERE n.n <= 1 + (LENGTH(writer) - LENGTH(REPLACE(writer, ',', '')))  -- Split the writer list by comma
            AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(writer, ',', n.n), ',', -1)) != 'N/A'
        ) AS writer_list
        GROUP BY writer
        ORDER BY total_recommendations DESC
      )
      SELECT 
        um.writer,
        ROUND(AVG(um.imdbRating), 2) AS avg_imdb_rating,
        AVG(um.metascore) AS avg_metascore,
        CONCAT('$', FORMAT(SUM(CASE 
                WHEN um.boxOffice IS NULL OR um.boxOffice = 'N/A' 
                THEN 0 
                ELSE CAST(REPLACE(REPLACE(um.boxOffice, '$', ''), ',', '') AS UNSIGNED) 
            END), 0)) AS total_box_office,
        CONCAT(ROUND(AVG(CAST(REPLACE(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(um.ratings, '$[1].Value')), '%', ''), ',', '') AS DECIMAL(5,2))), 0), '%') AS avg_rotten_tomatoes,
        COUNT(DISTINCT um.imdbID) AS movie_series_count,
        COALESCE(wr.total_recommendations, 0) AS total_recommendations,
        SUM(CASE 
                WHEN um.awards IS NOT NULL THEN 
                    CASE 
                        WHEN um.awards LIKE '1 win%' THEN 1
                        ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ win(s)') AS UNSIGNED), 0)
                    END
                ELSE 0 
            END) AS total_wins,
        SUM(CASE 
                WHEN um.awards IS NOT NULL THEN 
                    CASE 
                        WHEN um.awards LIKE '1 nomination%' THEN 1
                        ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ nomination(s)') AS UNSIGNED), 0)
                    END
                ELSE 0 
            END) AS total_nominations
      FROM 
          UniqueMovies um
      LEFT JOIN 
          WriterRecommendations wr ON um.writer = wr.writer
      WHERE 
          um.writer IN (${writers})
      GROUP BY 
          um.writer
      ORDER BY 
          avg_imdb_rating DESC;
    `;

    db.query(prosperityQuery, async (err, prosperityResults) => {
      if (err) {
        callback(err, null);
        return;
      }

      // Calculate prosperity scores (same logic as directors)
      const maxBoxOffice = Math.max(
        ...prosperityResults.map((writer) => {
          const totalBoxOffice =
            parseFloat(writer.total_box_office.replace(/[$,]/g, "")) || 0;
          return totalBoxOffice;
        })
      );

      const weights = {
        total_wins: 0.3,
        total_nominations: 0.25,
        total_box_office: 0.15,
        avg_metascore: 0.1,
        avg_imdb_rating: 0.1,
        avg_rotten_tomatoes: 0.1
      };

      const writersWithProsperity = prosperityResults.map((writer) => {
        const totalWins = writer.total_wins || 0;
        const totalNominations = writer.total_nominations || 0;

        const totalBoxOffice =
          parseFloat(writer.total_box_office.replace(/[$,]/g, "")) || 0;
        const normalizedBoxOffice = maxBoxOffice
          ? totalBoxOffice / maxBoxOffice
          : 0;

        const avgIMDbRating = writer.avg_imdb_rating || 0;
        const avgMetascore = writer.avg_metascore || 0;
        const avgRottenTomatoes = writer.avg_rotten_tomatoes
          ? parseFloat(writer.avg_rotten_tomatoes.replace("%", "")) / 100
          : 0;

        const prosperityScore =
          totalWins * weights.total_wins +
          totalNominations * weights.total_nominations +
          normalizedBoxOffice * weights.total_box_office +
          avgMetascore * weights.avg_metascore +
          avgIMDbRating * weights.avg_imdb_rating +
          avgRottenTomatoes * weights.avg_rotten_tomatoes;

        return {
          ...writer,
          prosperityScore: Number(prosperityScore.toFixed(2))
        };
      });

      // Combine top writers with their prosperity data
      const combinedResults = translatedResults.map((writer) => {
        const prosperity = writersWithProsperity.find(
          (result) => result.writer === writer.writer_en
        ) || {
          prosperityScore: "N/A",
          total_box_office: "N/A",
          avg_imdb_rating: "N/A",
          avg_metascore: "N/A",
          avg_rotten_tomatoes: "N/A",
          movie_series_count: "N/A",
          total_recommendations: "N/A",
          total_wins: "N/A",
          total_nominations: "N/A"
        };

        return {
          ...writer,
          ...prosperity
        };
      });

      // Remove unnecessary fields
      const filteredResults = combinedResults.map((writerData) => {
        const { writer, ...rest } = writerData;
        return rest;
      });

      const sortedResults = filteredResults.sort(
        (a, b) => b.total_recommendations - a.total_recommendations
      );

      callback(null, sortedResults);
    });
  });
};

module.exports = {
  checkEmailExists,
  createUser,
  findUserByEmail,
  updateUserPassword,
  getUserById,
  saveRecommendation,
  saveToWatchlist,
  saveUserPreferences,
  getUsersCount,
  getAverageBoxOfficeAndScores,
  getTopRecommendationsPlatform,
  getTopCountries,
  getTopGenres,
  getGenrePopularityOverTime,
  getTopActors,
  getTopDirectors,
  getTopWriters,
  getOscarsByMovie,
  getTotalAwardsByMovieOrSeries,
  getTotalAwardsCount,
  getSortedDirectorsByProsperity,
  getSortedActorsByProsperity,
  getSortedWritersByProsperity,
  getSortedMoviesByProsperity,
  getTopMoviesAndSeriesByMetascore,
  getTopMoviesAndSeriesByIMDbRating,
  getTopMoviesAndSeriesByRottenTomatoesRating,
  getUsersTopRecommendations,
  getUsersTopGenres,
  getUsersTopActors,
  getUsersTopDirectors,
  getUsersTopWriters
};
