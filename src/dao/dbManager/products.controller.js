const {Router}= require('express')
const Products = require('../models/products.models')
const mongoosePaginate =require ('mongoose-paginate-v2')
const Cart = require ('../models/carts.models')
const privateAccess = require('../../middlewares/privateAccess')
const router = Router()

router.get('/', privateAccess, async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const sort =
    req.query.sort === 'asc'
      ? 'price'
      : req.query.sort === 'desc'
      ? '-price'
      : null;
  const query = req.query.query
    ? {
        $and: [
          {
            $or: [
              { name: { $regex: new RegExp(req.query.query, 'i') } },
              { description: { $regex: new RegExp(req.query.query, 'i') } },
            ],
          },
          {
            category: {
              $regex: req.query.category || '',
              $options: 'i',
            },
          },
        ],
      }
    : { category: { $regex: req.query.category || '', $options: 'i' } };
  try {

    const products = await Products.paginate(query, {
      limit: limit,
      page: page,
      sort: sort,
    });
    const totalPages = products.totalPages;
    const prevPage = products.prevPage;
    const nextPage = products.nextPage;
    const currentPage = products.page;
    const hasPrevPage = products.hasPrevPage;
    const hasNextPage = products.hasNextPage;
    const prevLink = hasPrevPage
      ? `http://${req.headers.host}/api/dbProducts?page=${prevPage}&limit=${limit}&sort=${sort}&query=${query}`
      : null;
    const nextLink = hasNextPage
      ? `http://${req.headers.host}/api/dbProducts?page=${nextPage}&limit=${limit}&sort=${sort}&query=${query}`
      : null;

    const user = req.session.user;
    const message = user
      ? `Bienvenido ${user.role} ${user.first_name} ${user.last_name}!`
      : null;
    // Buscar el carrito del usuario por el id del usuario
    const cart = await Cart.findOne({ _id: user.cartId });
    // parsear el objeto con el id del usuario a cadena
    const cartId = cart._id.toString()
    res.render('products.handlebars', {
      title: 'Lista de Productos',
      cartId: cartId,
      products: products.docs,
      totalPages: totalPages,
      prevPage: prevPage,
      nextPage: nextPage,
      page: currentPage,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink,
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
      message: message 
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});


router.post('/', async (req, res) => {
  try {
    const productInfo = req.body
    const newProduct = await Products.create(productInfo)
    res.json({message: newProduct})
  } catch (error) {
    console.log(error)
  }
})

router.put('/:productId', async (req, res) => {
  try {
    const updatedProduct = await Products.findByIdAndUpdate(req.params.productId, req.body, { new: true })
    res.json({ message: 'Product updated successfully', product: updatedProduct })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error updating product' })
  }
})

router.delete('/:productId', async (req, res) => {
  try {
    const deletedProduct = await Products.findByIdAndDelete(req.params.productId)
    res.json({message: `Product with ID ${req.params.productId} has been deleted`})
  } catch (error) {
    console.log(error)
    res.status(500).json({error: 'Error deleting product'})
  }
})



module.exports = router