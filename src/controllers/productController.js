import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Product from '../src/models/ProductModel';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).json({ message: 'Error fetching product' });
  }
};

export const createProduct = async (req, res) => {
  console.log('Body:', req.body);  
  console.log('File:', req.file); 
  try {
    const { name, description, price, stock } = req.body;

    // Require name, price, stock (description is optional per schema)
    if (!name || !price || !stock) {
      return res.status(400).json({ msg: 'Name, price, and stock are required' });
    }

    // Enforce image upload if you want it as a business rule
    if (!req.file) {
      return res.status(400).json({ msg: 'No image file uploaded' });
    }

    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock);

    if (isNaN(parsedPrice) || isNaN(parsedStock)) {
      return res.status(400).json({ msg: 'Price and stock must be valid numbers' });
    }

    const newProduct = new Product({
      name: name.trim(),
      description: description || '', // optional
      price: parsedPrice,
      stock: parsedStock,
      image: req.file.path,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ msg: 'Failed to create product' });
  }
};



// Update product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  if (req.file) {
    updatedFields.image = req.file.path;
  }

  if (updatedFields.stock) {
    updatedFields.stock = parseInt(updatedFields.stock);
  }

  if (updatedFields.price) {
    updatedFields.price = parseFloat(updatedFields.price);
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

// Delete product and image
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.image) {
      const imagePath = path.join(__dirname, '..', product.image);
      try {
        if (fs.existsSync(imagePath)) {
          await fs.promises.unlink(imagePath);
        } else {
          console.log('Image does not exist:', imagePath);
        }
      } catch (err) {
        console.error('Error deleting image:', err.message);
      }
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product and image deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

// Decrease product stock
export const decreaseProductStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid quantity' });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    product.stock -= quantity;
    const updatedProduct = await product.save();

    res.status(200).json({
      message: 'Stock updated successfully',
      productId: updatedProduct._id,
      newStock: updatedProduct.stock,
    });
  } catch (error) {
    console.error('Error decreasing product stock:', error.message);
    res.status(500).json({ message: 'Failed to update product stock' });
  }
};
