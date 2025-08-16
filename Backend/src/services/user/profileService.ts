import { Messages } from "../../constants/Messeges";
import { IUserRepository } from "../../interfaces/user/IUserRepository";
import { IProfileService } from "../../interfaces/user/profile/IProfileService";
import userProfile, {
  IUserProfile,
} from "../../models/usermodel/userProfileModel";
import { ProfileRepository } from "../../repositories/userrepository/profileRepository";

export class ProfileService implements IProfileService {
  constructor(private _profileRepository: ProfileRepository,private _userRepository:IUserRepository) {}
  
  async getProfile(userId: string): Promise<IUserProfile | null> {
    return await this._profileRepository.findByUserId(userId);
  }
  
  async updateUserProfile(
    userId: string,
    profileData: Partial<IUserProfile>
  ): Promise<IUserProfile> {
    try {
      // Validate inputs
      if (!userId) {
        throw new Error(Messages.USER_ID_REQUIRED);
      }

      // Validate profile data structure
      if (!profileData || typeof profileData !== "object") {
        throw new Error(Messages.INVALID_DATA_PROVIDED);
      }

      // Update profile
      const updatedProfile = await this._profileRepository.updateProfile(
        userId,
        profileData
      );
      if (profileData.email) {
        await this._userRepository.updateEmail(userId, profileData.email);
      }
      if (!updatedProfile) {
        throw new Error(Messages.USER_NOT_FOUND);
      }

      return updatedProfile;
    } catch (error) {
      console.error(`Failed to update profile for user ${userId}:`, error);
      throw error;
    }
  }
}
