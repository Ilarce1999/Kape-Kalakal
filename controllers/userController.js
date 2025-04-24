import { StatusCodes } from "http-status-codes";
import User  from '../models/UserModel.js';
import Order from '../models/OrderModel.js';

export const getCurrentUser = async (req, res) =>{
    const user = await User.findOne({_id:req.user.userId});
    const userwithoutPassword = user.toJSON();
    res.status(StatusCodes.OK).json({ user: userwithoutPassword });
};

export const getAppStats = async (req, res) => {
    res.status(StatusCodes.OK).json({msg:'application stats'})
};

export const updateUser = async (req, res) => {
    res.status(StatusCodes.OK).json({msg: 'update user'})
};
