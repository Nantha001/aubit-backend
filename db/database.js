const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT, 
  family: 4                   
});

db.connect((err) => {
  if (err) {
    console.log("Database Connection Failed ❌", err);
    setTimeout(() => db.connect(), 2000); // retry
  } else {
    console.log("Database Connected ✔");
  }
});

module.exports = db;
