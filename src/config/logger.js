const winston = require('winston');

const infoLogger = winston.createLogger({
    format: winston.format.simple(),
    transports: [
      new winston.transports.File({ filename: process.cwd() + '\\logs\\engagements.log', level: 'info'})
    ],
});

const errorLogger = winston.createLogger({
    format: winston.format.simple(),
    transports: [
      new winston.transports.File({ filename: process.cwd() + '\\logs\\errors.log', level: 'error'})
    ],
});

module.exports.infoLogger = infoLogger;
module.exports.errorLogger = errorLogger;
