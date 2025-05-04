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
    const { id } = req.params;
    console.log("Looking up user ID:", id);
    const user = await User.findById(id);
    if (!user) {
      console.log("User not found for ID:", id);
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("getUserById error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};


// Update user by ID
export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { name, email, location, role, password } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields, don't update password unless provided
    user.name = name || user.name;
    user.email = email || user.email;
    user.location = location || user.location;
    user.role = role || user.role;

    // Only update password if it's provided
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      // Hash the new password
      user.password = await bcrypt.hash(password, 10);
    }

    // Save the updated user
    await user.save();

    // Return the updated user
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      role: user.role,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller for deleting user hard
export const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json({ msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};



 