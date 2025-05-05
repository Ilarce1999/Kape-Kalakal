import Product from '../models/ProductModel.js';
import path from 'path';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // fetch all products from DB
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};
  
  // Create a new product
export const createProduct = async (req, res) => {
  const { name, price, description } = req.body;
  const image = req.file?.filename;

  if (!name || !price || !description || !image) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  const product = await Product.create({ name, price, description, image });
  res.status(201).json(product);
};
  
  // Update a product
  export const updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
      };
  
      if (req.file) {
        updatedData.image = req.file.filename; // Make sure to handle the image as well
      }
  
      const updated = await Product.findByIdAndUpdate(id, updatedData, { new: true });
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
  