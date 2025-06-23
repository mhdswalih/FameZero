import { Messages } from "../../constants/Messeges";
import { IProfileRepositer } from "../../interfaces/user/profile/IProfileRepository";
import Profile, { IUserProfile } from "../../models/usermodel/userProfileModel";
import { BaseRepository } from "./baseRepository";

export class ProfileRepository extends BaseRepository<IUserProfile> implements IProfileRepositer {
    constructor(){
        super(Profile)
    }
    async create(data: Partial<IUserProfile>): Promise<IUserProfile> { 
        return await this.model.create(data)
    };
    async findByUserId(userId: string): Promise<IUserProfile | null>  {
         const profile = await this.model.findOne({ userId })
                .populate({
                    path: 'userId',
                    select: 'email', 
                    model: 'users' 
                })
                .exec(); 
        return profile
        
    };
   async updateProfile(userId: string, profileData: Partial<IUserProfile>): Promise<IUserProfile | null> {
       try { 
           const existingProfile = await this.model.findOne({userId})
            const updateProfile = {
                name : profileData.name,
                profilepic: profileData.profilepic,
                city:profileData.city,
                address1:profileData.address1,
                address2:profileData.address2,
                zipcode:profileData.zipcode,
                phone:profileData.phone

            }
              return await this.model.findOneAndUpdate(
            { userId }, 
            { $set: updateProfile },
            { new: true, upsert: true, runValidators: true }
        );
       } catch (error:any) {
         throw new Error(error)
       }
   }
}