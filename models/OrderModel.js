import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: {
    type: String, 
  },
  email: {
    type: String,
  },
  items: [Object],
  subtotal: Number,
  deliveryFee: Number,
  total: Number,
  status: {
    type: String,
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});
export default mongoose.model('Order', OrderSchema);
