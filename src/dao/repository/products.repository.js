const ErrorRepository = require("./errors.repository");
const uuid= require('uuid');

class ProductsRepository {
  async mockProducts() {
    try {
      const mockProducts = [];

      for (let i = 1; i <= 100; i++) {
        const product = {
          _id: uuid.v4(),
          name: `Product ${i}`,
          description: `Description ${i}`,
          price: Math.random() * 100000,
          stock: Math.floor(Math.random() * 100),
          code: `Code ${i}`,
          category: `Category ${i}`,
          status: true,
          img: `https://example.com/image${i}.jpg`,
        };

        mockProducts.push(product);
      }

      return mockProducts;
    } catch (error) {
      throw new ErrorRepository("Error al generar los productos", 400);
    }
  }
}
module.exports = ProductsRepository;
