import { IHotelProfile, IReview } from "../../../models/hotelModel/hotelProfileModel";
import { IProducts, IProductsDetails } from "../../../models/hotelModel/productModel";
import { IHotelFullProfile } from "../../../repositories/hotelRepository/hotelInterface";
import { IBaseRepository } from "../../baserepo/IbaseRepo";

export interface IProfileHotelRepositer extends IBaseRepository<IHotelProfile> {
     create(date:Partial<IHotelProfile>):Promise<IHotelProfile>;
     findByHotelId(userId:string):Promise<IHotelProfile | null> 
     updateHotelProfile(userId:string,profileData:Partial<IHotelProfile>):Promise<IHotelProfile | null>;
     reRequstHotelProfile(id:string):Promise<IHotelProfile | null>;
     addProducts(hotelId:string,newProduct:IProductsDetails[]):Promise<IProducts>
     getAllMenu(userId:string):Promise<IProductsDetails[] | null>
     getHotelDetails(hotelId:string):Promise<IHotelFullProfile[] | null>
     ratingAndReview(hotelId:string,review:IReview[]):Promise<IHotelProfile | undefined>  
}


