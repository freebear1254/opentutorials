const express = require('express');
const router = express.Router();
const login = require('../lib/loginE'); 

module.exports = function(passport){
    router.get(`/login`, (request, response) => {
        login.login(request, response);
      });
      router.post('/login_process',
          passport.authenticate('local', {
          //successRedirect: '/',
          failureRedirect: '/login',
          function(request,response){
            request.session.save(function(){
              response.redirect(`/`);
            })
          }
        })
      );
      router.get(`/logout`, (request, response) => {
        login.logout(request, response);
      })

      return router;
}
