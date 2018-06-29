'use strict';
const winston = require('winston');

/** 
* Define a file transport for actually storing logs. Define a console transport to examine
* and fine tune the output. Only use format on the logger itself so that the console
* and file transports have the same format.
*/

const logger = winston.createLogger({
  level: 'info', 
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() 
  ),
  transports: [
    new winston.transports.File({ 
      level: 'error',
      filename: './logs/prod/error.log' 
    }),
    new winston.transports.File({ 
      level: 'info',
      filename: './logs/prod/info.log' 
    }),
    //new winston.transports.Console({})
  ]
});

const logger_middleware = function(req, res, next) {
  logger.log({
    level: 'info',
    message: `${req.method} ${req.originalUrl} ${res.statusCode} ${req.get('user-agent')} ${req.connection.remoteAddress}`
  });
  next();
}

module.exports = {
  logger_middleware: logger_middleware,
  logger: logger
};
