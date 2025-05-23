import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    email: {
      type: String,
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
    },
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
    deliveryStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Unpaid'],
      default: 'Unpaid',
    },
    paymentMethod: {
      type: String,
      enum: ['PayPal', 'GCash', 'COD'],
      required: true,
      default: 'COD',
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', OrderSchema);
