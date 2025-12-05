// const mysql = require("mysql2");
const { Pool } = require("pg");
const db = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT,
});

db.connect((err, client, release) => {
  if (err) {
    console.log("db Error", err);
  } else {
    console.log("db connected");
    release();
  }
});

module.exports = db;
