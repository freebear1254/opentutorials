const url = require('url');
const qs = require('querystring');

const connection = require(`./db`);
const item = require(`./templeteE.js`);
let author = ``;
let control = '';
let isUser = false;

function getUserName(request, response) {
    const rs = request.user;
    console.log(rs);
    if (rs) {
        login = `Hello ${rs.name} 
         <a href = "/user/logout">Logout</a>
       ` ;
        isUser = true;
    } else {
        login = `<a href="/user/login">Login</a>`;
        isUser = false;
    }
    return rs;
}    // const rs = request.cookies;
// if (rs.name) {
//     login = `Hello ${rs.name} 
//     <a href = "/logout">Logout</a>
//     ` ;
//     isUser = true;
// } else {
//     login = `<a href="/login">Login</a>`;
//     isUser = false;
// }
// return rs;

exports.home = function (request, response) {
    getUserName(request, response);
    author = ``;
    control = `<a href = "/page/create">create</a> `;
    var sql = `SELECT * FROM topic`;
    connection.query(sql, (err, results) => {
        if (err) { throw err }
        title = 'Welcome';
        data = 'Hello World Welcome';
        var list = item.list(results);
        var html = item.createTemplet(title, data, list, control, author, login);
        response.send(html);
    });
}
exports.page = function (request, response, pageId) {
    const rs = getUserName(request, response);
    control = '';
    const update = `
    <a href = "/page/update/${pageId}">update</a> 
    <form action="/page/delete_process" method="POST">
      <input type="hidden" name="id" value ="${pageId}">
      <input type="submit"  value ="delete">   
  </form>
    `;
    var sql = `SELECT * FROM topic`;
    connection.query(sql, function (err, results) {
        if (err) {
            throw err;
        }
        else {
            sql = 'SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id  WHERE topic.id=?'
            connection.query(sql, [pageId], function (err2, topic) {
                if (err2) {
                    throw err2;
                }
                else {
                    if (topic[0] === undefined) {
                        var script = `
                        <script>
                            alert("We can't found it");
                            location.href ='/';
                        </script>
                        `;
                        response.status(404).send(script);
                    } else {
                        title = topic[0].title;
                        data = topic[0].description;
                        author = `..by ${topic[0].name}`;
                        author_id = topic[0].author_id;

                        if (rs) {
                            if (rs.id === author_id) {
                                control = update;
                            }
                        } 
                        var list = item.list(results);
                        var html = item.createTemplet(title, data, list, control, author, login);
                        response.send(html);

                    }

                }

            });

        }
    })
}
exports.create = function (request, response) {
    const rs = getUserName(request, response);
    if (isUser) {
        title = "Create";
        data = `
    <form action="/page/create_process" method="POST">
    <input type ="hidden" name="author_id" value ="${rs.id}">
    <p><input type="text" name="title"  placeholder="title" ></p>
    <p><textarea name="content" cols="30" rows="10" placeholder="여기"></textarea></p>
    <p><input type="submit" value="submit"></p>
    </form>
    `;
        var sql = `SELECT * FROM topic`;
        connection.query(sql, function (err, results) {
            var list = item.list(results);
            var html = item.createTemplet(title, data, list, control, author, login);
            response.send(html);
        });
    } else {
        response.writeHead(200);
        response.end(`<script>alert('Login Please');
        location.href = "/login";
        </script>`);
    }

}
exports.create_process = function (request, response) {    
    const body = request.body;   
        author_id = body.author_id;
        title = body.title;
        content = body.content;

        sql = `INSERT INTO topic (title,description,created,author_id) VALUES (?,?,now(),?)`
        connection.query(sql, [title, content, author_id], function (err, results) {
            if (err) {
                throw err;
            }
            response.redirect(`/page/${results.insertId}`);
        });    
}
exports.update = function (request, response, pageId) {
    getUserName(request, response);
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    let author = ``;
    control = '';
    sql = `SELECT * FROM topic`;
    connection.query(sql, function (error, topics) {
        if (error) { throw error }
        sql = `SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id  WHERE topic.id=?`;
        connection.query(sql, [pageId], function (err, results) {
            if (err) {
                throw err;
            }
            var description = results[0].description;
            var title = results[0].title;
            author = results[0].name;
            data = `
    <form action="/page/update_process" method="POST">
    <p><input type="hidden" name="id" id="" value="${pageId}" ></p>
    <p><input type="text" name="title" id="" placeholder="${title}" value ="${title}"></p>
    <p><textarea name="content" id="" cols="30" rows="10" placeholder="${description}" value="${description}">${description}</textarea></p>
    <p><input type="submit" value="submit"></p>
    </form>`
            var list = item.list(topics);
            var html = item.createTemplet(title, data, list, control, author, login);
            response.send(html);
        });
    });

}
exports.update_process = function (request, response) {
    const body = request.body;
        var id = body.id;
        var title = body.title;
        var content = body.content;

        sql = `UPDATE topic SET title = ?, description= ? WHERE id=? `;
        connection.query(sql, [title, content, id], function (err, results) {
            if (err) { throw err }
            response.redirect(`/page/${id}`);
        })
}
exports.delete_process = function (request, response) {
    const body = request.body;          
        var id = body.id;
        sql = `DELETE FROM topic WHERE id=?`;
        connection.query(sql, [id], function (err, results) {
            response.redirect(`/`);
        });
   
}