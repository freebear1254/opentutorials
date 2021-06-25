const express = require('express')
const app = express()
const port = 3000
const topic = require(`./lib/topicE`);
const author = require(`./lib/authorE`);

app.get(`/`, (request, response) => {
  topic.home(request, response);
});
app.get('/page/:pageId', (request, response) => {
  const pageId = request.params.pageId;
  topic.page(request, response, pageId);
})
app.get(`/create`, (request, response) => {
  topic.create(request, response);
});
app.post(`/create_process`, (request, response) => {
  topic.create_process(request, response);
});
app.get(`/update/:pageId`, (request, response) => {
  const pageId = request.params.pageId;
  topic.update(request, response, pageId);
});
app.post(`/update_process`, (request, response) => {
  topic.update_process(request, response);
});
app.post(`/delete_process`, (request, response) => {
  topic.delete_process(request, response);
});



app.get(`/author`, (request, response) => {
  author.author(request, response);
});
app.get(`/update_author/:authorId`, (request, response) => {
  const authorId = request.params.authorId;
  author.update(request, response, authorId);
})
app.post(`/author_update_process`, (request, response) => {
  author.update_process(request, response);
})
app.get(`/create_author`, (request, response) => {
  author.create(request, response);
});
app.post(`/author_create_process`, (request, response) => {
  author.create_process(request, response);
});
app.post(`/delete_author`, (request, response) => {
  author.delete(request, response);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


/*
var http = require('http');
var url = require('url');
const topic = require(`./lib/topic`);
const author = require(`./lib/author`);

var app = http.createServer(function (request, response) {
  const _url = request.url;
  const pathName = url.parse(_url, true).pathname;

  if (pathName === '/') {
    topic.page(request, response);
  } else if (pathName === '/create') {
    topic.create(request, response);
  } else if (pathName === '/create_process') {
    topic.create_process(request, response);
  } else if (pathName === '/update') {
    topic.update(request, response);
  } else if (pathName === '/update_process') {
    topic.update_process(request, response);
  } else if (pathName === '/delete_process') {
    topic.delete_process(request, response);
  }

  else if (pathName === '/author') {
    author.author(request, response)
  } else if (pathName === '/update_author') {
    author.update(request, response)
  } else if (pathName === '/author_update_process') {
    author.update_process(request, response)
  } else if (pathName === '/create_author') {
    author.create(request, response);
  } else if (pathName === `/author_create_process`) {
    author.create_process(request, response);
  } else if (pathName === '/delete_author') {
    author.delete(request, response);
  }

  else {
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);
*/