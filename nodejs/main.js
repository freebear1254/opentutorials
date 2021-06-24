var http = require('http');
var url = require('url');
const topic = require(`./lib/topic`);

var app = http.createServer(function (request, response) {
  const _url = request.url;
  const pathName = url.parse(_url, true).pathname;

  if (pathName === '/') {
    topic.page(request, response);
  }
  else if (pathName === '/create') {
    topic.create(request, response);
  }
  else if (pathName === '/create_process') {
    topic.create_process(request, response);
  }
  else if (pathName === '/update') {
    topic.update(request, response);
  } else if (pathName === '/update_process') {
    topic.update_process(request, response);
  }
  else if (pathName === '/delete_process') {
    topic.delete_process(request, response);
  }
  else {
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);