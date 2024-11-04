// database.js
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

require("dotenv").config();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Default password for XAMPP
  database: "_project_name_"
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// Helper functions
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

const saveUserPreferences = (
  userId,
  preferred_genres_en,
  preferred_genres_bg,
  mood,
  timeAvailability,
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
  const sql = `INSERT INTO user_preferences (user_id, preferred_genres_en, preferred_genres_bg, mood, timeAvailability, preferred_type, preferred_actors, preferred_directors, preferred_countries, preferred_pacing, preferred_depth, preferred_target_group, interests, date)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    userId,
    preferred_genres_en,
    preferred_genres_bg,
    mood,
    timeAvailability,
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

const getTopRecommendations = (limit, callback) => {
  const query = `
    SELECT title_en, title_bg, COUNT(*) as recommendations
    FROM recommendations
    GROUP BY title_en
    ORDER BY recommendations DESC
    LIMIT ?
  `;
  db.query(query, [limit], callback);
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
        END AS year,
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
  ) AS actor_list
  GROUP BY actor
  ORDER BY actor_count DESC
  LIMIT ?`;
  db.query(query, [limit], callback);
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
  ) AS director_list
  GROUP BY director
  ORDER BY director_count DESC
  LIMIT ?`;
  db.query(query, [limit], callback);
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
  ) AS writer_list
  GROUP BY writer
  ORDER BY writer_count DESC
  LIMIT ?`;
  db.query(query, [limit], callback);
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

const getTotalAwardsByMovie = (callback) => {
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
          type
      FROM recommendations
      WHERE director IS NOT NULL 
        AND director != 'N/A'
        AND type = 'movie'
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
          type
      FROM DirectorSplit
      WHERE remaining_directors LIKE '%,%'
        AND type = 'movie'
  ),
  UniqueMovies AS (
      SELECT 
          DISTINCT imdbID,
          director,
          imdbRating,
          metascore,
          boxOffice,
          runtime,
          awards
      FROM 
          DirectorSplit
      WHERE director IS NOT NULL AND director != 'N/A'
  ),
  DirectorRecommendations AS (
      SELECT 
          director,
          COUNT(*) AS total_recommendations  -- Count total recommendations for each director
      FROM 
          recommendations
      WHERE 
          director IS NOT NULL 
          AND director != 'N/A'
          AND type = 'movie'
      GROUP BY 
          director
  )
  SELECT 
      um.director,
      ROUND(AVG(um.imdbRating), 2) AS avg_imdb_rating,  -- Round to 2 decimal places
      AVG(um.metascore) AS avg_metascore,
      -- Format total box office with a dollar sign
      CONCAT('$', FORMAT(SUM(CASE 
              WHEN um.boxOffice IS NULL OR um.boxOffice = 'N/A' 
              THEN 0 
              ELSE CAST(REPLACE(REPLACE(um.boxOffice, '$', ''), ',', '') AS UNSIGNED) 
          END), 0)) AS total_box_office,
      AVG(CASE 
              WHEN um.runtime IS NULL OR um.runtime = 'N/A' OR um.runtime < 30 
              THEN NULL 
              ELSE um.runtime 
          END) AS avg_runtime,
      -- Extract total wins as a number
      CAST(SUM(CASE 
              WHEN um.awards IS NOT NULL THEN 
                  COALESCE(
                      CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ wins') AS UNSIGNED), 
                      0
                  )
              ELSE 0 
          END) AS UNSIGNED) AS total_wins,
      -- Extract total nominations as a number
      CAST(SUM(CASE 
              WHEN um.awards IS NOT NULL THEN 
                  COALESCE(
                      CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ nominations') AS UNSIGNED), 
                      0
                  )
              ELSE 0 
          END) AS UNSIGNED) AS total_nominations,
      COUNT(DISTINCT um.imdbID) AS movie_count,  -- Count distinct movies
      COALESCE(dr.total_recommendations, 0) AS total_recommendations  -- Total recommendations from join
  FROM 
      UniqueMovies um
  LEFT JOIN 
      DirectorRecommendations dr ON um.director = dr.director  -- Join to get total recommendations
  GROUP BY 
      um.director
  ORDER BY 
      avg_imdb_rating DESC;
  `;
  // HAVING
  // movie_count > 1
  db.query(query, callback);
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
        awards
    FROM 
        ActorSplit
    WHERE actor IS NOT NULL AND actor != 'N/A'
  ),
  ActorRecommendations AS (
    SELECT 
        TRIM(SUBSTRING_INDEX(actors, ',', 1)) AS actor,
        COUNT(*) AS total_recommendations  -- Count total recommendations for each actor
    FROM 
        recommendations
    WHERE 
        actors IS NOT NULL 
        AND actors != 'N/A'
    GROUP BY 
        actor
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
      COUNT(DISTINCT um.imdbID) AS unique_movie_count,  -- Count distinct movies
      COALESCE(ar.total_recommendations, 0) AS total_recommendations,  -- Total recommendations from join
      CAST(SUM(CASE 
              WHEN um.awards IS NOT NULL THEN 
                  COALESCE(
                      CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ wins') AS UNSIGNED), 
                      0
                  )
              ELSE 0 
          END) AS UNSIGNED) AS total_wins,  -- Total wins
      CAST(SUM(CASE 
              WHEN um.awards IS NOT NULL THEN 
                  COALESCE(
                      CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ nominations') AS UNSIGNED), 
                      0
                  )
              ELSE 0 
          END) AS UNSIGNED) AS total_nominations  -- Total nominations
  FROM 
      UniqueMovies um
  LEFT JOIN 
      ActorRecommendations ar ON um.actor = ar.actor  -- Join to get total recommendations
  GROUP BY 
      um.actor
  ORDER BY 
      avg_imdb_rating DESC;`;
  //after GROUP BY:
  // HAVING
  // COUNT(DISTINCT um.imdbID) > 1  -- Ensure more than 1 unique movie
  db.query(query, callback);
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
          awards
      FROM 
          WriterSplit
      WHERE writer IS NOT NULL AND writer != 'N/A'
  ),
  WriterRecommendations AS (
      SELECT 
          TRIM(SUBSTRING_INDEX(writer, ',', 1)) AS writer,
          COUNT(*) AS total_recommendations  -- Count total recommendations for each writer
      FROM 
          recommendations
      WHERE 
          writer IS NOT NULL 
          AND writer != 'N/A'
      GROUP BY 
          writer
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
      COUNT(DISTINCT um.imdbID) AS unique_movie_count,  -- Count distinct movies
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
  GROUP BY 
      um.writer
  ORDER BY 
      avg_imdb_rating DESC;`;

  // HAVING
  // COUNT(DISTINCT um.imdbID) > 1  -- Ensure more than 1 unique movie
  db.query(query, callback);
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
        title_en,
        title_bg,
        type
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
        title_en,
        title_bg,
        type
    FROM MovieSplit
    WHERE remaining_ids LIKE '%,%'
  ),
  UniqueMovies AS (
      SELECT 
          DISTINCT imdbID,
          MAX(title_en) AS title_en,  -- Use MAX to get the title
          MAX(title_bg) AS title_bg,  -- Use MAX to get the title
          MAX(type) AS type,           -- Assuming type will be 'movie' for all
          MAX(imdbRating) AS imdbRating,  -- Get the maximum rating
          MAX(metascore) AS metascore,  -- Get the maximum metascore
          MAX(boxOffice) AS boxOffice,  -- Get the maximum box office
          MAX(awards) AS awards          -- Get the maximum awards
      FROM 
          MovieSplit
      WHERE imdbID IS NOT NULL 
        AND imdbID != 'N/A'
        AND type = 'movie'  -- Only include movies
      GROUP BY 
          imdbID
  ),
  MovieRecommendations AS (
      SELECT 
          imdbID,
          COUNT(*) AS total_recommendations  -- Count total recommendations for each movie
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
      um.title_en,  -- Select English title
      um.title_bg,  -- Select Bulgarian title
      um.type,      -- Select movie type
      um.imdbRating,  -- Proper IMDb rating
      um.metascore,   -- Proper metascore
      CONCAT('$', FORMAT(MAX(CASE 
              WHEN boxOffice IS NULL OR boxOffice = 'N/A' THEN 0 
              ELSE CAST(REPLACE(REPLACE(um.boxOffice, '$', ''), ',', '') AS UNSIGNED) 
          END), 0)) AS total_box_office,  -- Proper box office
      COALESCE(mr.total_recommendations, 0) AS total_recommendations,  -- Total recommendations from join
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
      MovieRecommendations mr ON um.imdbID = mr.imdbID  -- Join to get total recommendations
  GROUP BY 
      um.imdbID, um.title_en, um.title_bg, um.type, um.imdbRating, um.metascore  -- Group by titles and type
  ORDER BY 
      um.imdbRating DESC;
    `;
  db.query(query, callback);
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
  FROM recommendations
  WHERE imdbID IS NOT NULL 
    AND imdbID != 'N/A'
    AND metascore IS NOT NULL
    AND metascore != 'N/A'
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
  FROM recommendations
  WHERE imdbID IS NOT NULL 
    AND imdbID != 'N/A'
    AND imdbRating IS NOT NULL
    AND imdbRating != 'N/A'
  ORDER BY imdbRating DESC
  LIMIT ?;
  `;
  db.query(query, [limit], callback);
};

module.exports = {
  checkEmailExists,
  createUser,
  findUserByEmail,
  updateUserPassword,
  getUserById,
  saveRecommendation,
  saveUserPreferences,
  getTopRecommendations,
  getTopGenres,
  getGenrePopularityOverTime,
  getTopActors,
  getTopDirectors,
  getTopWriters,
  getOscarsByMovie,
  getTotalAwardsByMovie,
  getTotalAwardsCount,
  getSortedDirectorsByProsperity,
  getSortedActorsByProsperity,
  getSortedWritersByProsperity,
  getSortedMoviesByProsperity,
  getTopMoviesAndSeriesByMetascore,
  getTopMoviesAndSeriesByIMDbRating
};
