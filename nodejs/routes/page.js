const express = require('express');
const router = express.Router();
const topic = require(`../lib/topicE`);


router.get(`/create`, (request, response) => {
    topic.create(request, response);
  });
  router.post(`/create_process`, (request, response) => {
    topic.create_process(request, response);
  });
  router.get(`/update/:pageId`, (request, response) => {
    const pageId = request.params.pageId;
    topic.update(request, response, pageId);
  });
  router.post(`/update_process`, (request, response) => {
    topic.update_process(request, response);
  });
  router.post(`/delete_process`, (request, response) => {
    topic.delete_process(request, response);
  });
  router.get('/:pageId', (request, response) => {
    const pageId = request.params.pageId;
    topic.page(request, response, pageId);
  });

 module.exports = router;