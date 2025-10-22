import { HttpStatus } from "../../constants/HttpStatus";
import { Messages } from "../../constants/Messeges";
import { IHotelRepository } from "../../interfaces/hotel/IHotelRepository";
import { IProfileHotelRepositer } from "../../interfaces/hotel/profile/IProfileHotelRepository";
import { IUserRepository } from "../../interfaces/user/IUserRepository";
import { IProfileService } from "../../interfaces/user/profile/IProfileService";
import { IHotelProfile, IReview } from "../../models/hotelModel/hotelProfileModel";
import { INotification } from "../../models/notification/notificationModel";
import  {
  IUserProfile,
} from "../../models/usermodel/userProfileModel";
import { IWallet } from "../../models/usermodel/walletModel";
import { IHotelFullProfile } from "../../repositories/hotelRepository/hotelInterface";
import { ProfileRepository } from "../../repositories/userrepository/profileRepository";
import { comparePassword, hashPassword } from "../../utils/hashPassword";
import { createHttpError } from "../../utils/httperr";

export class ProfileService implements IProfileService {
  constructor(private _profileRepository: ProfileRepository, private _userRepository: IUserRepository,private _hotelRepository:IHotelRepository,private _hotelProfileRepostory:IProfileHotelRepositer) { }

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
  async changePassword(id: string, currentPasswords: string, newPassword: string, confirmPassword: string): Promise<{ status: number; message: string; }> {
    try {
      if (newPassword !== confirmPassword) {
        throw new Error(Messages.PASSWORD_NOT_MATCH);
      }
      const cleanedId = id.replace(/^:/, '');
      const user = await this._userRepository.findById(cleanedId);

      if (!user) {
        throw new Error(Messages.USER_NOT_FOUND);
      }
      // Check if the current password matches
      const isCurrentPasswordValid = await comparePassword(currentPasswords, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error(Messages.INVALID_CURRENT_PASSWORD);
      }
      if(user.password.length <= 0){
        throw new Error('You don’t have a password set. Please create a new password.')
      }
      // Check if new password is different from current password
      const isSamePassword = await comparePassword(newPassword, user.password);
      if (isSamePassword) {
        throw new Error('New password must be different from the current password');
      }

      // Hash and update the new password
      const hashedNewPassword = await hashPassword(newPassword);
      await this._userRepository.changePassword(cleanedId, hashedNewPassword);

      return { status: 200, message: "Password changed successfully" };
    } catch (error) {
      throw error
    }
  }
  async getHotels(): Promise<IHotelFullProfile[] | null> {
      try {
        return await this._hotelRepository.getAllHotelsInUserSide()
      } catch (error) {
        throw error
      }
  }
  async getHotelDetails(hotelId: string): Promise<IHotelFullProfile[] | null> {
      try {
        if(!hotelId){
          throw createHttpError(HttpStatus.BAD_REQUEST,Messages.USER_ID_REQUIRED)
        }
        return await this._hotelProfileRepostory.getHotelDetails(hotelId)
      } catch (error) {
       throw error
      }
  }
  async ratingAndReview(hotelId: string, review: IReview[]): Promise<IHotelProfile | undefined> {
      try {
        if(!hotelId){
          throw createHttpError(HttpStatus.BAD_REQUEST,Messages.USER_ID_REQUIRED)
        }
        return await this._hotelProfileRepostory.ratingAndReview(hotelId,review)
      } catch (error) {
        throw error
      }
  }
  async likeAndUnlike(reviewId:string,userId: string,hotelId:string): Promise<{ status: number; message: string; }> {
      try {
        if(!userId){
          throw createHttpError(HttpStatus.BAD_REQUEST,Messages.USER_ID_REQUIRED)
        }
        await this._hotelProfileRepostory.likeAndUnlike(reviewId,userId,hotelId)
        return {
          status : 200,
          message : 'Liked ..!'
        }
      } catch (error) {
        throw error
        
      }
  }
  async getWalletBalance(userId: string): Promise<IWallet | null> {
    try {
      if(!userId){
        throw createHttpError(HttpStatus.BAD_REQUEST,Messages.USER_ID_REQUIRED)
      }
      const wallet =  await this._profileRepository.getWalletBalance(userId)
      return wallet
    } catch (error) {
      throw error
    }
  }
  async getNotifications(userId: string): Promise<INotification[] | null> {
    try {
      if(!userId){
        throw createHttpError(HttpStatus.BAD_REQUEST,Messages.USER_ID_REQUIRED)
      }
      const notifications = await this._profileRepository.getNotifications(userId)
      return notifications
    } catch (error) {
      throw error
    }
  }
  async updateReviews(reviewId: string, hotelId: string, updateReviews: IReview[]): Promise<IReview | null> {
    try {
      if(!reviewId || !hotelId || !updateReviews){
        throw createHttpError(HttpStatus.BAD_REQUEST,Messages.INVALID_DATA_PROVIDED)
      }
      console.log(reviewId,hotelId,updateReviews,'THIS IS FROM SERVICE ');
      
      const updateReviewssDate = await this._hotelProfileRepostory.updateRreviews(reviewId,hotelId,updateReviews)
     return null
    } catch (error) {
      throw error
    }
  }
  async deleteReviews(reviewId: string, hotelId: string): Promise<{ status: number; message: string; }> {
    try {
      if(!reviewId || !hotelId){
        throw createHttpError(HttpStatus.BAD_REQUEST,Messages.INVALID_DATA_PROVIDED)
      }
       await this._hotelProfileRepostory.deleteReviews(reviewId,hotelId)
        return {status : 200,message : 'Review deleted successfully'}
      } catch (error) {
        throw error
    }
  }
}
