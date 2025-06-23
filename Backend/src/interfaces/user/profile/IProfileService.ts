import { IUserProfile } from "../../../models/usermodel/userProfileModel";


export interface IProfileService {
   getProfile(userId:string):Promise<IUserProfile | null> 
   updateUserProfile(userId:string,profileData:Partial<IUserProfile>):Promise<IUserProfile | null>
}