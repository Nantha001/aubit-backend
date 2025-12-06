const mysql = require("mysql2");

const config = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  connectTimeout: 10000,
};

let connection = null;

// Export a small wrapper so other modules can call `db.query(...)` immediately.
// If the DB isn't ready yet, queries will receive an error callback.
const db = {
  query: function (sql, params, cb) {
    if (typeof params === "function") {
      cb = params;
      params = [];
    }

    if (!connection) {
      const err = new Error("Database not connected");
      err.code = "DB_NOT_CONNECTED";
      if (cb) return cb(err);
      return Promise.reject(err);
    }

    return connection.query(sql, params, cb);
  },
  getRawConnection: () => connection,
};

function createConnectionWithRetry(retryDelay = 5000) {
  try {
    connection = mysql.createConnection(config);

    connection.connect((err) => {
      if (err) {
        console.error("Error Db", err);
        // destroy the unusable connection and retry after delay
        try {
          connection.destroy();
        } catch (e) {}
        connection = null;
        setTimeout(() => createConnectionWithRetry(retryDelay), retryDelay);
        return;
      }

      console.log("DB successfully connect");

      connection.on("error", (err) => {
        console.error("DB error", err);
        if (err && err.fatal) {
          // attempt to reconnect
          try {
            connection.destroy();
          } catch (e) {}
          connection = null;
          console.log("Attempting DB reconnect...");
          setTimeout(() => createConnectionWithRetry(retryDelay), retryDelay);
        }
      });
    });
  } catch (e) {
    console.error("Unexpected error while creating DB connection", e);
    connection = null;
    setTimeout(() => createConnectionWithRetry(retryDelay), retryDelay);
  }
}

// Start initial connection attempt
createConnectionWithRetry();

module.exports = db;
