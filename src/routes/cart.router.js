const fs = require('fs');
const { Router } = require('express');
const router = Router()
const path = require('path');
const cartManager = require('../dao/fileSystemManager/cartManager')
//-------------------------------------
router.post('/', (req, res) => {
  try {
    cartManager.createCart()
    res.status(201).send({message: 'Carrito creado!!'})
  } catch (error) { console.error(error)
    res.status(500).send({message: 'Creando nuevo id carrito ERROR!!!'})
  }
})

// GET/:cid
router.get('/:cid', (req, res) => {
  const cid = parseInt(req.params.cid)
  try {
    const cart = cartManager.getCart(cid)
    res.status(200).send({message: `Carrito cargado ${cid} `,carrito: cart})
  } catch (error) {
    console.error(error)
    res.status(400).send({message: `No existe Id ${cid} `})
  }
})

//post/:cid/pid
router.post('/:cid/product/:pid', (req, res) => {
  const cid = parseInt(req.params.cid)
  const pid = parseInt(req.params.pid)
  try {
    cartManager.agregaUno(cid, pid)
    res.status(200).send({message: `El producto ${pid} se sumo al carrito ${cid}`})
  } catch (error) {console.error(error)
    res.status(404).send({message: `Error, o el carrito o el producto no se estarian agregando, o codigo error`})
  }
})

//--------------------
module.exports = router