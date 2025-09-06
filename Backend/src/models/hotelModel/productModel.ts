import mongoose, { Schema,Document } from "mongoose";
import { IHotelProfile } from "./hotelProfileModel";

export interface IProductsDetails {
  _id:string;
  category: string,
  productName: string,
  price: number,
  quantity: number,
}

export interface IProducts extends Document {
  hotelId: Schema.Types.ObjectId | IHotelProfile;
  productDetails: IProductsDetails[];
}

const productDetailsSchema = new mongoose.Schema<IProductsDetails>({
  category: { type: String, required: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
})

const productSchema = new Schema<IProducts>({
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: 'hotelProfile',
    required: true
  },
  productDetails: { type: [productDetailsSchema], required: true },
})

const Product = mongoose.model<IProducts>('Products', productSchema);

export default Product