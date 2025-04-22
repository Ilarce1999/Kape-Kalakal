import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  drinkName: {
    type: String
  },
  size: {
    type: String
  },
  price: {
    type: Number
  },

}, 
   {
    timestamps:true
   }
);

export default mongoose.model('Order', OrderSchema);