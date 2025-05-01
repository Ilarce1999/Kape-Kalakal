import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  drinkName: {  
    type: String,
    required: true,
  },
  size: {
    type: String,
    enum: ['Small', 'Medium', 'Large'],
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
    min: 0,
  },
  orderedBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true
});

export default mongoose.model('Order', OrderSchema);
