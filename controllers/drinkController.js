import OrderModel from '../models/OrderModel.js'



    export const getAllDrinks = async (req, res) => {
    try {
        const orders = await OrderModel.find({});
        res.status(200).json({ drinks: orders });
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};


export const createDrink = async (req, res) => {
    const { drinkName, size, price } = req.body;
    if (!drinkName || !size || !price) {
      return res.status(400).json({ msg: 'Please provide drinkName, size, and price' });
    }
  
    const order = await OrderModel.create({ drinkName, size, price });
    res.status(201).json({ msg: 'Drink added', order });
  };
  

  export const getDrink = async (req, res) => {
    const { id } = req.params;

    try {
        const drink = await OrderModel.findById(id);

        if (!drink) {
            return res.status(404).json({ msg: `No drink with id ${id}` });
        }

        res.status(200).json({ drink });
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};


export const editDrink = async (req, res) => {
    const { drinkName, size, price } = req.body;
    const { id } = req.params;

    if (!drinkName || !size || !price) {
        return res.status(400).json({ msg: 'Please provide drink name, size, and price' });
    }

    try {
        const updatedDrink = await OrderModel.findByIdAndUpdate(
            id,
            { drinkName, size, price },
            { new: true, runValidators: true }
        );

        if (!updatedDrink) {
            return res.status(404).json({ msg: `No drink with id ${id}` });
        }

        res.status(200).json({ msg: 'Order modified', drink: updatedDrink });
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

export const deleteDrink = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedDrink = await OrderModel.findByIdAndDelete(id);

        if (!deletedDrink) {
            return res.status(404).json({ msg: `No drink with id ${id}` });
        }

        res.status(200).json({ msg: 'Drink deleted' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

