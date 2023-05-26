const fs = require("fs");
class ProductManager {
  constructor(path) {
    this.path = path;
  }

  addProduct(product) {
    // if (this.products.find((x) => x.code === product.code)) {
    //   console.log("Ya implementado");
    //   return;
    // }
    // if (
    //   !product.title ||
    //   !product.description ||
    //   !product.price ||
    //   !product.thumbnail ||
    //   !product.code ||
    //   !product.stock
    // ) {
    //   console.log("Faltan info");
    //   return;
    // }

    const data = fs.readFileSync(this.path)
    const products = JSON.parse(data)

    const id = products.length + 1
    const newProduct = product
    newProduct["id"] = id
    products.push(newProduct)

    try {
      //no estoy utilizando appendFileSync por que agregaria el objeto al final del archivo pórfuera del array de productos creando un error de sintaxis en el json de los porductos
      fs.writeFileSync(this.path, JSON.stringify(products, null, 2))
      console.log(`producto ${id} agregado`)
      return products
    } catch (error) {
      console.error('error al escribir el archivo',error)
      throw new Error(`no se pudo agregar el producto ${id}`)
    }
  }

  getProducts(limit) {
    try {
      const productos = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
      if(limit){
        console.log(productos.slice(0, limit))
        return productos.slice(0, limit)
      }else{
        return productos
      }
    }catch(error){
      console.error(error)
      throw new Error(`error al cargar los productos`)
    }
  }

  getProductById(id) {
    const product = this.products.find((x) => x.id === id);
    if (!product) {
      throw "no encontrado"
    }
    return product;
  }


  updateProduct(id, updates) {
    try {
      const product = this.getProductById(id);

      this.products[id] = {
        ...updates,
        id,
      };
      return this.products[product.id];
    } catch (error) {
      throw error;
    }
  }


  deleteProduct(id){
    try {
      const productos = JSON.parse(fs.readFileSync(this.path, 'utf-8',))
      const index = productos.findIndex(producto => producto.id === id)


      if(index !== -1){
        productos.splice(index, 1)
        fs.writeFileSync(this.path, JSON.stringify(productos, null, 2))
        console.log('producto ${id} eliminado')
      }
    } catch (error) {
      console.error(error)
      throw new Error(`error al eliminar el producto ${id}`)
    }
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, "utf-8");
      const products = JSON.parse(data);
    } catch (error) {
      console.log("Error al cargar productos:", error.message);
    }
  }

  saveProducts() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products, null,"\t" ));
    } catch (error) {
      console.log("Error al guardar productos:", error.message);
    }
  }
}
//-------------------

const productManager = new ProductManager('./data/products.json');
module.exports = productManager;