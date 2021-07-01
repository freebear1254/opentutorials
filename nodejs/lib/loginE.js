var qs = require('querystring');
var connection = require(`./db`);
var session = require('express-session');
const item = require(`./templeteE.js`);
let author = '';
const login =''

exports.login = function (request, response) {
  
    control = `<a href = "/create">create</a> `;
    var sql = `SELECT * FROM topic`;
    connection.query(sql, (err, results) => {
        if (err) { throw err }

        title = 'Welcome';
        data = `
        <form action="/login_process" method="POST">
        <input type="text" name="name" placeholder="id" value ="">
        <input type="password" name="password" placeholder="password" value ="">
        
        <input type="submit" value="Login">
      </form>
        `;

        var list = item.list(results);
        var html = item.createTemplet(title, data, list, control, author, login);
        response.send(html);
    });
};

exports.process = function (request, response) {
    var body = ``;
    request.on('data', function (data) {
        body += data;
    });
    request.on('end', function () {
        post = qs.parse(body);
        
        const name = post.name;
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
                response.end(loginResult);
                response.writeHead(200);
            } else if (results[0].password !== password) {
                loginResult = `<script>
                alert('wrong password');
                location.href='/login' ;
                 </script>`
                response.end(loginResult);
                response.writeHead(200)
            } else {
                const id = results[0].id;
                console.log(results[0].id,name,password)
                loginResult = `
                <script>
                    alert('Hello ${name}');
                    location.href='/' ;
                </script>                
                `;                                               
                request.session.idName = id;
                request.session.name = name;
                request.session.password = password;
                response.redirect('/');

            }
        });
    });
}
exports.logout= function(request,response){
    request.session.destroy(function(){
        response.redirect(`/login`);
    });
    // response.clearCookie(`id`);
    // response.clearCookie(`name`);
    // response.clearCookie(`password`);
}