var http = require('http');
var fs = require('fs');
var url = require('url');



var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var title = queryData.id;

  
  if (_url == '/') {
    title = 'Welcome';
  }
  if (_url == '/favicon.ico') {
    return response.writeHead(404);
  }
  response.writeHead(200);
  let templete;
  fs.readFile(`data/${title}`, `utf8`, function (err, data) {
    templete = `
    <!doctype html>
    <html>
    <head>
      <title>${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">${title}</a></h1>
      <ol>
        <li><a href="/?id=html">HTML</a></li>
        <li><a href="/?id=css">CSS</a></li>
        <li><a href="/?id=javascript">JavaScript</a></li>
      </ol>
      <h2>${title}</h2>
      <p>${data}</p>
    </body>
    </html>        
    `
    response.end(templete);
  });


});
app.listen(3000);