import { IProductsDetails } from "../../../models/hotelModel/productModel"
import { ICart } from "../../../models/usermodel/cartModel"
import { IOrder } from "../../../models/usermodel/orderModel"
import { IOrderHistory } from "../IOrderHistory"



export interface IProductService {
  addToCart(productId:string,userId:string,hotelId:string):Promise<{status:number,message:string}>
  getCart(userId:string):Promise<{status:number,message:string,data:IProductsDetails[] | null}>
  removeFromCart(productId:string,userId:string):Promise<{status:number,message:string}>
  updateStockInCart(userId:string,productId:string,action:"increment" | "decrement"):Promise<{status:number,updatedQuantity:Object}>
  getCheckOut(userId:string):Promise<{status:number,checkOutDetails:ICart[] | null}>
  createOrder(userId:string,paymentMetherd:string,selectedDeliveryOption:string):Promise<{status:number,message:string,totalAmount:number | undefined ;orderId:string }>
  updatePayementStatus(orderId:string,paymentStatus:string, paypalOrderId:string):Promise<{status:number,message:string,updatedStatus:Object}>
  getOrderHistory(userId:string):Promise<{orderDetails : IOrderHistory[] | null}>
  rePayOrder(orderId:string):Promise<{status:number,message:string,payementStatus:Object | null}>
  rePayUpdateStatus(orderId:string,payementStatus:string):Promise<{status:number,message:string,updatedStatus:Object | null}>
  getOrderDetails(orderId:string):Promise<{status:number,message:string,orderDetails : IOrderHistory[] | null}>
  canceOrder(orderId:string,userId:string):Promise<{status:number,messege:string}>
} 