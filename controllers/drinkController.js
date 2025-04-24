import OrderModel from '../models/OrderModel.js';
import { StatusCodes } from 'http-status-codes';


export const getAllDrinks = async (req, res) => {
  //console.log(req.user);
  const orders = await OrderModel.find({orderedBy:req.user.userId});
  res.status(StatusCodes.OK).json({ orders });
};

export const createDrink = async (req, res) => {
  req.body.orderedBy = req.user.userId;
  const order = await OrderModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ order });
};

export const getDrink = async (req, res, next) => {
      const order = await OrderModel.findById(req.params.id);
      res.status(StatusCodes.OK).json({order});

};

export const editDrink = async (req, res, next) => {
    const updatedOrder = await OrderModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(StatusCodes.OK).json({msg: 'order modified', order: updatedOrder});
};

export const deleteDrink = async (req, res) => {
    const removedOrder = await OrderModel.findByIdAndDelete(req.params.id);
    res.status(StatusCodes.OK).json({msg: 'order deleted', drink: removedOrder});
};