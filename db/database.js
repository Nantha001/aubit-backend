const mysql = require("mysql2");
const dns = require("dns").promises;

let pool = null;
let poolReady = false;

const poolConfig = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONN_LIMIT || "10", 10),
  queueLimit: 0,
  connectTimeout: 10000,
};

async function initPoolWithRetry(retryDelay = 5000) {
  try {
    let host = poolConfig.host;
    if (process.env.FORCE_IPV4 === "true") {
      try {
        const res = await dns.lookup(host, { family: 4 });
        host = res.address;
        console.log(`Resolved DB host to IPv4 ${host}`);
      } catch (err) {
        console.warn("IPv4 lookup failed, using original host:", err.message);
      }
    }

    pool = mysql.createPool({ ...poolConfig, host });

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error Db", err);
        poolReady = false;
        try {
          if (connection) connection.release();
        } catch (e) {}
        setTimeout(() => initPoolWithRetry(retryDelay), retryDelay);
        return;
      }

      poolReady = true;
      console.log("DB pool successfully connected");
      connection.release();

      // Listen for connection errors and attempt reconnect if fatal
      pool.on && pool.on("error", (err) => {
        console.error("DB pool error", err);
        if (err && err.fatal) {
          poolReady = false;
          try {
            pool.end();
          } catch (e) {}
          pool = null;
          console.log("Attempting DB pool reconnect...");
          setTimeout(() => initPoolWithRetry(retryDelay), retryDelay);
        }
      });
    });
  } catch (e) {
    console.error("Unexpected error while creating DB pool", e);
    poolReady = false;
    pool = null;
    setTimeout(() => initPoolWithRetry(retryDelay), retryDelay);
  }
}

initPoolWithRetry();

const db = {
  query(sql, params, cb) {
    if (typeof params === "function") {
      cb = params;
      params = [];
    }

    if (!pool || !poolReady) {
      const err = new Error("Database not connected");
      err.code = "DB_NOT_CONNECTED";
      if (cb) return cb(err);
      return Promise.reject(err);
    }

    return pool.query(sql, params, cb);
  },
  getPool: () => pool,
};

module.exports = db;
