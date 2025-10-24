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
    constructor(private _AdminRepository: IAdminRepository, private _UserRepository: IUserRepository, private __HotelRepository: IHotelRepository) { }
    async loginAdmin(email: string, password: string): Promise<{ status: number; message: string; accessToken: string; refreshToken: string; admin?: { id: string; email: string; }; }> {
        const admin = await this._AdminRepository.findByEmail(email)
        if (!admin) throw createHttpError(HttpStatus.BAD_REQUEST, Messages.USER_NOT_FOUND)
        if (password !== admin.password) {
            throw createHttpError(HttpStatus.UNAUTHORIZED, Messages.INVALID_CREDENTIALS)
        }
        const accessToken = genrateAccessToken(admin.id.toString(), admin.role)
        const refreshToken = genrateRefreshToken(admin.id.toString())

        return {
            status: HttpStatus.OK,
            message: Messages.LOGIN_SUCCESS,
            accessToken,
            refreshToken,
            admin: {
                id: admin.id.toString(),
                email: admin.email
            }
        }
    }

    async getAllUsers(page: number, limit: number,search:string): Promise<{ users: IUser[]; totalPages: number; currentPage: number,search: string }> {
        const { users, totalUsers } = await this._UserRepository.getAllUsers(page, limit,search);
        const totalPages = Math.ceil(totalUsers / limit);

        return {
            users,
            totalPages,
            currentPage: page,
            search : search
        };
    }

    async getAllHotels(
        page: number,
        limit: number,
        search : string
    ): Promise<{ hotels: IHotelFullProfile[]; totalPages: number; currentPage: number,search:string }> {
        const { hotels, totalHotels } = await this.__HotelRepository.getAllHotels(page, limit,search);

        const totalPages = Math.ceil(totalHotels / limit);

        return {
            hotels,
            totalPages,
            currentPage: page,
            search : search
        };
    }

    async acceptRequst(id: string): Promise<IHotelFullProfile | null> {
        return await this.__HotelRepository.acceptRequstHotel(id)
    }
    async rejectRequst(id: string): Promise<IHotelFullProfile | null> {
        return await this.__HotelRepository.rejectRequstHotel(id)
    }
    async blockHotel(id: string): Promise<IUser | null> {
        return await this.__HotelRepository.blockHotel(id)
    }
    async unBlockHotel(id: string): Promise<boolean> {
        return await this.__HotelRepository.unBlockHotel(id)
    }
}

