var url = require('url');
var qs = require('querystring');
var connection = require(`./db`);
const item = require(`./templete.js`);
let form = ``;


exports.author = function (request, response) {
    sql = `SELECT * FROM author`;
    connection.query(sql, function (err, results) {
        if (err) {
            throw err;
        }
        var list = item.authorList(results);
        var html = item.authorTemplete(list, form);

        response.writeHead(200);
        response.end(html);
    })
}

exports.update = function (request, response) {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    let id = queryData.id;

    sql = `SELECT * FROM author`;
    connection.query(sql, function (err, results) {
        if (err) {
            throw err;
        }
        sql = `SELECT * FROM author WHERE id = ${id}`
        connection.query(sql, function (err2, author) {
            if (err2) {
                throw err2;
            }
            form = `
            <form action="/author_update_process" method="POST">
            <input type="hidden" name="id"  value ="${id}"></br>
            <input type="text" name="name" placeholder="${author[0].name}"  value ="${author[0].name}"></br>
            <textarea name="profile" vlaue ="${author[0].profile}" >${author[0].profile}</textarea></br>
            <input type="submit" value="update">
            </form>
            
            `;
            var list = item.authorList(results);
            var html = item.authorTemplete(list, form);
            response.writeHead(200);
            response.end(html);
        })
    })
}
exports.update_process = function (request, response) {
    var body = ``;
    request.on(`data`, function (data) {
        body += data;
    });
    request.on(`end`, function () {
        post = qs.parse(body);
        var id = post.id;
        var name = post.name;
        var profile = post.profile;

        sql = `update author name =?, profile= ? WHERE id = ? `
        connection.query(sql,[name,profile,id],function(err, results) {
            if (err) {
                throw err;
            }
            response.writeHead(302,{locattion : `/author`});
            response.end();
        });
    });


}