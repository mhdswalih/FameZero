import { Messages } from "../../constants/Messeges";
import { IProfileRepositer } from "../../interfaces/user/profile/IProfileRepository";
import { User } from "../../models/usermodel/userModel";
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
 async updateProfile(
  userId: string, 
  profileData: Partial<IUserProfile>
): Promise<IUserProfile> {
  try { 
    // Validate userId exists
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Prepare update object
    const updateProfile = {
      name: profileData.name,
      email: profileData.email,
      profilepic: profileData.profilepic,
      city: profileData.city,
      address: profileData.address,
      phone: profileData.phone
    };
    
    // Perform update and return the updated document
    const updatedProfile = await this.model.updateOne(
      { userId },
      { $set: updateProfile },
    );
    const updaUser = await User.findByIdAndUpdate(userId,{email:updateProfile.email})
    // if (updatedProfile.modifiedCount <  0) {
    //   throw new Error(`Profile Alredyy updated`);
    // }

    const newProfile = await this.model.findOne({userId})

    return newProfile as IUserProfile;
  } catch (error: any) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }
}
}