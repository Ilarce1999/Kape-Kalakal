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
  sizes: {
    small: {
      type: Number, // price for small size
      required: true
    },
    medium: {
      type: Number, // price for medium size
      required: true
    },
    large: {
      type: Number, // price for large size
      required: true
    }
  },
  image: {
    type: String,  // Store the path of the image file
    required: false,
  }
}, {
  timestamps: true // Automatically create `createdAt` and `updatedAt` fields
});

export default mongoose.model('Product', ProductSchema);
