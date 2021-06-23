var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "nodejs",
  password: "sks1254"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});