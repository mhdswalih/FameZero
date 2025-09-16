import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./userModel";
import { ICart } from "./cartModel";
import { IProducts, IProductsDetails } from "../hotelModel/productModel";
import { IHotelProfile } from "../hotelModel/hotelProfileModel";
import { IOrderHistory } from "../../interfaces/user/IOrderHistory";

export interface IOrder extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId | IUser;
  paypalOrderId?: string;
  cartId: mongoose.Types.ObjectId | ICart;
  hotelId: mongoose.Types.ObjectId | IHotelProfile;
  products: {
    productId: mongoose.Types.ObjectId;
    productDetails: IProductsDetails;
    cartQuantity: number;
  }[];
  orderDate: Date;
  totalAmount: number;
  orderStatus: "Pending" | "Delivered";
  selectedPaymentMethod: "Online" | "COD";
  paymentStatus: "Pending" | "Failed" | "Paid";
  orderMethod: "delivery" | "takeaway";
  orderHistory: IOrderHistory[];
}

// Order History Schema
const orderHistorySchema = new Schema<IOrderHistory>(
  {
    userId: { type: String, required: true },
    cartId: { type: String, required: true },
    productId: { type: String, required: true },
    category: { type: String, required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    cartQuantity: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    orderStatus: { type: String, required: true },
    selectedPaymentMethod: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    orderDate: { type: Date, default: Date.now },

    // Hotel profile fields
    hotelId: { type: String, required: true },
    hotelName: { type: String },
    hotelEmail: { type: String },
    hotelProfilePic: { type: String },
    hotelIdProof: { type: String },
    hotelStatus: { type: String },
    hotelLocation: { type: String },
    hotelCity: { type: String },
    hotelPhone: { type: String },
  },
  { _id: false }
);

// Order Schema
const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "HotelProfile",
      required: true,
    },
    cartId: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productDetails: {
          category: { type: String, required: true },
          productName: { type: String, required: true },
          price: { type: Number, required: true },
          quantity: { type: Number, required: true },
        },
        cartQuantity: { type: Number, required: true },
      },
    ],
    orderDate: {
      type: Date,
      default: Date.now,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Delivered"],
      default: "Pending",
    },
    selectedPaymentMethod: {
      type: String,
      enum: ["Online", "COD"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Failed", "Paid"],
      default: "Pending",
    },
    paypalOrderId: {
      type: String,
    },
    orderMethod: {
      type: String,
      enum: ["delivery", "takeaway"],
      required: true,
    },
    orderHistory: [orderHistorySchema],
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
