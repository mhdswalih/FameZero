import { HttpStatus } from '../../constants/HttpStatus';
import { Messages } from '../../constants/Messeges';
import { IUserRepository } from '../../interfaces/user/IUserRepository';
import { IUserService } from '../../interfaces/user/IUserservice';
import { IUser, User } from '../../models/usermodel/userModel';
import { deleteOtp, sendOtp, storeOtp } from '../../utils/otp';
import { generateOTP } from '../../utils/otputils';
import { verifyOtp } from '../../utils/otp';
import { createHttpError } from '../../utils/httperr';
import { comparePassword, hashPassword } from '../../utils/hashPassword';
import { genrateAccessToken, genrateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { IUserProfile } from '../../models/usermodel/userProfileModel';
import { IProfileRepositer } from '../../interfaces/user/profile/IProfileRepository';
import { IProfileHotelRepositer } from '../../interfaces/hotel/profile/IProfileHotelRepository';
import { verifyGoogleAndCreateUser } from '../../utils/verifyGoogleToken';
import { genrateAndStoreResetToken, veryResetToken } from '../../utils/resetPassword';



export class UserService implements IUserService {
    constructor(private _userRepository: IUserRepository, private _profileUserRepository: IProfileRepositer, private _profileHotelRepository: IProfileHotelRepositer) { }

    async registerUser(userData: Partial<IUser>): Promise<{ status: number, messege: string }> {
        if (!userData.email) {
            throw new Error(Messages.MESSAGES_REQUIRED);
        }
        const existingUser = await this._userRepository.findByEmail(userData.email);
        const commonPattern: RegExp = /^(123456|123456789|12345678|12345|111111|123123|qwerty|abc123|password|password1)$/i;

        if (existingUser) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.USER_EXISTS);
        }
        if (!userData.name || !userData.password) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.INVALID_CREDENTIALS);
        }
        if (userData.password.length < 8) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.PASSWORD_LENGTH)
        }
        if (commonPattern.test(userData.password)) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.PASSWORD_COMMEN)
        }

        const otp = generateOTP();
        await sendOtp(userData?.email, otp)
        await storeOtp(userData?.email, otp)
        return { status: HttpStatus.OK, messege: Messages.OTP_SENT }

    }

    async getUserById(id: string): Promise<IUser> {
        try {
            const user = await this._userRepository.findById(id);
            if (!user) {
                throw new Error(Messages.USER_NOT_FOUND);
            }
            return user;
        } catch (error: any) {
            throw new Error(`Error getting user: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async verifyOtp(email: string, otp: string, userData: Partial<IUser>): Promise<{ status: number, messege: string }> {
        const validOtp = await verifyOtp(email, otp)
        if (!validOtp.success) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.OTP_INVALID)

        }
        if (!userData.password) {
            throw new Error('Password Requird')
        }
        userData.password = await hashPassword(userData.password)
        const user = await this._userRepository.create(userData as IUser) as IUser;
        await deleteOtp(email)
        if (user.role === 'user') {
            await this._profileUserRepository.create({
                userId: user.id,
                name: user.name,
                email: user.email,
                profilepic: '',
                address: '',
                city: '',
                phone: '',
            })
        }

        if (user.role === 'hotel') {
            await this._profileHotelRepository.create({
                userId: user.id,
                name: user.name,
                email: user.email,
                profilepic: '',
                location: '',
                idProof: '',
                city: '',
                phone: '',
            })
        }

        return { status: HttpStatus.CREATED, messege: Messages.USER_CREATED }
    }
    async resendOtp(email: string): Promise<{ status: number; messege: string; }> {
        await deleteOtp(email)
        const newOTP = generateOTP()
        await sendOtp(email, newOTP)
        await storeOtp(email, newOTP)
        return { status: HttpStatus.OK, messege: Messages.OTP_SENT }
    }
    async loginUser(email: string, password: string): Promise<{
        status: number;
        message: string;
        accessToken: string;
        refreshToken: string;
        user?: {
            id: string,
            name: string,
            email: string,
            role: string,
        }
    }> {
        try {
            const user = await this._userRepository.findByEmail(email)
            if (!user) throw createHttpError(HttpStatus.BAD_REQUEST, Messages.USER_NOT_FOUND)

            const isValid = await comparePassword(password, user.password)
            if (!isValid) {
                throw createHttpError(HttpStatus.BAD_REQUEST, Messages.INVALID_PASSWORD)
            }
            const accessToken = genrateAccessToken(user.id.toString(), user.role)
            const refreshToken = genrateRefreshToken(user.id.toString())
            return {
                status: HttpStatus.OK,
                message: Messages.LOGIN_SUCCESS,
                accessToken,
                refreshToken,
                user: {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        } catch (error) {
            throw error
        }
    }
    async googleLogin(googleToken: string, role: string): Promise<{
        status: number;
        message: string;
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            profilepic: string;
            role: string;
        }
    }> {
        try {
            const googleUser = await verifyGoogleAndCreateUser(googleToken);

            if (!googleUser?.email || !googleUser?.name) {
                throw createHttpError(HttpStatus.UNAUTHORIZED, Messages.INVALID_CREDENTIALS);
            }

            if (!['user', 'hotel'].includes(role)) {
                throw createHttpError(HttpStatus.BAD_REQUEST, 'Invalid role specified');
            }
            let user = await this._userRepository.findByEmail(googleUser.email);

            if (!user) {
                user = await this._userRepository.create({
                    name: googleUser.name,
                    email: googleUser.email,
                    profilepic: googleUser.profilepic,
                    role: role,
                    password: '',
                    isGoogleAuth: true,
                } as IUser);

                if (!user) {
                    throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to create user');
                }
            }


            if (user.role !== role) {
                throw createHttpError(HttpStatus.FORBIDDEN, 'User already exists with a different role');
            }


            if (user.isBlocked) {
                throw createHttpError(HttpStatus.FORBIDDEN, Messages.USER_BLOCKED);
            }


            if (user.role === 'user') {
                const existingUserProfile = await this._profileUserRepository.findByUserId(user.id.toString());
                if (!existingUserProfile) {
                    await this._profileUserRepository.create({
                        userId: user.id,
                        name: user.name,
                        email: user.email,
                        profilepic: user.profilepic || '',
                        city: '',
                        address: '',
                        phone: '',
                    });
                }
            } else if (user.role === 'hotel') {
                const existingHotelProfile = await this._profileHotelRepository.findByHotelId(user.id.toString());
                if (!existingHotelProfile) {
                    await this._profileHotelRepository.create({
                        userId: user.id,
                        name: user.name,
                        email: user.email,
                        profilepic: user.profilepic || '',
                        city: '',
                        location: '',
                        phone: '',
                        idProof: '',
                    });
                }
            }
            const accessToken = genrateAccessToken(user.id.toString(), user.role);
            const refreshToken = genrateRefreshToken(user.id.toString());

            return {
                status: HttpStatus.OK,
                message: Messages.LOGIN_SUCCESS,
                accessToken,
                refreshToken,
                user: {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.email,
                    profilepic: user.profilepic,
                    role: user.role,
                },
            };

        } catch (error) {
            throw error;
        }
    }
  async phoneAuth(name: string, phone: string, role: string): Promise<{
    status: number;
    message: string;
    accessToken: string,
    refreshToken: string,
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
        profilepic: string;
        role: string;
    }
}> {
  
    
    // Input validation
    // if (!phone || !phone.match(/^\d{10,15}$/)) {
    //     throw createHttpError(HttpStatus.BAD_REQUEST, 'Invalid phone number');
    // }

    if (!['user', 'hotel'].includes(role)) {
        throw createHttpError(HttpStatus.BAD_REQUEST, 'Invalid role');
    }

    try {
        let user = await this._userRepository.findByPhone(phone);
         
        if (!user) {
         
            
            user = await this._userRepository.create({
                name: name,
                email: '', 
                phone: phone,
                role: role,
                password: '',
                isPhoneAuth: true
            } as IUser);
            
            if (!user) {
                throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to create user');
            }
        }
         
        if (user.role !== role) {
            throw createHttpError(HttpStatus.FORBIDDEN, 'User already exists with a different role');
        }

        if (user.isBlocked) {
            throw createHttpError(HttpStatus.FORBIDDEN, Messages.USER_BLOCKED);
        }

        // Consider using transactions for these operations
        if (user.role === 'user') {
            const existingUserProfile = await this._profileUserRepository.findByUserId(user.id.toString());
            if (!existingUserProfile) {
                await this._profileUserRepository.create({
                    userId: user.id,
                    name: user.name,
                    email: user.email,
                    phone: phone,
                    profilepic: user.profilepic || '',
                    city: '',
                    address: '',
                });
            }
        } else if (user.role === 'hotel') {
            const existingHotelProfile = await this._profileHotelRepository.findByHotelId(user.id.toString());
            if (!existingHotelProfile) {
                await this._profileHotelRepository.create({
                    userId: user.id,
                    name: user.name,
                    email: user.email,
                    phone: phone,
                    profilepic: user.profilepic || '',
                    city: '',
                    location: '',
                    idProof: '',
                });
            }
        }

        const accessToken = genrateAccessToken(user.id.toString(), user.role);
        const refreshToken = genrateRefreshToken(user.id.toString());
         
        return {
            status: HttpStatus.OK,
            message: Messages.LOGIN_SUCCESS,
            accessToken,
            refreshToken,
            user: {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
                profilepic: user.profilepic,
                role: user.role,
            },
        };
    } catch (error) {
        // Log the error for debugging
        console.error('Phone auth error:', error);
        throw error;
    }
}
    async verifyEmail(email: string): Promise<{ status: number; messege: string; }> {
        const existingUser = await this._userRepository.findByEmail(email)
        if(existingUser){
            throw createHttpError(HttpStatus.BAD_REQUEST,Messages.USER_EXISTS)
        }
         const otp = generateOTP();
        await sendOtp(email, otp)
        await storeOtp(email, otp)
        return { status: HttpStatus.OK, messege: Messages.OTP_SENT }

    }
    async otpVerifycationPhoneAuth(id:string,email: string, otp: string): Promise<{ status: number; messege: string; }> {
        
        const validOtp = await verifyOtp(email,otp)
          if (!validOtp.success) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.OTP_INVALID)
        }
        
        return {status:HttpStatus.OK,messege:Messages.OTP_VERIFIED}
    }
    async forgetPassword(email: string): Promise<{ message: string }> {
        const user = await this._userRepository.findByEmail(email)
        if (!user) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.USER_NOT_FOUND)
        }
        if (user.isGoogleAuth) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.GOOGLE_ACCOUNT)
        }
        await genrateAndStoreResetToken(email)
        return { message: Messages.RESET_LINK_SENT }

    }
    async resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<{ message: string; }> {

        if (!token) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.RESET_TOKEN_INVALID)
        }
        if (newPassword !== confirmPassword) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.PASSWORD_NOT_MATCH)
        }
        const email = await veryResetToken(token)

        if (!email) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.RESET_TOKEN_INVALID)
        }
        const user = await this._userRepository.findByEmail(email)
        if (!user) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.USER_NOT_FOUND)
        }

        const password = await hashPassword(newPassword)
        await this._userRepository.updateUserPassword(email, password)
        return { message: Messages.PASSWORD_RESET_SUCCESS }
    }
    async getUserDetails(id: string): Promise<IUser> {
        const profile = await this._userRepository.findById(id)
        if (!profile) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.USER_NOT_FOUND)
        }
        return profile
    }
    async updateUser(id: string, userProfile: Partial<IUserProfile>): Promise<void> {
        const userId = await this._userRepository.findById(id)
        if (!userId) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.INVALID_USER_ID)
        }
        return await this._userRepository.updateUser(id, userProfile)
    }
    async refreshToken(token: string): Promise<{ accessToken: string; user: { id: string; email: string; role: string } }> {
        const decode = verifyRefreshToken(token);
        if (!decode) {
            throw createHttpError(HttpStatus.UNAUTHORIZED, Messages.INVALID_OR_EXPIRED_REFRESH_TOKEN);
        }
        const user = await User.findById(decode.userId).select("_id email role");
        if (!user) {
            throw createHttpError(HttpStatus.UNAUTHORIZED, Messages.USER_NOT_FOUND);
        }

        const accessToken = genrateAccessToken(decode.userId, decode.role);

        return {
            accessToken,
            user: {
                id: user._id.toString(),
                email: user.email,
                role: user.role
            }
        };
    }

}