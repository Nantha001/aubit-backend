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
      console.error("❌ Database Connection Failed:", err.code);
      setTimeout(connectDB, 2000);
    } else {
      console.log("✔ Database Connected Successfully");
    }
  });

  db.on("error", (err) => {
    console.error("🔥 MySQL Error:", err.code);

    if (err.code === "PROTOCOL_CONNECTION_LOST" || err.fatal) {
      connectDB();
    } else {
      throw err;
    }
  });
}

connectDB();

module.exports = db;
