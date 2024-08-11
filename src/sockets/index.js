import productsModel from '../models/product.js';

const configureSockets = (io) => {
    io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    socket.emit('products', productsModel.getProducts());
    socket.on('newProduct', (product) => {
        productsModel.addProduct(product);
        io.emit('products', productsModel.getProducts());
    });
socket.on('deleteProduct', (index) => {
        deleteProduct(index);
        io.emit('products', productsModel.getProducts());
    });
    });
};
export default configureSockets;

