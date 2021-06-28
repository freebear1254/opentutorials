const http = require('http');
const cookie = require(`cookie`);
http.createServer(function(req,res){
    const rc = req.headers.cookie;
    let cookies = {};
    if(rc !== undefined){
        cookies = cookie.parse(rc);
    };    
    res.writeHead(200,{
     'Set-cookie':[
         `yummy_cookie=choco`,
         `tasty_cookie=strawberry`,
        `Permanent=cookies; Max-Age= ${60}`,
        `Secure = Secure; Secure`
    ]   
    });

    res.end(rc);
}).listen(3000);