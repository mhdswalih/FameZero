import { HttpStatus } from "../../constants/HttpStatus";
import { Messages } from "../../constants/Messeges";
import { IAdminRepository } from "../../interfaces/admin/IAdminRepository";

import { IAdminService } from "../../interfaces/admin/IAdminService";
import { IUserRepository } from "../../interfaces/user/IUserRepository";
import { IAdmin } from "../../models/adminModel/adminModel";
import { IUser } from "../../models/usermodel/userModel";
import { createHttpError } from "../../utils/httperr";
import { genrateAccessToken, genrateRefreshToken } from "../../utils/jwt";

export class AdminService implements IAdminService {
    constructor(private _AdminRepository:IAdminRepository, private _UserRepository:IUserRepository){}
    async loginAdmin(email: string, password: string): Promise<{ status: number; message: string; accessToken: string; refreshToken: string; admin?: { id: string; email: string; }; }> {
     
        const admin = await this._AdminRepository.findByEmail(email)
        console.log(admin,'this is admin side');
        
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
}
