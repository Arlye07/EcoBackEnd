const fs = require('fs')
const express = require('express');
const cartRouter = require('../../routes/cart.router');
const app = express();
const jsonCart = '../data/Carts.json'


class CartManager{
  constructor(path){
    this.rutaProd = '../data/products.json'
    this.path = path
  }

  lectura(rutaAr){
    try {
      const data = fs.readFileSync(rutaAr)
      return JSON.parse(data)
    } catch (error) {
      throw new Error(`Error: ${error.message}`)
    }
  }

  createCart(){
    const carts = this.lectura(this.path)

    let numId = 0;
    for (const cart of carts) {
        if (cart.id > numId) { numId = cart.id;}
    }
    const creaCart = {
      "id": numId + 1,
      "products":[]
    }
    carts.push(creaCart)
    fs.writeFileSync(this.path, JSON.stringify(carts, null, 2))
    console.log(`Carrito Id ${numId + 1} generado correctamente`)
  }
  agregaUno(cid, pid){
    const carts = this.lectura(this.path)
    const cart = carts.find(c => c.id === cid)
    const products = this.lectura(this.rutaProd)
    const product = products.find(p => p.id === pid)
    const indexCartPro = cart.productos.findIndex(p => p.product === pid)

    try {
      if(!product){ console.error(`El producto no encontrado ${pid} `)
        return
      }
      if(!cart){ console.error(`Carrito no encontrado ${cid} `)
        return
      }
      if(indexCartPro !== -1){ cart.productos[indexCartPro].quantity++;
      }else{
        cart.productos.push({
          product: pid,
          quantity: 1
        })
      }
      fs.writeFileSync(this.path, JSON.stringify(carts))
      console.log(`El producto ${pid} y el id del carrito ${cid} se añadieron`)
    } catch (error) {
      throw new Error(`Error al agregar el producto: ${error.message}`)
    }
  }
  getCarts() {
    return this.lectura();
  }
  getCart(id){
    const carts = this.lectura(this.path)
    try {const cart = carts.find(c => c.id === id)
      return cart
    } catch (error) {
      throw new Error(`Error id ${id}: ${error.message}`)
    }
  }
  borrarProducto(cid, pid) {
    const carts = this.lectura(this.path)
    const cart = carts.find(c => c.id === cid)
    const indexCartPro = cart.productos.findIndex(p => p.product === pid)

    try {
      if (indexCartPro === -1) {
        console.error(`El producto no se encontró en el carrito ${cid}`)
        return
      }

      // Si encontramos el producto, lo eliminamos del carrito
      cart.productos.splice(indexCartPro, 1)
      fs.writeFileSync(this.path, JSON.stringify(carts))
      console.log(`El producto ${pid} fue eliminado del carrito ${cid}`)
    } catch (error) {
      throw new Error(`Error al borrar el producto: ${error.message}`)
    }
  }
  
}

const cartManager = new CartManager(jsonCart)
module.exports = cartManager