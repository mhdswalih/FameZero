import { IProductsDetails } from "../../../models/hotelModel/productModel"

export interface IProductService {
  addToCart(productId:string,userId:string,hotelId:string):Promise<{status:number,message:string}>
  getCart(userId:string):Promise<{status:number,message:string,data:IProductsDetails[] | null}>
  removeFromCart(productId:string,userId:string):Promise<{status:number,message:string}>
  updateStockInCart(userId:string,productId:string,action:"increment" | "decrement"):Promise<{status:number,updatedQuantity:any}>
} 