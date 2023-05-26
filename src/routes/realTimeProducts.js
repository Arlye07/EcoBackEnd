
const {Router} = require('express');
const productManager = require('../dao/fileSystemManager/productManager');
const router = Router();


module.exports = (io) => {
    router.get('/', (req, res) => {
        const productsLimite = parseInt(req.query.limit)
        try {
          const productos = productManager.getProducts(productsLimite)
          res.status(200).render('realTimeProducts.handlebars', {productos})
        } catch (error) {
          console.error(error)
          res.status(500).send({error:'error al cargar los productos'})
        }
      })
    router.post('/', (req, res) => {
        const product = req.body
        try {
          productManager.addProduct(product)
          const products = productManager.getProducts()
          // console.log(products)
          io.emit('newProduct', products)
          res.status(201).send({message: 'producto Creado'})
        } catch (error) {
          console.error(error)
          res.status(400).send({error: 'error, al crear el producto'})
        }
      })
      router.delete('/:id', (req, res) => {
        const id = req.params.id
        console.log(id)
        try {
          productManager.deleteProduct(parseInt(id))
          const products = productManager.getProducts()
          io.emit('deleteProduct', products)
          res.status(200).send({message: `producto ${id} eliminado`})
        } catch (error) {
          console.error(error)
          res.status(400).send({error:` error al eliminar el producto ${id}`})
        }
      })

  return router
}