import OrderModel from '../models/OrderModel.js';
import { StatusCodes } from 'http-status-codes';

export const getAllDrinks = async (req, res) => {
  const orders = await OrderModel.find({ orderedBy: req.user.userId });
  res.status(StatusCodes.OK).json({ orders });
};

export const createDrink = async (req, res) => {
  req.body.orderedBy = req.user.userId;
  const order = await OrderModel.create(req.body);
  res.status(StatusCodes.CREATED).json(order); // ✅ Send raw order
};

export const getDrink = async (req, res) => {
  const order = await OrderModel.findById(req.params.id);
  res.status(StatusCodes.OK).json(order); // ✅ Send raw order
};

export const editDrink = async (req, res) => {
  try {
    const { id } = req.params;
    const { drinkName, size, quantity, totalPrice } = req.body;

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { drinkName, size, quantity, totalPrice },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json(updatedOrder); // ✅ Send raw updated order
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({ message: 'Error updating order' });
  }
};

export const deleteDrink = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await OrderModel.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(204).send(); // ✅ No content response
  } catch (error) {
    console.error('Error deleting order:', error);
    return res.status(500).json({ message: 'Error deleting order' });
  }

};
