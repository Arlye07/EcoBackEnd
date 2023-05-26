 const socket = io()
  socket.on('mensaje', message => {
    console.log(message)
  })

  //agregar real time
  socket.on('newProduct', products => {

    const productList = document.querySelector('.lista');
    productList.innerHTML = '';
    products.forEach(product => {
      const productItem = document.createElement('div');
      productItem.classList.add('item');
      productItem.innerHTML =
      ` <h3>${product.title}</h3>
        <img src="${product.thumbnail}" alt="">
        <p>${product.description}</p>
        <p>$${product.price}</p>`

      productList.appendChild(productItem);
    })
  })

  
//Eliminar realtime

socket.on('deleteProduct', products => {
  const productList = document.querySelector('.lista');
  productList.innerHTML = '';
  products.forEach(product => {
    const productItem = document.createElement('div');
    productItem.classList.add('item');
    productItem.innerHTML = 
    ` <h3>${product.title}</h3>
      <img src="${product.thumbnail}" alt="">
      <p>${product.description}</p>
      <p>$${product.price}</p>` 
    
    productList.appendChild(productItem);
  })
})



















//  const newProductForm = document.getElementById('newProduct')

//  newProductForm.addEventListener('submit', e => {
//      e.preventDefault ()})

//      const data = new FormData(newProductForm)
//      const obj = {}

//      data.forEach((value, key) => (obj[key] = value ))
//      //console.log(cliente);

//  socket.emit('newProduct', obj)

//    console.log('cliente')
//    fetch('/products', {
//      headers: {
//        'Content-Type': 'application/json',
//      },
//      method: 'POST',
//      body: JSON.stringify(obj),
//    })
//      .then(response => response.json())
//      .then(response => console.log(response))
//      .catch(error => console.log(error))

//       socket.emit('mensajeCliente', 'Hola desde el cliente')


     //-----------

    //  const socket = io();
    //  const productsContainer = document.getElementById("products");
     
    //  socket.on("realtimeproducts", (products) => {
    //    const { products } = productos;
    //    productsContainer.innerHTML = "";
    //    products.forEach((products) =>
    //      productsContainer.append(productContainer(products))
    //    );
    //  });
     
    //  const productContainer = (products) => {
    //    const div = document.createElement("div");
    //    div.innerHTML = `
    //      <h2>${products.title}</h2>
    //      <p>${products.description}</p>
    //      <p>Code: ${products.code}</p>
    //      <p>Stock: ${products.stock}</p>
    //      <p>Price: ${products.price}</p>
    //      `;
    //    return div;
    //  };