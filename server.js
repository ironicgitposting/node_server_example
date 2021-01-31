/**
 * Application bootstrap
 * @author Patrick
 */
const debug = require('debug')('node-angular');
const http = require('http');
const app = require('./server/app');
/*
Makes sure when we try to setup a port,
We make sure it's a valid number.
*/
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const port = normalizePort(process.env.PORT || '3000');
const bind = typeof port === 'string' ? `pipe ${port}` : `port ${port}`;

const handleError = {
  // https://nodejs.org/api/errors.html
  EACCES: _ => {
    debug(`${bind} requires elevated privileges`);
    process.exit(1);
  },
  EADDRINUSE: _ => {
    debug(`${bind} is already in use`);
    process.exit(1);
  }
}

/*
Check for startup error and console log which type of error we get
and then stop the nodejs server.
*/
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  if (handleError.hasOwnProperty(error.code)) {
    handleError(error.code);
  } else {
    throw error;
  }
};

app.set('port', port);

const server = http.createServer(app);

// Error Logging
// TODO: Convert to middleware and write to log file
const requestStats = require('request-stats');
const moment = require('moment');

requestStats(server, async (stats) => {
  if (!stats.ok) {
    // Async write to log file later
    debug(`${moment().format('LTS')} : ${stats.req.method} request on ${stats.req.path} from ip: ${stats.req.ip}`);
    debug(stats.req.headers);
  }
});

// Initial States
const onListening = () => {
  const addr = server.address();
  debug(`Listening on ${bind}`);
  debug(`Server Address: ${addr.address}`);
};

server.on('error', onError);
server.on('listening', onListening);
server.listen(port);
