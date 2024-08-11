import { Router } from 'express';
import fs from 'fs/promises';
import { __dirname } from '../utils.js';

const productsRouter = Router();
const productFilePath = `${__dirname}/../data/products/productos.json`;


const readFile = async (path) => {
    const data = await fs.readFile(path);
    return JSON.parse(data);
};

const writeFile = async (path, data) => {
    await fs.writeFile(path, JSON.stringify(data, null, 2));
};

productsRouter.get('/', async (req, res) => {
    try {
        const productList = await readFile(productFilePath);
        res.status(200).json({ resultado: productList });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
productsRouter.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const productList = await readFile(productFilePath);
        const product = productList.find(p => p.id === parseInt(pid));
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

productsRouter.post('/', async (req, res) => {
    try {
        const newProduct = req.body;
        const productList = await readFile(productFilePath);
        const id = productList.length ? productList[productList.length - 1].id + 1 : 1;
        const product = { id, ...newProduct, status: true };
        productList.push(product);
        await writeFile(productFilePath, productList);
        res.status(201).json({ message: 'Se ha agregado el producto!' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

productsRouter.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = req.body;
        const productList = await readFile(productFilePath);
        const productIndex = productList.findIndex(p => p.id === parseInt(pid));
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }
        productList[productIndex] = { ...productList[productIndex], ...updatedProduct };
        await writeFile(productFilePath, productList);
        res.status(200).json({ message: 'Producto actualizado' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
productsRouter.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const productList = await readFile(productFilePath);
        const productIndex = productList.findIndex(p => p.id === parseInt(pid));
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        productList.splice(productIndex, 1);
        await writeFile(productFilePath, productList);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: ' Error' });
    }
});

export default productsRouter;

