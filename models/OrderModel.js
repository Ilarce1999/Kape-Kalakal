import mongoose from 'mongoose';

// Order Schema
const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,  // Assuming this is a string (could be ObjectId if you are referencing a User model)
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,  // Referencing the Product model
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      totalPrice: {
        type: Number,
        required: true,
      },
    }
  ],
  subtotal: {
    type: Number,
    required: true,
  },
  deliveryFee: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: 'Pending',  // Can be 'Pending', 'Shipped', 'Delivered', etc.
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the model
export default mongoose.model('Order', OrderSchema);
