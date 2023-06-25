const dbCartRouter= require("../dao/dbManager/carts.controller")
const dbProductsRouter= require("../dao/dbManager/products.controller")
const userController= require("../dao/dbManager/users.controller")
const authController= require("../dao/dbManager/auth.controller")
const currentSession = require("../dao/dbManager/sessions.controller")
const messageController = require("../dao/dbManager/messages.controller")
const ErrorRepository = require("../dao/repository/errors.repository")
const loggerTest = require('../dao/dbManager/test.controller')

const errorHandler = (err, req, res, next) => {
  if (err instanceof ErrorRepository) {
    const errorMessage = err.message || 'Error desconocido'
    res.status(err.code).json({ error: errorMessage });
  } else {
    console.error(err);
    res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
  }
};

const router = app => {

  app.use('/api/dbCarts', dbCartRouter);
  app.use('/api/dbProducts', dbProductsRouter);
  app.use('/api/register', userController);
  app.use('/api/login', authController);
  app.use('/api/sessions/current', currentSession);
  app.use('/api/messages', messageController);
  app.use('/api/loggerTest', loggerTest ); 
  app.use(errorHandler)
}


module.exports = router