import { IProductsDetails } from "../../../models/hotelModel/productModel"
import { ICart } from "../../../models/usermodel/cartModel"

export interface IProductService {
  addToCart(productId:string,userId:string,hotelId:string):Promise<{status:number,message:string}>
  getCart(userId:string):Promise<{status:number,message:string,data:IProductsDetails[] | null}>
  removeFromCart(productId:string,userId:string):Promise<{status:number,message:string}>
  updateStockInCart(userId:string,productId:string,action:"increment" | "decrement"):Promise<{status:number,updatedQuantity:Object}>
  getCheckOut(userId:string):Promise<{status:number,checkOutDetails:ICart[] | null}>
  createOrder(userId:string):Promise<{status:number,message:string}>

} 