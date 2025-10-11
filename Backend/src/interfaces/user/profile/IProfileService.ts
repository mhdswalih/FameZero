import { IHotelProfile, IReview } from "../../../models/hotelModel/hotelProfileModel";
import { IUserProfile } from "../../../models/usermodel/userProfileModel";
import { IHotelFullProfile } from "../../../repositories/hotelRepository/hotelInterface";


export interface IProfileService {
   getProfile(userId:string):Promise<IUserProfile | null> 
   updateUserProfile(userId:string,profileData:Partial<IUserProfile>):Promise<IUserProfile | null>
   changePassword(id:string,currentPasswords:string,newPassword:string,confirmPassword:string):Promise<{status:number,message:string}>
   getHotels():Promise<IHotelFullProfile[] | null>
   getHotelDetails(hotelId:string):Promise<IHotelFullProfile[] | null>
   ratingAndReview(hotelId:string,review:IReview[]):Promise<IHotelProfile | undefined>
   likeAndUnlike(reviewId:string,userId:string,hotelId:string):Promise<{status:number,message:string}>
}