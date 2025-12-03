
const mysql = require("mysql2");

let db;

function connectDB() {
  db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });

  db.connect((err) => {
    if (err) {
      setTimeout(connectDB, 2000);
    }
  });

  db.on("error", (err) => {
    if (
      err.code === "PROTOCOL_CONNECTION_LOST" ||
      err.code === "ECONNRESET" ||
      err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"
    ) {
      connectDB();
    } else {
      throw err;
    }
  });
}

connectDB();

module.exports = db;

