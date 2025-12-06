const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

db.connect(e=>{
  if(e){
    console.log("Error Db",e)
  }else{
    console.log("DB successfully connect")
  }

})
 

module.exports = db;
