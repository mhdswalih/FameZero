import { Messages } from "../../constants/Messeges";
import { IProfileService } from "../../interfaces/user/profile/IProfileService";
import { IUserProfile } from "../../models/usermodel/userProfileModel";
import { ProfileRepository } from "../../repositories/userrepository/profileRepository";



export class ProfileService implements IProfileService {
    constructor(private _profileRepository:ProfileRepository){}
    async getProfile(userId: string): Promise<IUserProfile | null> { 
        return await this._profileRepository.findByUserId(userId);
    }
    async updateUserProfile(userId: string, profileData: Partial<IUserProfile>): Promise<IUserProfile | null> {        
        if(!userId){
            throw new Error(Messages.USER_ID_REQUIRED)
        }
        return await this._profileRepository.updateProfile(userId,profileData)
    }
}