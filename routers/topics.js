const express = require('express');
const app = express();
const router = express.Router();
// const session = require('express-session');
// const FileStore = require('session-file-store')(session);

const db = require('../modules/mysql');
const topic = require('../modules/topic');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
const urlencodedParser = bodyParser.urlencoded({ extended: false })



db.connect();

router.get('/', (request, response) => {
    topic.mainPage(request, response)
});

router.all('/create', urlencodedParser, (request, response) => {
    topic.create(request, response)
});

router.all('/update', urlencodedParser, (request, response) => {
    topic.update(request, response)
});

router.all('/delete', urlencodedParser, (request, response) => {
    topic.delete(request, response)
});
// router.post('/login', urlencodedParser, (request, response) => { 
//     topic.login(request, response);
// });
router.post('/login',topic.login);

router.all('/logout', (request, response) => {
    topic.logOut(request, response );
})


module.exports = router;