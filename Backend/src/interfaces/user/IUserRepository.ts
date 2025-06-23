import {IUser} from '../../models/usermodel/userModel'
import { IUserProfile } from '../../models/usermodel/userProfileModel';
import { IBaseRepository } from '../baserepo/IbaseRepo';


export interface IUserRepository extends IBaseRepository<IUser> {
    // findById(id:string) : Promise<IUser |null >;
    // findByEmail(email:string):Promise<IUser |null>;
    // createUser(userData: Partial<IUser>): Promise<IUser>;
    updateUser(id:string,userData:Partial<IUserProfile>):Promise<void>;
    getAllUsers():Promise<IUser[]>;
    updateUserPassword(id:string,hashedPassword:string):Promise<IUser | null>;
    checkMobileExists(mobile:string):Promise<boolean>;
}