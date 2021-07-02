const express = require('express');
const app = express();
const port = 3000;


const bodyParser = require('body-parser')
const session = require('express-session');
const FileStore = require('session-file-store')(session);

//const helmet =require('helmet');
const cookieParser = require('cookie-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

var passport = require(`./lib/passport`)(app); 


const pageRouter = require(`./routes/page`);
const indexRouter = require(`./routes/index`);
const authorRouter = require(`./routes/author`);
const userRouter =require(`./routes/user`)(passport);


app.use(`/`,indexRouter);
app.use(`/page`,pageRouter);
app.use(`/author`, authorRouter);
app.use(`/user`,userRouter);



app.use(function (req, res, next) {
  var script = `
  <script>
  alert("We can't found it");
location.href ='/';
</script>
  `
  res.status(404).send(script);
});

app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.status(500).send('Something Wrong!!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
