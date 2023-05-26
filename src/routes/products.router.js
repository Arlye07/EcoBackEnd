const {Router}= require ('express');
const productManager = require("../dao/fileSystemManager/productManager");


const router = Router();

//-----------------------

// GET /products
router.get("/", async (req, res) => {
   try {
     const products = productManager.getProducts();
     res.render('home.handlebars', {products})
 } catch (error) {
   console.error(error);
   res.status(500).json({ error });
 }
});
// GET /products/:id
router.get("/:pid", async (req, res) => {
 try {
   const productId = +req.params.pid;

   const product = productManager.getProductById(productId);

   res.json(product);
 } catch (error) {
   console.error(error);
   res.status(500).json({ error });
 }
});

// POST /products
router.post("/", (req, res) => {
 const body = req.body;
   try {
     productManager.addProduct(body);
     return res.status(201).json({ message: "Producto creado" });
   } catch (error) {
     console.error(error);
     res.status(500).json({ error });
   }
});

// DELETE /products/:id
router.delete('/:id', (req, res) => {
 const id = +req.params.id;
 try {
   productManager.deleteProduct(id);
   res.json({ message: `Se elimino el product ${id}`});
 } catch (error) {
   console.error(error);
   res.status(500).json({ error });
 }
})

// PUT /products/:id
router.put('/:id', (req, res) => {
 const id = +req.params.id;
 const body = req.body;
 try {
   productManager.updateProduct(id, body);
   res.json({ message: `Producto id ${id} modificado`});
 } catch (error) {
   console.error(error);
   res.status(500).json({ error });
 }
});


module.exports = router;