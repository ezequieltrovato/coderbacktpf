import { Router } from 'express';
import fs from 'fs/promises';
import { __dirname } from '../utils.js';

const cartsRouter = Router();
const cartFilePath = `${__dirname}/../data/carts/carts.json`;

const readFile = async (path) => {
    const data = await fs.readFile(path);
    return JSON.parse(data);
};

const writeFile = async (path, data) => {
    await fs.writeFile(path, JSON.stringify(data, null, 2));
};

cartsRouter.post('/', async (req, res) => {
    try {
        const cartList = await readFile(cartFilePath);
        const id = cartList.length ? cartList[cartList.length - 1].id + 1 : 1;
        const cart = { id, products: [] };
        cartList.push(cart);
        await writeFile(cartFilePath, cartList);
        res.status(201).json({ message: 'Carrito creado' });
    } catch (error) {
        res.status(500).json({ message: 'Error' });
    }
});

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cartList = await readFile(cartFilePath);
        const cart = cartList.find(c => c.id === parseInt(cid));
        if (!cart) {
            return res.status(404).json({ message: 'Cart no encontrada' });
        }
        res.status(200).json(cart.products);
    } catch (error) {
        res.status(500).json({ message: ' Error' });
    }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cartList = await readFile(cartFilePath);
        const cart = cartList.find(c => c.id === parseInt(cid));
        if (!cart) {
            return res.status(404).json({ message: 'Cart no encontrada' });
        }

        const productInCart = cart.products.find(p => p.product === pid);
        if (productInCart) {
            productInCart.quantity++;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await writeFile(cartFilePath, cartList);
        res.status(200).json({ message: 'Producto agregado al carrito' });
    } catch (error) {
        res.status(500).json({ message: ' Error' });
    }
});

export default cartsRouter;
