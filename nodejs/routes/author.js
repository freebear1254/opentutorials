const express = require('express');
const router = express.Router();
const author = require(`../lib/authorE`);

router.get(``, (request, response) => {
    author.author(request, response);
});
router.get(`/update/:authorId`, (request, response) => {
    const authorId = request.params.authorId;
    author.update(request, response, authorId);
})
router.post(`/update_process`, (request, response) => {
    author.update_process(request, response);
})
router.get(`/create`, (request, response) => {
    author.create(request, response);
});
router.post(`/create_process`, (request, response) => {
    author.create_process(request, response);
});
router.post(`/delete`, (request, response) => {
    author.delete(request, response);
});

module.exports = router;