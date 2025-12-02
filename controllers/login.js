const jwt = require("jsonwebtoken");
const db = require("../db/database");
const bcrypt = require("bcrypt");

function login(req, res) {
  const { regNo, password } = req.body;

  if (!password || !regNo) {
    res.json({ message: "❌ All field are required" });
  }

  const queryResno = `select * from  students where reg_number=?`;
  //check valid user
  db.query(queryResno, [regNo], (err, row) => {
    if (err) return res.json({ message: "❌ Server error", err: err });
    if (row.length == 0) {
      return res.json({ message: "❌ Invaild user ID" });
    }
    //hashpassword check
    const user = row[0];
    const hashPassword = row[0].password;
    bcrypt.compare(password, hashPassword, (err, isValid) => {
      if (err) {
        return res.json({ message: "Server Error" });
      }
      if (isValid) {
        const payload = {
          id: user.id,
          regNo: user.reg_number,
        };
        const token = jwt.sign(payload, process.env.JWT_KEY, {
          expiresIn: process.env.EXPIRES,
        });
        return res.json({
          jwtToken: token,
          message: "✔ login is successfully",
        });
      } else {
        return res.json({ message: "❌ Password is not match" });
      }
    });
  });
}

module.exports = login;
