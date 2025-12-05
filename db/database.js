const { Pool } = require("pg");

let db;

function connectDB() {
  db = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT,
  });

  db.connect((err, client, release) => {
    if (err) {
      console.log("db Error", err.code);
      setTimeout(connectDB, 2000);
    } else {
      console.log("db connected");
      release();
    }
  });

  db.on("error", () => connectDB());
}

connectDB();

module.exports = db;
