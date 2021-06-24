const mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'nodejs',
    password: 'sks1254',
    database: 'nodejs'
  });
  connection.connect();
  
  module.exports = connection;