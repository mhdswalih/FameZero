import { Messages } from "../../constants/Messeges";
import { IProfileHotelRepositer } from "../../interfaces/hotel/profile/IProfileHotelRepository";
import { IProfileHotelService } from "../../interfaces/hotel/profile/IProfileHotelService";
import { IUserRepository } from "../../interfaces/user/IUserRepository";
import { IHotelProfile } from "../../models/hotelModel/hotelProfileModel";
import { comparePassword, hashPassword } from "../../utils/hashPassword";



export class HotelProfileService implements IProfileHotelService {
    constructor(private _hotelProfileRepository: IProfileHotelRepositer, private _userRepository: IUserRepository) { }

    async getHotelProfile(hotelId: string): Promise<IHotelProfile | null> {
        return await this._hotelProfileRepository.findByHotelId(hotelId)
    }
    async updateHotelProfile(userId: string, profileData: Partial<IHotelProfile>): Promise<IHotelProfile | null> {
        try {
            if (!userId) {
                throw new Error(Messages.USER_ID_REQUIRED)
            }
            const updateProfile = await this._hotelProfileRepository.updateHotelProfile(userId, profileData)
            if (!updateProfile) {
                throw new Error(Messages.USER_NOT_FOUND)
            }

            if (profileData.email) {
                await this._userRepository.updateEmail(userId, profileData.email);
            }
            return updateProfile
        } catch (error) {
            throw error
        }
    }
    async reqRequstProfile(id: string): Promise<IHotelProfile | null> {
        return await this._hotelProfileRepository.reRequstHotelProfile(id)
    }
    async changePassword(id: string, currentPasswords: string, newPassword: string, confirmPassword: string): Promise<{ status: number; message: string; }> {
        try {
            if (confirmPassword !== newPassword) {
                throw new Error(Messages.PASSWORD_NOT_MATCH)
            }
            const cleanedId = id.replace(/^:/, '')
            const user = await this._userRepository.findById(cleanedId)
            if (!user) {
                throw new Error(Messages.USER_NOT_FOUND)
            }
            if (user.password.length <= 0) {
                throw new Error('You don’t have a password set. Please create a new password.')
            }
            const password = await hashPassword(newPassword)
            const isCurrentPassword = await comparePassword(currentPasswords, user.password)
            if (!isCurrentPassword) {
                throw new Error(Messages.INVALID_CURRENT_PASSWORD)
            }
            const isSamePassword = await comparePassword(newPassword, user.password);
            if (isSamePassword) {
                throw new Error('New password must be different from the current password');
            }
            await this._userRepository.changePassword(cleanedId, password)
            return { status: 200, message: 'Password changed Successfully' }
        } catch (error) {
            throw error
        }
    }

}