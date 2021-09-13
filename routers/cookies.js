const express = require('express');
const router = express.Router();
const cookie = require('cookie');
const { logger } = require('../config/winston');

router.get('/',(request,response)=>{
    let cookies ;
    if (request.headers.cookie !== undefined){
        cookies = cookie.parse(request.headers.cookie);
        logger.info(`yummy_cookie = ${cookies.yummy_cookie}`);
        logger.info(`tasty_cookie = ${cookies.tasty_cookie}`);
    }
    response.writeHead(200, {
        'set-cookie':[
            'yummy_cookie=choco',
            'tasty_cookie=strawberry',
            `permanent = cookies; Max-Age = ${60*60*24*30}`,
            'Secure = secure; secure',
            'HttpOnly=HttpOnly; HttpOnly',
            'path=path; path=/cookie',
            'Domain=Domain; Domain=o2.org'
        ]
    });
    
    response.end('cookies');    
});

module.exports = router;
