const connection = require(`./db`);

module.exports = function(app) {
    var passport = require('passport')
        , LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());


    passport.serializeUser(function (user, done) {
        console.log('seriaizeUser ', user);
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        //console.log(`deserializeUser`, id);
        var userInfo;
        sql = `SELECT * FROM author WHERE id =? `;
        connection.query(sql, [id], function (err, result) {
            if (err) {
                throw err
            }
            var json = JSON.stringify(result[0]);
            userInfo = JSON.parse(json);
            done(null, userInfo);

            //console.log(`deserializeUser`, userInfo);
        });
    });

    passport.use(new LocalStrategy(
        function (username, password, done) {
            console.log(username, password);

            sql = `SELECT * FROM author WHERE name =? `;

            connection.query(sql, [username], function (err, results) {

                if (err) {
                    return done(err);
                }
                else if (results.length === 0) {
                    console.log("have no user");
                    return done(null, false, { message: 'Incorrect username.' });
                } else if (results[0].password !== password) {
                    console.log("wrong password")
                    return done(null, false, { message: 'Incorrect password.' });
                } else {
                    console.log(results);
                    var json = JSON.stringify(results[0]);
                    var userinfo = JSON.parse(json);
                    //console.log("userinfo " + userinfo);
                    return done(null, userinfo);
                }
            });

        }
    ));
return passport;
}
