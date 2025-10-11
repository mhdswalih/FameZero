import mongoose, { Document, Schema } from 'mongoose'
import { IUser } from './userModel'
import { IProductsDetails } from '../hotelModel/productModel'

export interface ICart extends Document {
  userId: Schema.Types.ObjectId | IUser;
  hotelId: Schema.Types.ObjectId;
  products: {
    productId: Schema.Types.ObjectId | string; 
    productDetails: IProductsDetails;         
    cartQuantity: number;                      
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new mongoose.Schema<ICart>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  hotelId: { 
    type: Schema.Types.ObjectId, 
    ref: 'hotelProfile', 
    required: true 
  },
  products: [
    {
      productId: { 
        type: String, 
        required: true 
      }, 
      productDetails: {
        _id: { type: String },
        category: { type: String },
        productName: { type: String },
        price: { type: Number },
        quantity: { type: Number }
      },
      cartQuantity: { 
        type: Number, 
        default: 1, 
        min: 1 
      }
    }
  ]
}, { timestamps: true });

const Cart = mongoose.model<ICart>('Cart', cartSchema)
export default Cart