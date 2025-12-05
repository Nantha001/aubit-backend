const mysql = require("mysql2");

let db;

function connectDB() {
  db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  });

  db.connect((err) => {
    if (err) {
      console.error("❌ Database Connection Failed:", err.code);
      setTimeout(connectDB, 5000);
    } else {
      console.log("✔ Database Connected Successfully");

 
      db.query("SELECT NOW() AS server_time", (err, result) => {
        if (err) {
          console.error("❌ Test Query Failed:", err.code);
        } else {
          console.log("⏱ MySQL Active - Current Time:", result[0].server_time);
        }
      });
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
