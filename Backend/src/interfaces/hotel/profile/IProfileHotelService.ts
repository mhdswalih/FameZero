import { IHotelProfile } from "../../../models/hotelModel/hotelProfileModel"
import {IProductsDetails } from "../../../models/hotelModel/productModel"


export interface IProfileHotelService {
   getHotelProfile(hotelId:string):Promise<IHotelProfile | null> 
   updateHotelProfile(userId:string,profileData:Partial<IHotelProfile>):Promise<IHotelProfile | null>
   reqRequstProfile(id:string):Promise<IHotelProfile | null>
   changePassword(id:string,currentPasswords:string,newPassword:string,confirmPassword:string):Promise<{status:number,message:string}>
   addProducts(hotelId:string,products:IProductsDetails[]):Promise<{status:number,message:string}>
   getAllMenu(userId:string):Promise<IProductsDetails[] | null>
}