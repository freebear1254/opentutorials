var qs = require('querystring');
var connection = require(`./db`);
var session = require('express-session');
const item = require(`./templeteE.js`);
let author = '';
const login = ''


exports.login = function (request, response) {
    control = `<a href = "/page/create">create</a> `;
    var sql = `SELECT * FROM topic`;
    connection.query(sql, (err, results) => {
        if (err) { throw err }

        title = 'Welcome';
        data = `
        <form action="/user/login_process" method="post">
    <div>
        <label>Username:</label>
        <input type="text" name="username"/>
    </div>
    <div>
        <label>Password:</label>
        <input type="password" name="password"/>
    </div>
    <div>
        <input type="submit" value="Log In"/>
    </div>
</form>
        `;
        var list = item.list(results);
        var html = item.createTemplet(title, data, list, control, author, login);
        response.send(html);
    });
};


/*
exports.process = function (request, response) {
    var body = ``;
    request.on('data', function (data) {
        body += data;
    });
    request.on('end', function () {
        post = qs.parse(body);

        const name = post.username;
        const password = post.password;
        let loginResult = '';

        sql = `SELECT * FROM author WHERE name =? `;
        connection.query(sql, [name], function (err, results) {

            if (err) {
                console.log(err);
            }
            else if (results[0] === undefined) {
                loginResult = `<script>
                    alert('No iD');
                    location.href='/login' ;
                </script>`
                response.writeHead(200);
                response.end(loginResult);
            } else if (results[0].password !== password) {
                loginResult = `<script>
                alert('wrong password');
                location.href='/login' ;
                 </script>`
                response.writeHead(200);
                response.end(loginResult);
            } else {
                const id = results[0].id;
                console.log(results[0].id, name, password)
                loginResult = `
                <script>
                    alert('Hello ${name}');
                    location.href='/' ;
                </script>                
                `;
                request.session.idName = id;
                request.session.name = name;
                request.session.password = password;
                request.session.save(function () {
                    response.redirect('/');
                });
            }
        });
    });
}
*/
exports.logout = function (request, response) {
    // request.session.destroy(function () {
    //     response.redirect(`/login`);
    // });
    // response.clearCookie(`id`);
    // response.clearCookie(`name`);
    // response.clearCookie(`password`);

    // request.logout();
    // request.session.destroy(function () {
    //     response.redirect(`/login`);
    // });
    request.logout();
    request.session.save(function(){
        response.redirect(`/user/login`);
    })
 
}