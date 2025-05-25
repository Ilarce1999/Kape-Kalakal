import OrderModel from '../models/OrderModel.js';
import ProductModel from '../src/models/ProductModel.js';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';

// Helper to fix paymentMethod capitalization for enum
const normalizePaymentMethod = (method) => {
  if (!method) return 'COD'; // fallback default
  method = method.toLowerCase();
  if (method === 'paypal') return 'PayPal';
  if (method === 'gcash') return 'GCash';
  if (method === 'cod') return 'COD';
  return 'COD'; // fallback if invalid
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Error fetching orders.',
      error: error.message,
    });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { items, subtotal, deliveryFee, total, paymentMethod, address } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Items array is required and cannot be empty.' });
    }

    // Validate required fields
    if (!address || typeof address !== 'string' || address.trim() === '') {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Address is required.' });
    }
    if (subtotal === undefined || deliveryFee === undefined || total === undefined) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Subtotal, deliveryFee, and total are required.' });
    }

    // Normalize payment method to match schema enum
    const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod);

    // Get email: try req.user.email first, else fallback to req.body.email or fail
    const email = req.user.email || req.body.email;
    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Email is required.' });
    }

    const newOrder = new OrderModel({
      userId: req.user.userId,
      email,
      items,
      subtotal,
      deliveryFee,
      total,
      paymentMethod: normalizedPaymentMethod,
      address: address.trim(),
      deliveryStatus: 'Pending',
      paymentStatus: ['COD', 'cod'].includes(normalizedPaymentMethod) ? 'Unpaid' : 'Paid',
    });

    await newOrder.save();
    res.status(StatusCodes.CREATED).json(newOrder);
  } catch (error) {
    console.error('Failed to create order:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create order', error: error.message });
  }
};

export const getOrder = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid order ID' });
    }

    const order = await OrderModel.findOne({
      _id: id,
      userId: req.user.userId,
    });

    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Order not found or unauthorized' });
    }

    res.status(StatusCodes.OK).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Error fetching order.',
      error: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await OrderModel.find({ userId })
      .sort({ createdAt: -1 })
      .populate('items.productId'); // populate product details

    res.status(StatusCodes.OK).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Error fetching your orders.',
      error: error.message,
    });
  }
};

export const editOrder = async (req, res) => {
  const { id } = req.params;
  const {
    items,
    subtotal,
    deliveryFee,
    total,
    deliveryStatus,
    paymentStatus,
    address,
  } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await OrderModel.findById(id).session(session);

    if (!order || order.userId.toString() !== req.user.userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Order not found or unauthorized.' });
    }

    if (items) {
      // Restore stock from old items
      for (const oldItem of order.items) {
        const oldProduct = await ProductModel.findById(oldItem.productId).session(session);
        if (oldProduct) {
          oldProduct.stock += oldItem.quantity;
          await oldProduct.save({ session });
        }
      }

      // Check stock and reduce stock for new items
      for (const item of items) {
        const product = await ProductModel.findById(item.productId).session(session);
        if (!product) {
          await session.abortTransaction();
          session.endSession();
          return res.status(StatusCodes.BAD_REQUEST).json({ msg: `Product with ID ${item.productId} does not exist.` });
        }

        if (product.stock < item.quantity) {
          await session.abortTransaction();
          session.endSession();
          return res.status(StatusCodes.BAD_REQUEST).json({ msg: `Insufficient stock for product ${product.name}.` });
        }

        product.stock -= item.quantity;
        await product.save({ session });
      }

      order.items = items;
    }

    if (subtotal !== undefined) order.subtotal = subtotal;
    if (deliveryFee !== undefined) order.deliveryFee = deliveryFee;
    if (total !== undefined) order.total = total;
    if (deliveryStatus) order.deliveryStatus = deliveryStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (address) order.address = address;

    const updatedOrder = await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(StatusCodes.OK).json(updatedOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error updating order:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Error updating order.',
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { deliveryStatus, paymentStatus } = req.body;

  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { deliveryStatus, paymentStatus },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Order not found' });
    }

    res.status(StatusCodes.OK).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Error updating order status.',
      error: error.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await OrderModel.findById(id).session(session);

    if (!order || order.userId.toString() !== req.user.userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Order not found or unauthorized.' });
    }

    // Restore stock for deleted order items
    for (const item of order.items) {
      const product = await ProductModel.findById(item.productId).session(session);
      if (product) {
        product.stock += item.quantity;
        await product.save({ session });
      }
    }

    await order.deleteOne({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(StatusCodes.OK).json({ msg: 'Order deleted successfully.' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error deleting order:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Error deleting order.',
      error: error.message,
    });
  }
};
