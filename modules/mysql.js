const mysql = require('mysql');
const db = require('../config/config')
const connection = mysql.createConnection({
    host :db.host,
    user: db.user,
    password : db.password,
    database: db.database
});

module.exports=connection;
