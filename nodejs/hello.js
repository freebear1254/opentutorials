var mysql      = require('mysql');//mysql 모듈 사용 선언
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'nodejs',
  password : 'sks1254',
  database : 'nodejs'
});
//mysql 접속 정보 
 
connection.connect();


var results=[];
// results 변수의 범위(scope) 문제도 해결됨.
var pushResults = function (rows) {
    // 5개만 가져오려면 i<6 하시면 되긴 하는데 전체를 다 가져오려면 이렇게 할 수 있습니다.
    for (var i=0; i<results.length; i++) {
        results.push(rows[i].resultId);
    }
}

// 필요할 때만 콜함

var sql='SELECT * FROM topic';
connection.query(sql, function (err, rows, fields) {
if (!err) {
    pushResults(results);
    
} else {
    console.log('Error while performing Query. ', err);
}});

console.log(results);