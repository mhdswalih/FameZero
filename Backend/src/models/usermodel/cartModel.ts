import mongoose, { Document, Schema } from 'mongoose'
import { IUser } from './userModel'
import { IProductsDetails } from '../hotelModel/productModel'


export interface ICart extends Document {
  userId: Schema.Types.ObjectId | IUser;
  hotelId: Schema.Types.ObjectId;
  products: {
    productId: mongoose.Types.ObjectId; 
    productDetails: IProductsDetails;         
    cartQuantity: number;                      
  }[];
}


const cartSchema = new mongoose.Schema<ICart>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hotelId: { type: Schema.Types.ObjectId, ref: 'hotelProfile', required: true },
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref:'Product' ,required: true }, 
      productDetails: {
        category: String,
        productName: String,
        price: Number,
        quantity: Number
      },
      cartQuantity: { type: Number, default: 1, min: 1 }
    }
  ]
}, { timestamps: true });

// ✅ Optional: Prevent duplicate product per user
// cartSchema.index({ userId: 1, 'products.productId': 1 }, { unique: true });

const Cart = mongoose.model<ICart>('Cart', cartSchema)
export default Cart
