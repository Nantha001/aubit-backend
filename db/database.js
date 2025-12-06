const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

db.connect((e) => {
  if (e) {
    console.log("Error Db", e);
  } else {
    console.log("DB successfully connec");
  }
});

module.exports = db;
