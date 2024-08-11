import Product from '../models/product.js';

export const getProducts = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const query = req.query.query ? { category: req.query.query } : {}; 
    const sort = req.query.sort === 'asc' ? { price: 1 } : req.query.sort === 'desc' ? { price: -1 } : {};

    try {
        const products = await Product.find(query)
            .sort(sort)
            .limit(limit)
            .skip((page - 1) * limit);

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        res.json({
            status: 'success',
            payload: products,
            totalPages: totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page: page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${req.query.sort}&query=${req.query.query}` : null,
            nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}&sort=${req.query.sort}&query=${req.query.query}` : null,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
