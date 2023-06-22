const Tickets = require('../../models/tickets.models')
const Products = require('../../models/products.models')
const ErrorRepository = require('./errors.repository')


class TicketsRepository{

  async processDataTicket(code, userEmail, cart) {

  try {
    const processedProducts = []
    const unprocessedProducts = []
    let totalAmount = 0

  
    for (let i = 0; i < cart.productos.length; i++) {
      const item = cart.productos[i];

      
      const product = await this.processItem(item, processedProducts, unprocessedProducts)
      if (product) {
        const productQuantity = item.quantity;
        const productTotalPrice = product.price * productQuantity;
        totalAmount += productTotalPrice;
      }else{
        throw new ErrorRepository('No se encontraron productos', 404, error)
      }
    }

    

    cart.productos = cart.productos.filter((item) => !processedProducts.some((processedItem) => processedItem._id.toString() === item.product._id.toString()));
    await cart.save();

    const ticket = await Tickets.create({
      code: code,
      purchase_datetime: Date.now(),
      amount: totalAmount,
      purchaser: userEmail,
      processProducts: processedProducts
    });

    return {
      ticket: ticket,
      unprocessedProducts: unprocessedProducts
    }
    
    
  } catch  (error) { 
    throw (new ErrorRepository('Error al cargar el Tickets',500))
    
  }

    
  }

  async processItem(item, processedProducts, unprocessedProducts) {
    const productId = item.product._id;
    const productQuantity = item.quantity


    try { console.log(productId);
      const product = await Products.findById(productId)
  
      if (productQuantity <= product.stock) {
        product.stock -= productQuantity;
        await product.save();
        processedProducts.push(product);
        return product
      } else {
        unprocessedProducts.push(product);
      }
    } catch (error) {
     console.error(error);
     throw new ErrorRepository('El item no fue procesado', 500)
    } 
  }
}


module.exports = TicketsRepository