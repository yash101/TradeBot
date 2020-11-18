const express = require('express');
const expressSession = require('express-session');
const debug = require('debug')('tradebot:webapi');
const logger = require('morgan');
const http = require('http');
const passport = require('passport');
const crypto = require('crypto');

const config = require('../database/configuration');
const indexRouter = require('./index');
const apiAuth = require('./auth');

module.exports = (async () => {
  await config.ready;

  let app = express();

  app.use(logger('dev'));
  app.use((req, res, next) => {
    res.set({
      'Access-Control-Allow-Origin': req.get('Origin') || '*',
      'Access-Control-Allow-Headers': 'content-type',
      'Access-Control-Allow-Methods': 'GET,PUT,HEAD,PUT,PATCH,POST,DELETE',
      'Access-Control-Allow-Credentials': true,
    });

    if (req && req.method && req.method.toUpperCase && req.method.toUpperCase() === 'OPTIONS') {
      res.set({
        'Content-Length': 0,
      });

      res.statusCode = 204;
      return res.end();
    }

    next();
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(expressSession({
    secret: (await config.get('session.secret', crypto.randomBytes(64).toString('base64'))).val,
    resave: false,
    saveUninitialized: true,
  }));
  app.use(passport.initialize());
  app.use(passport.session());
//  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', indexRouter);
  app.use('/auth', apiAuth.router);

  // set up the server
  const onError = (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

  const onListening = () => {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
    console.info('Listening on ' + bind);
  };

  const port = parseInt((
    await config.get('webapi.port', process.env.WEBAPI_PORT || '8080')
  ).val);

  app.set('port', port);
  const server = http.createServer(app);
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  return app;
})();
