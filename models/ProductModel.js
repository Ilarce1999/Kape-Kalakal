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
     type: String, 
     required: false ,
  }
}, {
  timestamps: true // This will create `createdAt` and `updatedAt` fields automatically
});

export default mongoose.model('Product', ProductSchema);