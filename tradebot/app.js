require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const logger = require('morgan');

const pgPool = require('./components/database/postgres');
const config = require('./components/configuration/configuration');

const indexRouter = require('./components/webapi/index');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressSession({
  secret: config.get('session.secret', process.env.DEFAULT_SESSION_SECRET || 'secret'),
  resave: false,
  saveUninitialized: false,
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;
