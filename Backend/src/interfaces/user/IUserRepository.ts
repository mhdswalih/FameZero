import {IUser} from '../../models/usermodel/userModel'
import { IUserProfile } from '../../models/usermodel/userProfileModel';
import { IBaseRepository } from '../baserepo/IbaseRepo';


export interface IUserRepository extends IBaseRepository<IUser> {
    updateUser(id:string,userData:Partial<IUserProfile>):Promise<void>;
    getAllUsers():Promise<IUser[]>;
    updateUserPassword(email:string,hashedPassword:string):Promise<void>;
    checkMobileExists(mobile:string):Promise<boolean>;
    updateEmail(userId:string,email:string):Promise<void>
    changePassword(id:string,newPassword:string):Promise<void>
}