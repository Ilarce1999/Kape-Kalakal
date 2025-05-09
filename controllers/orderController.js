import OrderModel from '../models/OrderModel.js';
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

  if (!email) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Email is required.' });
  }

  if (!items || items.length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'No items provided in order.' });
  }

  if (!subtotal || subtotal <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid subtotal value.' });
  }

  if (!deliveryFee || deliveryFee < 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid delivery fee.' });
  }

  if (!total || total <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid total value.' });
  }

  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'User ID is required.' });
    }

    const order = await OrderModel.create({
      userId,
      email,
      items,
      subtotal,
      deliveryFee,
      total,
      status: status || 'Pending',
    });

    res.status(StatusCodes.CREATED).json({ msg: 'Order created successfully', order });
  } catch (error) {
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

export const editOrder = async (req, res) => {
  const { id } = req.params;
  const { items, subtotal, deliveryFee, total, status } = req.body;

  try {
    const order = await OrderModel.findById(id);

    if (!order || order.userId.toString() !== req.user.userId) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Order not found or unauthorized.' });
    }

    order.items = items || order.items;
    order.subtotal = subtotal || order.subtotal;
    order.deliveryFee = deliveryFee || order.deliveryFee;
    order.total = total || order.total;
    order.status = status || order.status;

    const updatedOrder = await order.save();

    res.status(StatusCodes.OK).json(updatedOrder);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Error updating order.',
      error: error.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await OrderModel.findById(id);

    if (!order || order.userId.toString() !== req.user.userId) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Order not found or unauthorized.' });
    }

    await order.deleteOne();

    res.status(StatusCodes.OK).json({ msg: 'Order deleted successfully.' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Error deleting order.',
      error: error.message,
    });
  }
};
