const db = require("../db/database");
const bcrypt = require("bcrypt");

function signup(req, res) {
  const {
    name,
    regNo,
    dateOfBirth,
    gender,
    section,
    password,
    confirmPassword,
    email,
  } = req.body;

  // isValid data
  if (
    !name ||
    !regNo ||
    !dateOfBirth ||
    !gender ||
    !section ||
    !password ||
    !confirmPassword ||
    !email
  ) {
    return res.json({ message: "❌ All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.json({ message: "❌ Passwords do not match" });
  }

  //  check email exists
  const queryEmail = `SELECT * FROM students WHERE email=?`;
  db.query(queryEmail, [email], (err, emailRow) => {
    if (err) {
      return res.json({ message: "❌ Server error", err });
    }

    if (emailRow.length > 0) {
      return res.json({ message: "❌ Email already exists" });
    }

    //  Check if regNo exists
    const queryReg = `SELECT * FROM students WHERE reg_number=?`;
    db.query(queryReg, [regNo], (err, regRow) => {
      if (err) {
        return res.json({ message: "❌ Server error", err });
      }

      if (regRow.length > 0) {
        return res.json({ message: "❌ Register Number already exists" });
      }

      // Insert new user
      const insertQuery = `INSERT INTO students (name, reg_number, email, dob, gender, section, password) VALUES (?, ?, ?, ?, ?, ?, ?)`;

      bcrypt.hash(password, 10).then((hashPassword) => {
        db.query(
          insertQuery,
          [name, regNo, email, dateOfBirth, gender, section, hashPassword],
          (err, result) => {
            if (err) return res.json({ message: "❌ Server error", err });

            return res.json({
              message: "Success ✔ User registered",
              userId: result.insertId,
            });
          }
        );
      });
    });
  });
}

module.exports = signup;
