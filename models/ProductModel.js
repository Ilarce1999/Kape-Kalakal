import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,  // Store the path of the image file
    required: false,
  },
  stock: {
    type: Number,  // Number of items available in stock
    required: true, // This can be set to false if stock is not mandatory
    default: 0 // Default to 0 if not provided
  }
}, {
  timestamps: true // Automatically create `createdAt` and `updatedAt` fields
});

export default mongoose.model('Product', ProductSchema);
