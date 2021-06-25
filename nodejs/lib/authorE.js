var qs = require('querystring');
var connection = require(`./db`);
const item = require(`./templeteE.js`);
let form = ``;
let list = ``;


exports.author = function (request, response ,next) {
    sql = `SELECT * FROM author`;
    connection.query(sql, function (err, results) {
        if (err) {
            next(err);
        }
        form = `<a href = "/create_author">CREATE AUTHOR</a>`
        var list = item.authorList(results);
        var html = item.authorTemplete(list, form);

        response.writeHead(200);
        response.end(html);
    })
}

exports.update = function (request, response, authorId ,next) {
    sql = `SELECT * FROM author`;
    connection.query(sql, function (err, results) {
        if (err) {
            next(err);
        }
        sql = `SELECT * FROM author WHERE id = ?`
        connection.query(sql, [authorId], function (err2, author) {
            if (err2) {
                next(err2);
            }
            form = `
            <form action="/author_update_process" method="POST">
            <input type="hidden" name="id"  value ="${authorId}"></br>
            <input type="text" name="name" placeholder="${author[0].name}"  value ="${author[0].name}"></br>
            <textarea name="profile" vlaue ="${author[0].profile}" >${author[0].profile}</textarea></br>
            <input type="submit" value="update">
            </form>            
            `;
            var list = item.authorList(results);
            var html = item.authorTemplete(list, form);
            response.send(html);
        })
    })
}
exports.update_process = function (request, response , next) {
    var body = ``;
    request.on(`data`, function (data) {
        body += data;
    });
    request.on(`end`, function () {
        post = qs.parse(body);
        var id = post.id;
        var name = post.name;
        var profile = post.profile;

        sql = `update author SET name =?, profile= ? WHERE id = ? `
        connection.query(sql, [name, profile, id], function (err, results) {
            if (err) {
                next(err);
            }
            response.redirect(`/author`);
        });
    });
}
exports.create = function (requset, response) {
    form = `
    <form action="/author_create_process" method="POST">
    <input type="text" name="name" placeholder="name" value =""></br></br>
    <textarea name="profile" placeholder="profile" ></textarea></br>
    <input type="submit" value="Create">
  </form>
    `;
    var html = item.authorTemplete(list, form);
    response.send(html);
}

exports.create_process = function (request, response , next) {
    var body = ``;
    request.on(`data`, function (data) {
        body += data;
    })
    request.on(`end`, function () {
        post = qs.parse(body);
        var name = post.name;
        var profile = post.profile;

        sql = `INSERT INTO author (name,profile) VALUES (?,?)`
        connection.query(sql, [name, profile], function (err, results) {
            if (err) { next(err); }
            response.redirect(`/author`);
        });
    });
}
exports.delete = function (request, response , next) {
    var body = '';
    request.on(`data`, function (data) {
        body += data;
    });
    request.on(`end`, function () {
        post = qs.parse(body);
        var id = post.id;

        sql = `DELETE FROM author WHERE id =?`;
        connection.query(sql, [id], function (err, results) {
            if (err) { next(err); }
            response.redirect(`/author`);
        });
    })
}