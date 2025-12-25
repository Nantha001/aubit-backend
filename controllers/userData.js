const db = require("../db/database");

function userData(req, res) {
  const userQuery = `select name,reg_number,dob,gender from students`;
  db.query(userQuery, [], (err, row) => {
    if (err) {
      return res.status(500).json({ message: "❌ Database failure" });
    }

    return res.status(200).json({data:row,payLoad:req.user});
  });
}

module.exports = userData;
