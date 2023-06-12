const {Router}= require('express')
const router = Router()
const mongoose = require('mongoose')
const Cart = require('../../models/carts.models')
const Products = require('../../models/products.models')

router.get('/', async (req, res) => {
  try {
    const newCart = await Cart.create({})
    console.log('Nuevo carrito creado:', newCart)
    res.status(201).json(newCart)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error' })
  }
})


//POST agrega un producto en un carrito
router.post('/:cartId/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ _id: req.params.cartId });
    const product = await Products.findOne({_id: req.params.productId});
    if (!product) throw new Error('Product not found');

    const itemIndex = cart.productos.findIndex(item => item.product._id.toString() === req.params.productId);
    //console.log(itemIndex);
    if (itemIndex !== -1) {
      cart.productos[itemIndex].quantity += 1;
    } else {
      cart.productos.push({
        product: req.params.productId,
        quantity: 1
      });
    }

    await cart.save();
    res.json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error adding product to cart' });
  }
});


// DELETE el producto del carrito elegido
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await Cart.findOne({ _id: req.params.cid });
    const productIndex = cart.productos.findIndex(item => item.product.equals(new mongoose.Types.ObjectId(req.params.pid)));
    if (productIndex === -1) throw new Error('Product not found in cart');
    cart.productos.splice(productIndex, 1);
    await cart.save();
    res.json({ message: 'Product removed from cart', cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error removing product from cart' });
  }
});

// PUT  va a actualiza el carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    cart.productos = req.body.productos;
    await cart.save();
    res.json({ message: 'Cart updated', cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error updating cart' });
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
    res.status(500).json({ error: 'Error updating cart' });
  }
});

// DELETE api/carts/:cid va a eliminar los productos del carrito
router.delete('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    cart.productos = [];
    await cart.save();
    res.json({ message: 'All products removed from cart', cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error removing products from cart' });
  }
});

// GET /:cid
router.get('/:cid', async (req, res) => {
  try {
      const cart = await Cart.findById(req.params.cid).populate('productos.product');
      res.status(200).render('carts.handlebars', {cart});
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error getting cart' });
    }
  });


module.exports = router