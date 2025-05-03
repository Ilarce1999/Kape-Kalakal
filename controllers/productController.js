import Product from '../models/ProductModel.js';

// Get all products
export const getAllProducts = async (req, res) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Create a new product
  export const createProduct = async (req, res) => {
    try {
      const { name, description, price, image } = req.body;
      const newProduct = new Product({ name, description, price, image });
      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ message: 'Invalid product data' });
    }
  };
  
  // Update a product
  export const updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update product' });
    }
  };
  
  // Delete a product
  export const deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete product' });
    }
  };
  