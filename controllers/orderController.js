import OrderModel from '../models/OrderModel.js';
import ProductModel from '../models/productModel.js';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';

// controllers/orderController.js
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
  const { items, email, subtotal, deliveryFee, total, status } = req.body;

  if (!email || !items || items.length === 0 || !subtotal || subtotal <= 0 || !deliveryFee || deliveryFee < 0 || !total || total <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid order data' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Check if products are available in stock
    for (let item of items) {
      const product = await ProductModel.findById(item.productId).session(session);
      if (!product) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: `Product with ID ${item.productId} does not exist.` });
      }

      if (product.stock < item.quantity) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: `Insufficient stock for product ${product.name}.` });
      }

      // Decrease stock after successful order creation
      product.stock -= item.quantity;
      await product.save({ session });
    }

    const userId = req.user?.userId;
    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'User ID is required.' });
    }

    const order = new OrderModel({
      userId,
      email,
      items,
      subtotal,
      deliveryFee,
      total,
      status: status || 'Pending',
    });

    await order.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(StatusCodes.CREATED).json({ msg: 'Order created successfully', order });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error creating order:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Error creating order.',
      error: error.message,
    });
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

    // Fetch and populate product details inside items array
    const orders = await OrderModel.find({ userId })
      .sort({ createdAt: -1 })
      .populate('items.productId'); // This populates each productId with product data

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
  const { items, subtotal, deliveryFee, total, status } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = await OrderModel.findById(id);

    if (!order || order.userId.toString() !== req.user.userId) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Order not found or unauthorized.' });
    }

    // Check product stock for updates (if items or quantity changes)
    if (items) {
      for (let item of items) {
        const product = await ProductModel.findById(item.productId).session(session);
        if (!product) {
          return res.status(StatusCodes.BAD_REQUEST).json({ msg: `Product with ID ${item.productId} does not exist.` });
        }

        if (product.stock < item.quantity) {
          return res.status(StatusCodes.BAD_REQUEST).json({ msg: `Insufficient stock for product ${product.name}.` });
        }

        // Decrease stock after update (optional: ensure you restore old stock first)
        product.stock -= item.quantity;
        await product.save({ session });
      }
    }

    order.items = items || order.items;
    order.subtotal = subtotal || order.subtotal;
    order.deliveryFee = deliveryFee || order.deliveryFee;
    order.total = total || order.total;
    order.status = status || order.status;

    const updatedOrder = await order.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(StatusCodes.OK).json(updatedOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Error updating order.',
      error: error.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = await OrderModel.findById(id);

    if (!order || order.userId.toString() !== req.user.userId) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Order not found or unauthorized.' });
    }

    // Restore stock for deleted order (if necessary)
    for (let item of order.items) {
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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Error deleting order.',
      error: error.message,
    });
  }
};
