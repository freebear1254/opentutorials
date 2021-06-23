var mysql      = require('mysql');//mysql 모듈 사용 선언
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'nodejs',
  password : 'sks1254',
  database : 'nodejs'
});
//mysql 접속 정보 
 
connection.connect();

const queryString = 'SELECT * FROM topic';
connection.query(queryString, function (error, results, fields) {
  if (error) {
      console.log(error);
  };
  console.log(results);
});
 
connection.end();