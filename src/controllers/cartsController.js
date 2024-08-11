import Cart from '../models/carts.js';

export const deleteProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await Cart.findById(cid);
        cart.products = cart.products.filter(product => product.productId.toString() !== pid);
        await cart.save();
        res.json({ status: 'success', message: 'Product removed from cart' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const updateCart = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    try {
        const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true }).populate('products.productId');
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const updateProductQuantity = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await Cart.findById(cid);
        const product = cart.products.find(product => product.productId.toString() === pid);
        if (product) {
            product.quantity = quantity;
            await cart.save();
            res.json({ status: 'success', message: 'Product quantity updated' });
        } else {
            res.status(404).json({ status: 'error', message: 'Product not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const deleteAllProductsFromCart = async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
        res.json({ status: 'success', message: 'All products removed from cart' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const getCartById = async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await Cart.findById(cid).populate('products.productId');
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
