import { IHotelProfile } from "../../../models/hotelModel/hotelProfileModel"
import {IProductsDetails } from "../../../models/hotelModel/productModel"
import { IOrder } from "../../../models/usermodel/orderModel"
import { IOrderHistory } from "../../user/IOrderHistory"


export interface IProfileHotelService {
   getHotelProfile(hotelId:string):Promise<IHotelProfile | null> 
   updateHotelProfile(userId:string,profileData:Partial<IHotelProfile>):Promise<IHotelProfile | null>
   reqRequstProfile(id:string):Promise<IHotelProfile | null>
   changePassword(id:string,currentPasswords:string,newPassword:string,confirmPassword:string):Promise<{status:number,message:string}>
   addProducts(hotelId:string,products:IProductsDetails[]):Promise<{status:number,message:string}>
   getAllMenu(userId:string):Promise<IProductsDetails[] | null>
   getOrderList(hotelId:string):Promise<IOrder[] | undefined>
   updateOrderStatus(orderId:string,userId:string,orderStatus:string):Promise<{status:number,message:string}>
   deleteProducts(producId:string):Promise<{status:number,message:string}>
   updatedProducts(updatedProductsData:IProductsDetails,productId:string,hotelId:string):Promise<Object | null>
}