// controllers/users.js

// Usuarios registrados 
const usuarios = [
    { id: 1, nombreUsuario: "Manolito", email: 'manolito@example.com', contrasenia: 'tilinInsanoXD' },
    { id: 2, nombreUsuario: "Manuelita", email: 'madrecitaBonita@example.com', contrasenia: 'mamarre' },
    { id: 3, nombreUsuario: "Root", email: 'root@example.com', contrasenia: 'root' },
    { id: 4, nombreUsuario: "Anita", email: 'anita@example.com', contrasenia: 'AnitaMaxWin' }
];


function getUserForEmail(email) {
    return usuarios.find(busqueda => busqueda.email === email);
}

module.exports = {
    getUserForEmail
};
