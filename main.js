const { logger } = require('./config/winston')
const http = require('http');
const fs = require('fs');
const qs = require('querystring');

const url = require('url');

const tem = require('./modules/template');
const port = 3000;



const app = http.createServer(function (request, response) {
    const requestUrl = request.url;

    const queryData = url.parse(requestUrl, true).query;
    //console.log(url.parse(requestUrl, true));
    const pathName = url.parse(requestUrl, true).pathname;
    let title = queryData.id;
    const dataFolder = './data';


    fs.readdir(dataFolder, function (err, fileList) {
        let linkOption ='linkOption';
        list =tem.setList(fileList);
        if (pathName === '/') {
            if (title === undefined) {
                title = "Welcome";
                description = 'hello welcome';
                linkOption = 'create';
                template = tem.setTemplate(title, list, description,linkOption);
                response.writeHead(200);
                response.end(template);
            } else {
                fs.readFile(`data/${title}`, 'utf-8', function (err, description) {
                    linkOption='update'
                    template = tem.setTemplate(title, list, description,linkOption);
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

                template = tem.setTemplate(title, list, description,linkOption)
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
                    fs.writeFile(`data/${title}`, content, 'utf-8', function (err) {
                        response.writeHead(302, { Location: `/?id=${title}` });
                        response.end("success");
                    })
                });
            }
        } else if (pathName === '/update') {
            
            if (request.method === 'GET') {
                fs.readFile(`data/${title}`, 'utf-8', function (err, fileData) {
                    description = `
                    <div>
                    <form action="/update?id=${title}"  method="post" >
                        <input type="text" name="title" id="" placeholder = "${title}" value ="${title}"></br>
                        <textarea name="content" id="" cols="30" rows="10" placeholder ="${fileData}">${fileData}</textarea>
                        <input type="submit" value="submit">
                    </form>    
                    </div>
                    `;
                    template = tem.setTemplate(title, list, description,linkOption)
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

                    fs.rename(`data/${title}`,`data/${newTitle}`,function(){
                        fs.writeFile(`data/${newTitle}`, content, 'utf-8', function (err) {
                            response.writeHead(302, { Location: `/?id=${title}` });
                            response.end("success");
                        })
                    })
                   
                });
            }
        }else if(pathName === '/delete'){
            fs.unlink(`data/${title}`,function(err){
                logger.info(`delete file : ${title}`);
                response.writeHead(302,{Location:`/`});
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