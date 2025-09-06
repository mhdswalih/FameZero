import mongoose, { Document, Schema } from 'mongoose'
import { IUser } from './userModel'
import { IProductsDetails } from '../hotelModel/productModel'

interface ICart extends Document {
  userId: Schema.Types.ObjectId | IUser,
  products: {
    productId: mongoose.Types.ObjectId,
    productDetails?: IProductsDetails;
    quantity: number,
  }[]
}

const cartSchema = new mongoose.Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        productDetails: {
          category: String,
          productName: String,
          price: Number,
          quantity: Number
        },
        quantity: {
          type: Number,
          min: 1,
          default: 1,
          required: true
        }
      }
    ]

  },
  { timestamps: true }
);

// ✅ Optional: Prevent duplicate product per user
// cartSchema.index({ userId: 1, 'products.productId': 1 }, { unique: true });

const Cart = mongoose.model<ICart>('Cart', cartSchema)
export default Cart
