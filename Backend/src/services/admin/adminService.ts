import { HttpStatus } from "../../constants/HttpStatus";
import { Messages } from "../../constants/Messeges";
import { IAdminRepository } from "../../interfaces/admin/IAdminRepository";
import { IAdminService } from "../../interfaces/admin/IAdminService";
import { IHotelRepository } from "../../interfaces/hotel/IHotelRepository";
import { IUserRepository } from "../../interfaces/user/IUserRepository";
import { IUser } from "../../models/usermodel/userModel";
import { IHotelFullProfile } from "../../repositories/hotelRepository/hotelInterface";
import { createHttpError } from "../../utils/httperr";
import { genrateAccessToken, genrateRefreshToken } from "../../utils/jwt";

export class AdminService implements IAdminService {
    constructor(private _AdminRepository:IAdminRepository, private _UserRepository:IUserRepository,private __HotelRepository:IHotelRepository){}
    async loginAdmin(email: string, password: string): Promise<{ status: number; message: string; accessToken: string; refreshToken: string; admin?: { id: string; email: string; }; }> {
        const admin = await this._AdminRepository.findByEmail(email)
        if(!admin) throw createHttpError(HttpStatus.BAD_REQUEST,Messages.USER_NOT_FOUND)
        if(password !== admin.password){
            throw createHttpError(HttpStatus.UNAUTHORIZED,Messages.INVALID_CREDENTIALS)
        }
        const accessToken = genrateAccessToken(admin.id.toString())
        const refreshToken = genrateRefreshToken(admin.id.toString())

        return {
            status : HttpStatus.OK,
            message:Messages.LOGIN_SUCCESS,
            accessToken,
            refreshToken,
            admin:{
                id:admin.id.toString(),
                email:admin.email
            }
        }
    }

    async getAllUsers():Promise<IUser[]> {
        return await this._UserRepository.getAllUsers()
    }
    async getAllHotels(): Promise<IHotelFullProfile[]> {
        return await this.__HotelRepository.getAllHotels()
    }
    async acceptRequst(id:string): Promise<IHotelFullProfile | null> {
        return await this.__HotelRepository.acceptRequstHotel(id)
    }
    async rejectRequst(id: string): Promise<IHotelFullProfile | null> {
        return await this.__HotelRepository.rejectRequstHotel(id)
    }
}
