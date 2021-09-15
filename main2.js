const { logger } = require('./config/winston')
const port = 3000;
const express = require('express');
const app = express();
var session = require('express-session');
const FileStore = require('session-file-store')(session);
//const bodyParser = require('body-parser');
//app.use(bodyParser.urlencoded({ extended: false }));

// const db = require('./modules/mysql');
// const topic = require('./modules/topic');
//db.connect();

app.use(session({
    HttpOnly: true,
    secure: true,
    secret: 'keyboard cat',//secret 옵션
    resave: false,//session 값이 바뀌면 저장
    saveUninitialized: true,//session 이 필요하기 전까지 구동하지 않는다.
    //store: new FileStore() //session 저장방법Compatible Session Stores
}));


// var flash=require("connect-flash");
// app.use(flash());

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
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end("없는 페이지 입니다.")
})


app.listen(port, () => {
    logger.info(`app listening at localhost:${port}`);
});