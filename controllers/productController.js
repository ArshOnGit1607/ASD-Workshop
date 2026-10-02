const productService = require('../services/productService');

async function getAllProducts(req, res, next) {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: `Product with id ${id} not found` });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const { name, price } = req.body || {};
    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { name, price } = req.body || {};
    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
    const updatedProduct = await productService.updateProduct(id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ message: `Product with id ${id} not found` });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
}

async function patchProduct(req, res, next) {
  try {
    const { id } = req.params;
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Request body cannot be empty' });
    }
    const patchedProduct = await productService.patchProduct(id, req.body);
    if (!patchedProduct) {
      return res.status(404).json({ message: `Product with id ${id} not found` });
    }
    res.status(200).json(patchedProduct);
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const deletedProduct = await productService.deleteProduct(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: `Product with id ${id} not found` });
    }
    res.status(200).json({ message: `Product with id ${id} deleted successfully`, product: deletedProduct });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct
};
