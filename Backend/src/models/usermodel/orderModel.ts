import mongoose, { Schema } from "mongoose";
import { IUser } from "./userModel";
import { ICart } from "./cartModel";
import { IProducts, IProductsDetails } from "../hotelModel/productModel";

export interface IOrder {
    userId: mongoose.Types.ObjectId | IUser;
    cartId: mongoose.Types.ObjectId | ICart
    products: {
        productId: mongoose.Types.ObjectId | IProducts
        productDetails?: IProductsDetails;
    }[]
    orderData: Date;
    totalAmount:number;
    orderStatus: string;
    selectedPaymentMethod: string;
    paymentStatus: string;
}

const orderSchema = new mongoose.Schema<IOrder>({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cartId: {
        type: Schema.Types.ObjectId,
        ref: 'Cart',
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
        }
    ],
    orderData: {
        type: Date,
        default: Date.now
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Deliverd']
    },
    selectedPaymentMethod: {
        type: String,
        enum: ['Online', 'Cod']
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Failed', 'Success']
    },

})

const Order = mongoose.model<IOrder>('Order', orderSchema)
export default Order