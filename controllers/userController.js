import { StatusCodes } from "http-status-codes";
import bcrypt from 'bcryptjs';
import User from '../models/UserModel.js';
import Order from '../models/OrderModel.js';

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userId }).select('-password');
    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
};

export const getAppStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const orders = await Order.countDocuments();
    res.status(StatusCodes.OK).json({ users, orders });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Error fetching stats" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const obj = { ...req.body };
    delete obj.password;

    const updatedUser = await User.findByIdAndUpdate(req.user.userId, obj, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.status(StatusCodes.OK).json({ user: updatedUser });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Error updating user' });
  }
};

// Super Admin Data Access
export const getSuperAdminData = async (req, res) => {
  try {
    const allUsers = await User.find({}, 'name email role createdAt');
    const totalUsers = allUsers.length;
    res.status(StatusCodes.OK).json({
      totalUsers,
      users: allUsers,
      message: 'Super admin access granted'
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Error fetching data' });
  }
};

// Fetch all users (excluding password)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Failed to fetch users' });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email, location, password, role } = req.body;
    const newUser = await User.create({ name, email, location, password, role });
    res.status(StatusCodes.CREATED).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      location: newUser.location,
      role: newUser.role,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Error creating user' });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
    }
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
};

// Update user by ID
export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { name, email, location, role, password } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.location = location || user.location;
    user.role = role || user.role;

    if (password) {
      if (password.length < 6) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Password must be at least 6 characters' });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(StatusCodes.OK).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      role: user.role,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating user' });
  }
};

// Delete user by ID
export const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found' });
    }
    res.status(StatusCodes.OK).json({ msg: 'User deleted successfully' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Server error' });
  }
};
