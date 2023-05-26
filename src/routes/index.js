const productsRouter = require("./products.router");
const cartRouter = require("./cart.router");
const dbCartRouter= require("../dao/dbManager/carts.controller")
const dbProductsRouter= require("../dao/dbManager/products.controller")
const messageController= require("../dao/dbManager/messages.controller")
const userController= require("../dao/dbManager/users.controller")
const authController= require("../dao/dbManager/auth.controller")
const currentSession = require("../dao/dbManager/sessions.controller")

const router = app => {
  app.use('/api/products', productsRouter);
  app.use('/api/cart', cartRouter);
  app.use('/api/dbCarts', dbCartRouter);
  app.use('/api/dbProducts', dbProductsRouter);
  app.use('/api/messages', messageController);
  app.use('/api/register', userController);
  app.use('/api/login', authController);
  app.use('/api/sessions/current', currentSession)
}

module.exports = router