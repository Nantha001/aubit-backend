require("dotenv").config();

const signup = require("./controllers/signup");
const express = require("express");
const db = require("./db/database");
const cors = require("cors");
const userData = require("./controllers/userData");
const login = require("./controllers/login");
const jwt = require("jsonwebtoken");

const upload = require("./cloudinary/upload");

const app = express();

app.use(express.json());
app.use(cors());
const port = process.env.port;

function auth(req, res, next) {
  const authHead = req.headers.authorization;
  if (!authHead) {
    return res
      .status(401)
      .json({ message: "Error Access Token ❌ Unauthentication" });
  }
  const token = authHead.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_KEY, (err, data) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Error Invalid Token ❌ Unauthentication" });
    }

    req.user = data;
  });

  next();
}

//test
app.get("/test", (req, res) => {
  res.json({ message: "success" });
});

// signup
app.post("/signup", signup);
app.post("/login", login);
//get
app.get("/userdata", auth, userData);
//upload
app.post("/upload", auth, upload.single("image"), (req, res) => {
  try {
    const regNo = req.user.regNo;

    const updateQuery = `
      UPDATE students 
      SET profile_photo = ? 
      WHERE reg_number = ?
    `;
    db.query(updateQuery, [req.file.path, regNo], (err, row) => {
      if (err) {
        return res.json({ message: "Error upload" });
      }

      return res.json({
        success: true,
        url: req.file.path,
        public_id: req.file.filename,
      });
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`http://localhost:${port} server is running`);
  }
});
