// controllers/productos.js
const productos = [
    { id: 1, nombre: 'Manolo con papos', descripcion: 'Manolo con papos', cantidad: 10, precio: 100, imagen: 'producto1.jpg' },
    { id: 2, nombre: 'Gallo con tenis', descripcion: 'Gallo con tenis', cantidad: 15, precio: 150, imagen: 'producto2.jpg' },
    { id: 3, nombre: 'Kirby funko', descripcion: 'Funko kirby legendario', cantidad: 5, precio: 50, imagen: 'producto3.jpg' },
    { id: 4, nombre: 'Album de Jovani', descripcion: 'Exitasos de Jovani', cantidad: 10, precio: 100, imagen: 'producto4.jpg' },
    { id: 5, nombre: 'Kirby peluche', descripcion: 'Peluche de kirby', cantidad: 15, precio: 150, imagen: 'producto5.jpg' },
    { id: 6, nombre: 'Llavero de Kirbo', descripcion: 'Llavero de kirbo de 10cm', cantidad: 5, precio: 50, imagen: 'producto6.jpg' },
    { id: 7, nombre: 'Sueter de kirbo', descripcion: 'Sueter de kirbo', cantidad: 5, precio: 500, imagen: 'producto7.jpg' },
    { id: 8, nombre: 'Cama para mascota', descripcion: 'Cama para mascota de kirby', cantidad: 5, precio: 5000, imagen: 'producto8.jpg' }
  ];
  
  function getProductos() {
    return productos;
  }
  
  function getProductoPorId(id) {
    return productos.find(producto => producto.id === parseInt(id));
  }
  
  module.exports = {
    getProductos,
    getProductoPorId
  };
  