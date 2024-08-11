import express from 'express';
import { getProducts } from '../controllers/productsController.js';
import { getCartById } from '../controllers/cartsController.js';

const router = express.Router();


router.get('/products', async (req, res) => {
    const productsData = await getProducts(req, res);
    res.render('products/index', productsData);
});


router.get('/carts/:cid', async (req, res) => {
    const cartData = await getCartById(req, res);
    res.render('carts/cart', cartData.payload);
});

export default router;
