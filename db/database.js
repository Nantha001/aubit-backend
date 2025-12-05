const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

function handleDisconnect(connection) {
  connection.connect((err) => {
    if (err) {
      console.error("❌ Database Connection Failed:", err);
      setTimeout(() => handleDisconnect(connection), 2000);
    } else {
      console.log("✔ Database Connected Successfully");
    }
  });

  connection.on("error", (err) => {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect(connection);
    } else {
      throw err;
    }
  });
}

handleDisconnect(db);

module.exports = db;
