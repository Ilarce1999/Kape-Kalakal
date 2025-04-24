import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  drinkName: {
    type: String
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large'], // Replace with your actual size values
    default: 'small',
  },
  orderedBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User'  // Ensure this references your 'User' model
  }
}, {
  timestamps: true
});

export default mongoose.model('Order', OrderSchema);
