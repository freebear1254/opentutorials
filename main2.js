const { logger } = require('./config/winston')
const port = 3000;
const express = require('express');
const app = express();
//const bodyParser = require('body-parser');
//app.use(bodyParser.urlencoded({ extended: false }));

// const db = require('./modules/mysql');
// const topic = require('./modules/topic');
//db.connect();

const topicRouter = require('./routers/topics');
const cookie = require('./routers/cookies')

// app.get('/topic',(request,response)=>{
//     topic.mainPage(request,response)
// });

// app.all('/topic/create',(request,response)=>{
//     topic.create(request,response)
// });

// app.all('/topic/update',(request,response)=>{
//     topic.update(request,response)
// });

// app.all('/topic/delete',(request,response)=>{
//     topic.delete(request,response)
// });

app.use('/topic',topicRouter);
app.use('/cookie',cookie);

app.use((request,response)=>{
    response.status(404).send('Sorry cant find that');
})


// const app = http.createServer(function (request, response) {
//     const requestUrl = request.url;
//     const pathName = url.parse(requestUrl, true).pathname;

//     if (pathName === '/') {
//         topic.mainPage(request,response);
//     } else if (pathName === '/create') {
//         topic.create(request,response);
//     } else if (pathName === '/update') {
//         topic.update(request,response)
//     } else if (pathName === '/delete') {
//         topic.delete(request,response)
//     }
//     else {
//         response.writeHead(404);
//         response.end("Not found");
//     }
// }
// );
app.listen(port, () => {
    logger.info(`app listening at localhost:${port}`);

});