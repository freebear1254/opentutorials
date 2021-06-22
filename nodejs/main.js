var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var app = http.createServer(function (request, response) {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathName = url.parse(_url, true).pathname;
  let title = queryData.id;
  function createTemplet(title, data, fileList) {
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
    <a href = "/create">create</a>
    <h2>${title}</h2>
    <p>${data}</p>
    </body>
    </html>        
    `;
    response.writeHead(200);
    response.end(templete); 

  }

  if (pathName === '/') {
    fs.readFile(`data/${title}`, `utf8`, function (err, data) {
      if (title === undefined) {
        title = "Welcome";
        data = `"Hello Node.js"`
      }
      fs.readdir(`./data`, (err, fileName) => {
        let fileList = '';
        for (i = 0; i < fileName.length; i++) {
          fileList = fileList + `<li><a href = '/?id=${fileName[i]}'>${fileName[i]}</a></li>`
        }
        createTemplet(title, data, fileList);
        response.end(templete); 
      });
    })

  } else if (pathName === '/create') {
    title = "Create";
    data = `
    <form action="http://localhost:3000/create_process" method="POST">
    <p><input type="text" name="title" id="" placeholder="title" ></p>
    <p><textarea name="content" id="" cols="30" rows="10" placeholder="여기"></textarea></p>
    <p><input type="submit" value="submit"></p>
    </form>
        `

    fs.readdir(`./data`, (err, fileName) => {
      let fileList = '';
      for (i = 0; i < fileName.length; i++) {
        fileList = fileList + `<li><a href = '/?id=${fileName[i]}'>${fileName[i]}</a></li>`
      }
      createTemplet(title, data, fileList);
    });
  } else if (pathName === '/create_process') {
    var body = '';
    request.on('data', function (data) {
      body += data;
    })
    let title = '';
    let content = '';

    request.on('end', function () {
      const post = qs.parse(body);
      title = post.title;
      content = post.content;

      
      fs.writeFile(`data/${title}`, `${content}`, function (err) {
        response.writeHead(302,{Location : `/?id=${title}`});
        response.end(`title : ${title} // content : ${content}`);
        console.log(err);
      })

    })
  }

  else {
    response.writeHead(404);
    response.end('Not found');
  }

});


app.listen(3000);