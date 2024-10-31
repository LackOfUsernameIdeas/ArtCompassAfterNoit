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

module.exports = {
  checkEmailExists,
  createUser,
  findUserByEmail,
  updateUserPassword,
  getUserById,
  saveRecommendation,
  saveUserPreferences,
  getTopRecommendations,
  getTopGenres
};
