// controllers/users.js

// Usuarios registrados 
const usuarios = [
    { id: 1, nombreUsuario: "Manolito", email: 'manolito@example.com', contrasenia: 'tilinInsanoXD' },
    { id: 2, nombreUsuario: "Manuelita",email: 'madrecitaBonita@example.com', contrasenia: 'mamarre' },
    { id: 2, nombreUsuario: "Root", email: 'root@example.com', contrasenia: 'root' }
];

function getUsers() {
    return usuarios;
}

function getUserForEmail(email){
    return usuarios.find(busqueda => busqueda.email === email);
}

module.exports = {
    getUsers,
    getUserForEmail
};
