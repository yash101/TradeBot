require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const Configuration = require('./configuration');

const indexRouter = require('./routes/index');

const TdAmeritrade = require('./Sources/tdameritrade');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/authenticators/amtd', TdAmeritrade.Router);

module.exports = app;
