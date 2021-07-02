const express = require('express');
const port = 3000;
const app = express();
app.use(express.json())

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
