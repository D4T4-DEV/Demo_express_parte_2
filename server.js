const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const productosController = require('./controllers/productos');
const usuariosController = require('./controllers/users');

app.use(express.urlencoded({ extended: true })); // Medio para obtener los datos del formulario

// Configurar middleware para manejar sesiones
app.use(session({
    secret: 'secreto', // Clave secreta para firmar la cookie de sesión
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    res.locals.carrito = req.session.carrito || [];
    next();
});

// Configuración de la plantilla Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para procesar archivos estáticos en la carpeta 'public'
app.use(express.static('public'));
app.use(express.json());

// Ruta para la página de inicio
app.get('/', (req, res) => {
    if (req.session.usuario) {
        //  autenticado
        res.render('index', { title: 'Página de Bienvenida', usuario: req.session.usuario });
      } else {
        // no autenticado
        res.render('index', { title: 'Página de Bienvenida', usuario: null});
      }
});

// Ruta para el catálogo de productos
app.get('/catalogo', (req, res) => {
    if(req.session.usuario){
        const productos = productosController.getProductos();
        res.render('catalogo', { title: 'Catálogo de Productos', productos, usuario: req.session.usuario });
    }else {
        const productos = productosController.getProductos();
        res.render('catalogo', { title: 'Catálogo de Productos', productos, usuario: null });
    }

});

// Ruta para buscar productos
app.get('/buscar-producto', (req, res) => {
    const query = req.query.q.toLowerCase();
    const productos = productosController.getProductos();
    const productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(query) || producto.descripcion.toLowerCase().includes(query)
    );
    if(req.session.usuario){
        res.render('catalogo', { title: 'Resultados de la Búsqueda', productos: productosFiltrados, usuario: req.session.usuario });
    }else{
        res.render('catalogo', { title: 'Resultados de la Búsqueda', productos: productosFiltrados, usuario: null });
    }
});


// Ruta para el detalle de producto
app.get('/producto/:id', (req, res) => {
    const idProducto = req.params.id;
    const producto = productosController.getProductoPorId(idProducto);
    res.render('producto', { title: 'Detalle del Producto', producto });
});

// Ruta para el carrito de compra
app.get('/carrito', (req, res) => {
    let carrito = req.session.carrito || []; // Obtiene el carrito de la sesión del usuario, si no existe, crea un nuevo carrito vacío
    if (req.session.usuario) {
        //  autenticado
        res.render('carrito', { title: 'Carrito de Compra', carrito, usuario: req.session.usuario });
      } else {
        res.render('carrito', { title: 'Carrito de Compra', carrito });
      }
});

// Ruta para agregar un producto al carrito
app.post('/agregar-al-carrito/:id', (req, res) => {
    const idProducto = req.params.id;
    const producto = productosController.getProductoPorId(idProducto);
    if (producto && producto.cantidad > 0) {
        let carrito = req.session.carrito || [];
        let productoEnCarrito = carrito.find(item => item.id === idProducto);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad++;
        } else {
            carrito.push({ id: idProducto, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
        }
        producto.cantidad--;
        req.session.carrito = carrito;
        res.redirect('/catalogo');
    } else {
        res.status(404).send('Producto no encontrado o no disponible');
    }
});

// Ruta para el detalle de compra
app.get('/detalle-compra', (req, res) => {
    let carrito = req.session.carrito || []; // Obtiene el carrito de la sesión del usuario, si no existe, crea un nuevo carrito vacío

    if(req.session.usuario){
        res.render('detalle-compra', { title: 'Detalle de Compra', carrito, usuario: req.session.usuario});
    }else {
        res.render('login', { title: 'Iniciar sesión' });
    }
});

// Ruta para actualizar la cantidad de un producto en el carrito
app.post('/actualizar-cantidad/:id/:cantidad', (req, res) => {
    const idProducto = req.params.id;
    const cantidad = parseInt(req.params.cantidad);
    let carrito = req.session.carrito || [];
    const item = carrito.find(item => item.id === idProducto);
    const producto = productosController.getProductoPorId(idProducto);
    if (item) {
        const cantidadNueva = item.cantidad + cantidad;
        if (cantidadNueva > 0 && cantidad <= producto.cantidad) {
            item.cantidad = cantidadNueva;
            // item.precio = item.cantidad * producto.precio;
            producto.cantidad -= cantidad;
            if (item.cantidad === 0) {
                carrito = carrito.filter(item => item.id !== idProducto);
            }
        }
    }
    req.session.carrito = carrito;
    res.redirect('/carrito');
});

// Ruta para eliminar un producto del carrito
app.post('/eliminar-del-carrito/:id', (req, res) => {
    const idProducto = req.params.id;
    let carrito = req.session.carrito || []; // Obtiene el carrito de la sesión del usuario, si no existe, crea un nuevo carrito vacío
    const itemIndex = carrito.findIndex(item => item.id === idProducto);
    if (itemIndex !== -1) {
        const removedItem = carrito.splice(itemIndex, 1)[0];
        const producto = productosController.getProductoPorId(idProducto);
        if (producto) {
            producto.cantidad += removedItem.cantidad; // Modifica la cantidad del producto en stock
        }
    }
    req.session.carrito = carrito; // Actualiza el carrito en la sesión
    res.redirect('/carrito');
});

// Middleware para procesar la compra
app.post('/procesar-compra', (req, res) => {
    // Aquí iría la lógica para procesar la compra, por ejemplo, actualizar la base de datos y vaciar el carrito
    const carrito = req.session.carrito || []; // Obtiene el carrito de la sesión del usuario

    // Lógica para procesar la compra...

    // Vaciar el carrito después de procesar la compra
    req.session.carrito = [];

    res.render('confirmacion-compra', { title: 'Compra Exitosa', usuario: req.session.usuario});
});


// Codigo hecho por mi 

// Aspectos para loguearse
app.get('/login', (req, res) => {
    res.render('login', { title: 'Iniciar sesión' });
});

// Cuando se presiona el btn este medio se activa (obtiene los datos del formulario)
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.pwd;

    // Obtenemos la referencia del usuario del JSON
    const user = usuariosController.getUserForEmail(email);

    // Checamos si existe, para no generar un error
    if(user){
        // Aspecto que ocurre si es correcta
        if(password == user.contrasenia){

            req.session.usuario = user; // Guarda el nombre en la sesión
            res.render('index', {title: 'Página de Bienvenida', usuario: user});
        }else{ // Si no es correcta
            res.render('login', { error: 'Contraseña incorrecta. Inténtalo de nuevo.' });
        }
    }else{
        console.log("no existe :(");
        res.render('login', { error: 'Usuario no encontrado. Verifica tu correo electrónico.' });
    }
});

// Aspecto para que se cerrar sesion 
app.get('/close', (req, res) => {
    req.session.usuario = null;
    res.render('index', { title: 'Página de Bienvenida', usuario: null });
});


// Puerto en el que escucha el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});