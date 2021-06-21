var http = require('http');
var fs = require('fs');
var url = require('url');
const { findSourceMap } = require('module');

var app = http.createServer(function (request, response) {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathName = url.parse(_url, true).pathname;
  let title = queryData.id;
  ;

  if (pathName === '/') {
    fs.readFile(`data/${title}`, `utf8`, function (err, data) {
      if (title === undefined) {
        title = "Welcome";
        data = "Hello Node.js"
      }
      fs.readdir(`./data`, (err, fileName) => {
        let fileList = '';
        for (i = 0; i < fileName.length; i++) {
          fileList = fileList + `<li><a href = '/?${fileName[i]}'>${fileName[i]}</a></li>`
        }
        
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
        ${fileList}
        </ol>
        <h2>${title}</h2>
        <p>${data}</p>
        </body>
        </html>        
        `;
        response.writeHead(200);
        response.end(templete);
      });

    })

  } else {
    response.writeHead(404);
    response.end('Not found');
  }

});


app.listen(3000);