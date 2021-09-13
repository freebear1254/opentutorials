const { logger } = require('./config/winston')
const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const url = require('url');
const path = require('path');
const tem = require('./modules/template');
const port = 3000;

const mysql = require('mysql');
const connection = mysql.createConnection({
    host :'localhost',
    user: 'nodejs',
    password : 'sks1254',
    database: 'nodejs'
});

connection.connect();


const app = http.createServer(function (request, response) {
    const requestUrl = request.url;
    const queryData = url.parse(requestUrl, true).query;
    const pathName = url.parse(requestUrl, true).pathname;
    let title = queryData.id;    
    const dataFolder = './data';

    fs.readdir(dataFolder, function (err, fileList) {
        let linkOption = 'linkOption';
        list = tem.setList(fileList);
        if (pathName === '/') {
            if (title === undefined) {
                title = "Welcome";
                description = 'hello welcome';
                linkOption = 'create';
                template = tem.setTemplate(title, list, description, linkOption);
                response.writeHead(200);
                response.end(template);
            } else {
                parserPath = path.parse(queryData.id).base;
                fs.readFile(`data/${parserPath}`, 'utf-8', function (err, description) {
                    linkOption = 'update'
                    template = tem.setTemplate(title, list, description, linkOption);
                    response.writeHead(200);
                    response.end(template);
                })
            }

        } else if (pathName === '/create') {
            if (request.method === 'GET') {
                title = 'create';
                description = `
                <div>
                <form action="/create" method="post" >
                    <input type="text" name="title" id="" placeholder = "title"></br>
                    <textarea name="content" id="" cols="30" rows="10" placeholder ="content"></textarea>
                    <input type="submit" value="submit">
                </form>    
                </div>
                `;

                template = tem.setTemplate(title, list, description, linkOption)
                response.writeHead(200);
                response.end(template);
            } else if (request.method === 'POST') {

                let body = '';

                request.on('data', function (data) {
                    body += data;
                });
                request.on('end', function () {
                    const post = qs.parse(body);
                    logger.info(`post.title = ${post.title}`);

                    const title = post.title;
                    const content = post.content;
                    const senitizeContent = content.replace(/</g,"&lt;").replace(/>/g,"&gt;");
                    fs.writeFile(`data/${title}`, senitizeContent, 'utf-8', function (err) {
                        response.writeHead(302, { Location: `/?id=${title}` });
                        response.end("success");
                    })
                });
            }
        } else if (pathName === '/update') {

            if (request.method === 'GET') {
                parserPath = path.parse(queryData.id).base;
                fs.readFile(`data/${parserPath}`, 'utf-8', function (err, fileData) {
                    description = `
                    <div>
                    <form action="/update?id=${title}"  method="post" >
                        <input type="text" name="title" id="" placeholder = "${title}" value ="${title}"></br>
                        <textarea name="content" id="" cols="30" rows="10" placeholder ="${fileData}">${fileData}</textarea>
                        <input type="submit" value="submit">
                    </form>    
                    </div>
                    `;
                    template = tem.setTemplate(title, list, description, linkOption)
                    response.writeHead(200);
                    response.end(template);
                })
            } else if (request.method === 'POST') {
                let body = '';
                request.on('data', function (data) {
                    body += data;
                });
                request.on('end', function () {
                    const post = qs.parse(body);
                    logger.info(`post.title = ${post.title}`);

                    const newTitle = post.title;
                    const content = post.content;
                    const senitizeContent = content.replace(/</g,"&lt;").replace(/>/g,"&gt;");
                    fs.rename(`data/${title}`, `data/${newTitle}`, function () {
                        fs.writeFile(`data/${newTitle}`, senitizeContent, 'utf-8', function (err) {
                            response.writeHead(302, { Location: `/?id=${title}` });
                            response.end("success");
                        })
                    })

                });
            }
        } else if (pathName === '/delete') {
            parserPath = path.parse(queryData.id).base;
            fs.unlink(`data/${parserPath}`, function (err) {
                logger.info(`delete file : ${title}`);
                response.writeHead(302, { Location: `/` });
                response.end("delete Success");
            })
        }
        else {
            response.writeHead(404);
            response.end("Not Found");
        }
    })
});

app.listen

app.listen(port, () => {
    logger.info(`app listening at localhost:${port}`);

});