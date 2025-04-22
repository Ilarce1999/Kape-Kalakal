import OrderModel from '../models/OrderModel.js'
import { nanoid } from "nanoid";

//Drinks Array
    let drinks = [
    {id:nanoid(), drinkName:'cappucino', size:'large', price:'140'},
    {id:nanoid(), drinkName:'espresso', size:'medium', price:'120'}
];  

export const getAllDrinks = async (req, res) =>{
    res.status(200).json({ drinks })
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
    const drink = drinks.find((drink) => drink.id === id);
    if(!drink){
       {/* } throw new Error('no job with that id'); */}
        return res.status(404).json({msg: `no drink with id ${id}`});
    }

    res.status(200).json({ drink });
};

export const editDrink = async (req, res) => {
    const { drinkName, size, price} = req.body;
    if(!drinkName || !size || !price)
    {
        return res.status(400).json({ msg: 'please provide drink name, size and price' });
    }
      const { id } = req.params;
      const drink = drinks.find((drink) => drink.id === id);
      if (!drink)
      {
        return res.status(404).json({ msg: `no job with id ${id}` });

      }

      drink.drinkName = drinkName;
      drink.size = size;
      drink.price = price;
      res.status(200).json({ msg: 'order modified', drink});
};

export const deleteDrink = async (req, res) => {
    const { id } = req.params;
    const drink = drinks.find((drink) => drink.id === id);
    if(!drink)
    {
        return res.status(404).json({ msg: `no job with id ${id}` });
    }

    const newDrink = drinks.filter((drink) => drink.id !== id);
    drinks = newDrink;

    res.status(200).json({ msg: 'drink deleted'});
};
