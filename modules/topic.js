const { logger } = require('../config/winston')
const url = require('url');
const tem = require('./template');
const db = require('./mysql');


let title = '';
let description = '';
let list = '';
let linkOption = "linkOption";
let template = '';



const cookie = require('cookie');
let cookies;
function isLogin(request) {
    if (request.headers.cookie !== undefined) {
        cookies = cookie.parse(request.headers.cookie);
        return cookies;
    } else {
        return null;
    }
}

exports.mainPage = function (request, response) {
    linkOption = "linkOption";
    user = isLogin(request);
    const requestUrl = request.url;
    const queryData = url.parse(requestUrl, true).query;
    if (queryData.id === undefined) {
        title = "Welcome";
        description = 'hello welcome';
        if (user !== null) {
            linkOption = 'create';
        }
        list = '';
        id = '';

        db.query("SELECT * FROM topic", function (err, topics) {
            if (err) {
                logger.error(err);
                throw err;
            } else {
                list = tem.setList(topics);
                template = tem.setTemplate(id, user, title, list, description, linkOption);
                response.writeHead(200);
                response.end(template);
            }
        })
    } else {
        id = queryData.id;

        db.query("SELECT * FROM topic", function (err, topics) {
            list = tem.setList(topics);
            db.query("select * from topic where id = ?", [id], function (err, result) {
                if (err) { throw err }
                else {
                    title = result[0].title;
                    if (result[0].description !== null) {
                        description = result[0].description;
                    } else {
                        description = '내용이 없는 글입니다. ';
                    }

                    if (result[0].author_id === parseInt(user.userId)) {
                        linkOption = 'update';
                    }

                    template = tem.setTemplate(id, user, title, list, description, linkOption);
                    response.writeHead(200);
                    response.end(template);
                }

            })
        })

    }
}
exports.create = function (request, response) {
    user = isLogin(request);
    if (request.method === 'GET') {
        title = 'create';
        description = `
        <div>
        <form action="/topic/create" method="post" >
            <input type="text" name="title" id="" placeholder = "title"></br>
            <textarea name="content" id="" cols="30" rows="10" placeholder ="content"></textarea>
            <input type="submit" value="submit">
        </form>    
        </div>
        `;

        template = tem.setTemplate(id, user, title, list, description, linkOption)
        response.writeHead(200);
        response.end(template);
    }
    else if (request.method === 'POST') {

        const post = request.body;
        logger.info(`post.title = ${post.title}`);
        logger.info(`post.title = ${post.content}`);

        let senitizerContent = '';
        const title = post.title;

        const content = post.content;
        if (content !== null) {
            senitizerContent = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }
        db.query("INSERT INTO topic(title,description,created,author_id) values(?,?,now(),?)", [title, senitizerContent,user.userId],
            function (err, result) {
                if (err) {
                    logger.error(err);
                    throw err;
                } else {
                    response.writeHead(302, { Location: `/topic/?id=${result.insertId}` });
                    response.end("post create");
                }

            })

    }
}
exports.update = function (request, response) {
    user = isLogin(request);
    const requestUrl = request.url;
    const queryData = url.parse(requestUrl, true).query;
    if (request.method === 'GET') {
        id = queryData.id;
        db.query("SELECT * FROM topic WHERE id = ?", [id], function (err, result) {
            if (err) {
                logger.error(err);
                throw err;
            }
            title = result[0].title;
            content = result[0].description;

            description = `
                <div>
                <form action="/topic/update"  method="post" >
                    <input type="hidden" name="id" value ="${id}">
                    <input type="text" name="title" id="" placeholder = "${title}" value ="${title}"></br>
                    <textarea name="content" id="" cols="30" rows="10" placeholder ="${content}">${content}</textarea>
                    <input type="submit" value="submit">
                </form>    
                </div>
                `;

            template = tem.setTemplate(id, user, title, list, description, linkOption);
            response.writeHead(200);
            response.end(template);
        })
    } else if (request.method === "POST") {
        const post = request.body;

        let senitizerContent = '';
        const id = post.id;
        const title = post.title;
        const content = post.content;
        if (content !== null) {
            senitizerContent = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }
        db.query(`UPDATE topic SET title =?,description = ? WHERE id = ?`
            , [title, senitizerContent, id]
            , function (err, result) {
                if (err) {
                    logger.error(err);
                    throw err;
                }
                response.writeHead(302, { Location: `/topic/?id=${id}` });
                response.end("update create");
            })

    }
}
exports.delete = function (request, response) {
    const post = request.body;
    const id = post.id;

    db.query("DELETE FROM topic WHERE id =?", [id], function (err, result) {
        response.writeHead(302, { Location: `/topic` });
        response.end(id);
    });
}

exports.login = function (request, response) {

    const post = request.body;
    const email = post.email;
    const password = post.password;

    const NoUser = `<script  charset="utf-8">
        alert("일치하는 아이디가 없습니다.");
        window.history.back();
    </script>`;

    const NoPass = `<script  charset="utf-8">
        alert("패스워드가 일치하지 않습니다");
        window.history.back();
    </script>`;

    db.query("SELECT * FROM user WHERE email = ?", [email], function (err, user) {
        logger.info(`user ID :${user[0].id}`);
        if (err) {
            logger.error(err);
            throw err;
        } else {
            if (user[0].id === undefined) {
                response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                response.end(NoUser);
            } else if (user[0].password !== password) {
                response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                response.end(NoPass);
            } else if (user[0].password === password) {
                response.writeHead(302, {
                    Location: '/topic',
                    'set-cookie': [
                        `email=${email}`,
                        `userId=${user[0].id}`
                    ]
                });
                response.end("로그인 성공");
            }
        }

    })
}
exports.logOut = function (request, response) {
    response.writeHead(302, {
        Location: '/topic',
        'set-cookie': [
            'userId=; Max-Age =0',
            'email=; Max-Age =0'
        ]
    });
    response.end("logOut");
}