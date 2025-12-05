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
      console.log("Database Error ❌",err)
   
    } else {
      console.log("Database Connected");
    }
  });


}

connectDB();

module.exports = db;
