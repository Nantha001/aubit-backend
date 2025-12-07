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
      console.log("Database Connection Failed ❌", err.code);
      setTimeout(connectDB, 5000); 
    } else {
      console.log("Database Connected ✔");
    }
  });

  db.on("error", (err) => {
    console.log("DB Error", err.code);
    if (err.code === "PROTOCOL_CONNECTION_LOST" || err.code === "ETIMEDOUT") {
      connectDB();
    } else {
      throw err;
    }
  });
}

connectDB();

module.exports = db;
