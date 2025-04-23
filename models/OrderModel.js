import mongoose from "mongoose";
import { SIZE } from "../utils/constants.js";

const OrderSchema = new mongoose.Schema({
  drinkName: {
    type: String
  },
  size: {
    type: String,
    enum: Object.values(SIZE),
    default: 'regular',
  },
}, 
   {
    timestamps:true
   }
);

export default mongoose.model('Order', OrderSchema);