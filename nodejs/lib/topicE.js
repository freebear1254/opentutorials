var url = require('url');
var qs = require('querystring');
var connection = require(`./db`);
const item = require(`./templeteE.js`);
let author = ``;
let control = '';

exports.home = function (request, response) {
    control = `<a href = "/create">create</a> `;
    var sql = `SELECT * FROM topic`;
    connection.query(sql, (err, results) => {
        if (err) { throw err }

        title = 'Welcome';
        data = 'Hello World Welcome';
        
        var list = item.list(results);
        var html = item.createTemplet(title, data, list, control, author);
        response.send(html);
    });
}
exports.page = function (request, response, pageId) {
    const update = `
    <a href = "/update/${pageId}">update</a> 
    <form action="/delete_process" method="POST">
      <input type="hidden" name="id" value ="${pageId}">
      <input type="submit"  value ="delete">   
  </form>
    `;
    control = update;
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
                    title = topic[0].title;
                    data = topic[0].description;
                    author =`..by ${topic[0].name}` ;
                }
                var list = item.list(results);
                var html = item.createTemplet(title, data, list, control, author);
                response.send(html)
            });

        }
    })
}
exports.create = function (request, response) {
    title = "Create";
    data = `
    <form action="/create_process" method="POST">
    <p><input type="text" name="title"  placeholder="title" ></p>
    <p><textarea name="content" cols="30" rows="10" placeholder="여기"></textarea></p>
    <p><input type="submit" value="submit"></p>
    </form>
    `;
    var sql = `SELECT * FROM topic`;
    connection.query(sql, function (err, results) {
        var list = item.list(results);
        var html = item.createTemplet(title, data, list, control,author);
        response.send(html);
    });
}
exports.create_process = function (request, response) {
    var body = '';
    request.on('data', function (data) {
        body += data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        title = post.title;
        content = post.content;

        sql = `INSERT INTO topic (title,description,created,author_id) VALUES (?,?,now(),?)`
        connection.query(sql, [title, content, 1], function (err, results) {
            if (err) {
                throw err;
            }
            response.writeHead(302, { location: `/?id=${results.insertId}` });
            response.end();
        })
    });
}
exports.update = function (request, response,pageId) {
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
    <form action="/update_process" method="POST">
    <p><input type="hidden" name="id" id="" value="${pageId}" ></p>
    <p><input type="text" name="title" id="" placeholder="${title}" value ="${title}"></p>
    <p><textarea name="content" id="" cols="30" rows="10" placeholder="${description}" value="${description}">${description}</textarea></p>
    <p><input type="submit" value="submit"></p>
    </form>`
            var list = item.list(topics);
            var html = item.createTemplet(title, data, list, control, author);
            response.send(html);
        });
    });

}
exports.update_process = function (request, response) {
    var body = '';
    request.on('data', function (data) {
        body += data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var content = post.content;

        sql = `UPDATE topic SET title = ?, description= ? WHERE id=? `;
        connection.query(sql, [title, content, id], function (err, results) {
            if (err) { throw err }
            response.writeHead(302, { location: `/?id=${id}` });
            response.end();
        })
    });
}
exports.delete_process = function (request, response) {
    var body = '';
    request.on('data', function (data) {
        body += data;
    })
    request.on('end', function () {
        post = qs.parse(body);
        var id = post.id;

        sql = `DELETE FROM topic WHERE id=?`;
        connection.query(sql, [id], function (err, results) {
            response.writeHead(302, { location: '/' });
            response.end();
        });
    })

}