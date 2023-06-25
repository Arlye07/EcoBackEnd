const winston = require('winston');
const {log_env} = require('./app.config')


//Loger de desarrollo
const devLogger = winston.createLogger({
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      level: 'debug' // Nivel mínimo para el logger de desarrollo
    })
  ]
});


//Logger de produccion
const prodLogger = winston.createLogger({
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: 'errors.log',
      level: 'error' // Nivel mínimo para el logger de producción con archivo de errores
    })
  ]
});



// Seleccionar el logger según el entorno
let logger
if (log_env === 'production') {
  logger = prodLogger
} else {
  logger = devLogger
}


module.exports = logger;