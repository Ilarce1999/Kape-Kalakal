// controllers/orderController.js
import OrderModel from '../models/OrderModel.js';
import { StatusCodes } from 'http-status-codes';

// Get all orders (for the logged-in user or all if admin logic is added later)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({ orderedBy: req.user.userId });
    res.status(StatusCodes.OK).json(orders);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Error fetching orders.',
      error: error.message
    });
  }
};

// Create a new order
export const createOrder = async (req, res) => {
  const { drinkName, size, quantity, totalPrice } = req.body;

  try {
    const newOrder = new OrderModel({
      drinkName,
      size,
      quantity,
      totalPrice,
      orderedBy: req.user.userId
    });

    await newOrder.save();
    res.status(StatusCodes.CREATED).json(newOrder);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Error creating order.',
      error: error.message
    });
  }
};

// Get a specific order by ID
export const getOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await OrderModel.findById(id);

    if (!order || order.orderedBy.toString() !== req.user.userId) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Order not found.' });
    }

    res.status(StatusCodes.OK).json(order);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Error fetching order.',
      error: error.message
    });
  }
};

// Edit an existing order
export const editOrder = async (req, res) => {
  const { id } = req.params;
  const { drinkName, size, quantity, totalPrice } = req.body;

  try {
    const order = await OrderModel.findById(id);

    if (!order || order.orderedBy.toString() !== req.user.userId) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Order not found or unauthorized.' });
    }

    // Update order fields with the new values
    order.drinkName = drinkName || order.drinkName;
    order.size = size || order.size;
    order.quantity = quantity || order.quantity;
    order.totalPrice = totalPrice || order.totalPrice;

    const updatedOrder = await order.save();

    res.status(StatusCodes.OK).json(updatedOrder);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Error updating order.',
      error: error.message
    });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await OrderModel.findById(id);

    if (!order || order.orderedBy.toString() !== req.user.userId) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Order not found or unauthorized.' });
    }

    await order.deleteOne();

    res.status(StatusCodes.OK).json({ msg: 'Order deleted successfully.' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Error deleting order.',
      error: error.message
    });
  }
};