import { INotification } from "../../../models/notification/notificationModel";
import { IUserProfile } from "../../../models/usermodel/userProfileModel";
import { IWallet } from "../../../models/usermodel/walletModel";
import { IBaseRepository } from "../../baserepo/IbaseRepo";

export interface IProfileRepositer extends IBaseRepository<IUserProfile> {
     create(date:Partial<IUserProfile>):Promise<IUserProfile>;
     findByUserId(userId:string):Promise<IUserProfile | null> 
     updateProfile(userId:string,profileData:Partial<IUserProfile>):Promise<IUserProfile | null>;
     getWalletBalance(userId:string):Promise<IWallet | null>
     getNotifications(userId:string):Promise<INotification[] | null>
}


