const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { cacheMiddleware, invalidateCacheMiddleware } = require('../middleware/cacheMiddleware');

router.get(['/', '/products'], cacheMiddleware, productController.getAllProducts);
router.get(['/:id', '/products/:id'], cacheMiddleware, productController.getProductById);

router.post(['/', '/products'], invalidateCacheMiddleware, productController.createProduct);
router.put(['/:id', '/products/:id'], invalidateCacheMiddleware, productController.updateProduct);
router.patch(['/:id', '/products/:id'], invalidateCacheMiddleware, productController.patchProduct);
router.delete(['/:id', '/products/:id'], invalidateCacheMiddleware, productController.deleteProduct);

module.exports = router;
