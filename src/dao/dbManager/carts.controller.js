const {Router}= require('express')
const mongoose = require('mongoose')
const Cart = require('../../models/carts.models')
const Products = require('../../models/products.models')
const userAcces = require('../../middlewares/userAcces.middleword')
const checkDataTicket = require('../tickets.dao')
const saveProductInCar = require('../carts.dao')
const uuid = require('uuid')
const ErrorRepository = require('../repository/errors.repository')
const router = Router()  


router.get('/', async (req, res, next) => {
  try {
    const newCart = await Cart.create({})
    console.log('Nuevo carrito creado:', newCart)
    res.status(201).json(newCart)
  } catch (err) {
    console.error(err)
    next(new ErrorRepository('error',500))
  }
})


//POST agrega un producto en un carrito
router.post('/:cartId/:productId', async (req, res, next) => {
  try {
    
    const cart = await Cart.findOne({ _id: req.params.cartId });
    const product = await Products.findOne({_id: req.params.productId});
    await saveProductInCar(cart, product)
    res.status(200).redirect(req.header('Referer'))

  } catch (error) {
    console.log(error);
    next(error)
  }
});


// DELETE el producto del carrito elegido
router.delete('/:cid/products/:pid', async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ _id: req.params.cid });
    const productIndex = cart.productos.findIndex(item => item.product.equals(new mongoose.Types.ObjectId(req.params.pid)));
    if (productIndex === -1) throw new Error('Product not found in cart');
    cart.productos.splice(productIndex, 1);
    await cart.save();
    res.json({ message: 'Product removed from cart', cart });
  } catch (error) {
    console.log(error);
    next(new ErrorRepository('error',500))
  }
});

// PUT  va a actualiza el carrito con un arreglo de productos
router.put('/:cid', async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    cart.productos = req.body.productos;
    await cart.save();
    res.json({ message: 'Cart updated', cart });
  } catch (error) {
    console.log(error);
   next(new ErrorRepository('error',500))
  }
});

// PUT actualizar la cantidad de producto por cualquier cantidad
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    const item = cart.productos.find(item => item.product == req.params.pid);
    if (!item) throw new Error('Product not found in cart');
    item.quantity = req.body.quantity;
    await cart.save();
    res.json({ message: 'Cart updated', cart });
  } catch (error) {
    console.log(error);
    next(new ErrorRepository('ERROR',500))
  }
});

// DELETE api/carts/:cid va a eliminar los productos del carrito
router.delete('/:cid', async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    cart.productos = [];
    await cart.save();
    res.json({ message: 'All products removed from cart', cart });
  } catch (error) {
    console.log(error);
    next(new ErrorRepository('error',500))
  }
});

// GET /:CID
router.get('/:cid', userAcces, async (req, res, next) => {
  try {
      const cart = await Cart.findById(req.params.cid);
      console.log(cart);
      res.status(200).render('carts.handlebars', {cart});
    } catch (error) {
      console.log(error);
      next(new ErrorRepository('error',500))
    }
  });

// Carrito final cerrar compra
router.get('/:cid/purchase',userAcces , async (req, res, next) => {
  try {
    const cartId = req.params.cid
    const cart = await Cart.findById(cartId)
    const userEmail = req.user.email
    const code = uuid.v4()

    const purchaseData = await checkDataTicket(code, userEmail, cart)
    console.log(purchaseData)

    const ticket = purchaseData.ticket
    const unprocessedProducts = purchaseData.unprocessedProducts

    if(unprocessedProducts.length > 0){
      res.json({"whith out stock": unprocessedProducts,
                "Productos comprados y tickets": ticket})
    }else{
      res.json({"thank for build": ticket})
    }
  } catch (error) {
    console.error(error)
   next(new ErrorRepository('error desde cart controller ',500))
  }
})

module.exports = router