import { StatusCodes } from "http-status-codes";
import User from '../models/UserModel.js';
import Order from '../models/OrderModel.js';


export const getCurrentUser = async (req, res) => {
    const user = await User.findOne({ _id: req.user.userId });
    const userwithoutPassword = user.toJSON();
    res.status(StatusCodes.OK).json({ user: userwithoutPassword });
};

export const getAppStats = async (req, res) => {
    const users = await User.countDocuments();
    const orders = await Order.countDocuments();
    res.status(StatusCodes.OK).json({ users, orders });
};

export const updateUser = async (req, res) => {
    const obj = { ...req.body };
    delete obj.password;
    console.log(obj);

    const updateUser = await User.findByIdAndUpdate(req.user.userId, obj);
    res.status(StatusCodes.OK).json({ msg: 'update user' });
};

// Super Admin Data Access
export const getSuperAdminData = async (req, res) => {
    const allUsers = await User.find({}, 'name email role createdAt'); // only select needed fields
    const totalUsers = allUsers.length;

    res.status(StatusCodes.OK).json({
        totalUsers,
        users: allUsers,
        message: 'Super admin access granted'
    });
};

// Controller to fetch all users
export const getAllUsers = async (req, res) => {
    try {
      // Exclude the password field using .select('-password')
      const users = await User.find().select('-password');
  
      res.status(200).json(users); // Send only safe fields
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  };
  
  // Create user
  export const createUser = async (req, res) => {
    const { name, email, location, password, role } = req.body;
    const newUser = await User.create({ name, email, location, password, role });
    res.status(StatusCodes.CREATED).json(newUser);
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch user' });
  }
};
  
export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    // Only hash the password if it's being updated
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(req.body.password, salt);
    }

    const updated = await User.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updated) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Failed to update user' });
  }
};

  
  // Soft delete user by ID
    export const deleteUserById = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Failed to delete user' });
    }
  };

 