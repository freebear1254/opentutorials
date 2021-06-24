var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
const item = require(`./lib/templete.js`);

const mysql = require('mysql');
let sql = '';

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'nodejs',
  password: 'sks1254',
  database: 'nodejs'
});
connection.connect();


var app = http.createServer(function (request, response) {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathName = url.parse(_url, true).pathname;
  let title = queryData.id;

  const create = `<a href = "/create">create</a> `;
  const update = `
  <a href = "/update?id=${title}">update</a> 
  <form action="/delete_process" method="POST">
    <input type="hidden" name="title" value ="${title}">
    <input type="submit"  value ="delete">   
</form>
  `;

  if (pathName === '/') {
    control = update;
    var sql = `SELECT * FROM topic`;
    connection.query(sql, function (err, results) {
      if (err) {
        throw err;
      }
      else {
        sql = 'SELECT * FROM topic WHERE id=?'
        connection.query(sql, [queryData.id], function (err2, topic) {
          if (err2) {
            throw err2;
          }
          if (title === undefined) {
            title = "Welcome";
            data = `"Hello Node.js"`
            control = create;
          } else {
            title = topic[0].title;
            data = topic[0].description;
          }
          var list = item.list(results);
          var html = item.createTemplet(title, data, list, control);
          response.writeHead(200);
          response.end(html);
        });

      }
    })

  }
  else if (pathName === '/create') {
    title = "Create";
    data = `
    <form action="http://localhost:3000/create_process" method="POST">
    <p><input type="text" name="title" id="" placeholder="title" ></p>
    <p><textarea name="content" id="" cols="30" rows="10" placeholder="여기"></textarea></p>
    <p><input type="submit" value="submit"></p>
    </form>
    `
    control = "";
    var sql = `SELECT * FROM topic`;
    connection.query(sql, function (err, results) {
      var list = item.list(results);
      var html = item.createTemplet(title, data, list, control);
      response.writeHead(200);
      response.end(html);
    });
  }
  else if (pathName === '/create_process') {
    var body = '';
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      title = post.title;
      content = post.content;

      sql =`INSERT INTO topic (title,description,created,author_id) VALUES (?,?,now(),?)`
      connection.query(sql,[title,content,1],function(err,results){
        if(err){
          throw err;
        }
        response.writeHead(302,{location : `/?id=${results.insertId}`});
        response.end();
      })
    });
  }
  else if (pathName === '/update') {
    fs.readFile(`data/${title}`, `utf8`, function (err, data) {
      control = '';
      data = `
    <form action="http://localhost:3000/update_process" method="POST">
    <p><input type="hidden" name="id" id="" value="${title}" ></p>
    <p><input type="text" name="title" id="" placeholder="${title}" value ="${title}"></p>
    <p><textarea name="content" id="" cols="30" rows="10" placeholder="${data}" value="${data}">${data}</textarea></p>
    <p><input type="submit" value="submit"></p>
    </form>
    `
      item.list(title, data, control);
    })
  } else if (pathName === '/update_process') {
    var body = '';
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var content = post.content;

      fs.rename(`data/${id}`, title, function (err) {
        fs.writeFile(`data/${title}`, content, 'utf8', function (error) {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end(`title : ${title} // content : ${content}`);
          console.log(error);
        })
        console.log(err);
      });
    });
  }
  else if (pathName === '/delete_process') {
    var body = '';
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      var title = post.title;

      fs.unlink(`data/${title}`, function (err) {
        console.log(err);
        response.writeHead(302, { location: `/` });
        response.end();
      });
    })
  }
  else {
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);