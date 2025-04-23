import OrderModel from '../models/OrderModel.js';
import { StatusCodes } from 'http-status-codes';


export const getAllDrinks = async (req, res, next) => {
  try {
    const orders = await OrderModel.find({});
    res.status(StatusCodes.OK).json({ drinks: orders });
  } catch (error) {
    next(error);
  }
};

export const createDrink = async (req, res, next) => {
  const { drinkName, size} = req.body;

  if (!drinkName || !size) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide drinkName and size' });
  }

  try {
    const order = await OrderModel.create({ drinkName, size});
    res.status(StatusCodes.CREATED).json({ msg: 'Drink added', order });
  } catch (error) {
    next(error);
  }
};

export const getDrink = async (req, res, next) => {
 // const { id } = req.params;

  try {
    const drink = await OrderModel.findById(req.params.id);

   {/*  if (!drink) {
      throw new NotFoundError(`No drink with id ${id}`);
    } */}

    res.status(StatusCodes.OK).json({ drink });
  } catch (error) {
    next(error);
  }
};

export const editDrink = async (req, res, next) => {
  const { drinkName, size} = req.body;
  const { id } = req.params;

  if (!drinkName || !size) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide drink name and size' });
  }

  try {
    const updatedDrink = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { drinkName, size},
      { new: true, runValidators: true }
    );

  {/*   if (!updatedDrink) {
      throw new NotFoundError(`No drink with id ${id}`);
    } */}

    res.status(StatusCodes.OK).json({ msg: 'Order modified', drink: updatedDrink });
  } catch (error) {
    next(error);
  }
};

export const deleteDrink = async (req, res, next) => {


  try {
    const deletedDrink = await OrderModel.findByIdAndDelete(req.params.id);

  {/* }   if (!deletedDrink) {
      throw new NotFoundError(`No drink with id ${id}`);
    } */}

    res.status(StatusCodes.OK).json({ msg: 'Drink deleted' });
  } catch (error) {
    next(error);
  }
};
