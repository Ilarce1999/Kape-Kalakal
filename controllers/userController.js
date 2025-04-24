import { StatusCodes } from "http-status-codes";
import User  from '../models/UserModel.js';
import Order from '../models/OrderModel.js';
import OrderModel from "../models/OrderModel.js";

export const getCurrentUser = async (req, res) =>{
    const user = await User.findOne({_id:req.user.userId});
    const userwithoutPassword = user.toJSON();
    res.status(StatusCodes.OK).json({ user: userwithoutPassword });
};

export const getAppStats = async (req, res) => {
    const users = await User.countDocuments()
    const orders = await Order.countDocuments();
    res.status(StatusCodes.OK).json({ users, orders })
};

export const updateUser = async (req, res) => {
    const obj = {...req.body};
    delete obj.password
    console.log(obj);
    
    const updateUser = await User.findByIdAndUpdate(req.user.userId, obj);
    res.status(StatusCodes.OK).json({msg: 'update user'})
};
