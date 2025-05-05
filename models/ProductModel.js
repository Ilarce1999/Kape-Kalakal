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
    min: 0
  },
  image: {
    type: String,  // Store the path of the image file
    required: false,
  }
}, {
  timestamps: true // Automatically create `createdAt` and `updatedAt` fields
});

export default mongoose.model('Product', ProductSchema);
