import {IUser} from '../../models/usermodel/usermodel'
import { IBaseRepository } from '../BaseRepo/IbaseRepo';


export interface IUserRepository extends IBaseRepository<IUser> {
    // findById(id:string) : Promise<IUser |null >;
    // findByEmail(email:string):Promise<IUser |null>;
    // createUser(userData: Partial<IUser>): Promise<IUser>;
    updateUser(id:string,userData:Partial<IUser>):Promise<IUser |null>;
    findAllUsers():Promise<IUser[]>;
    updateUserPassword(id:string,hashedPassword:string):Promise<IUser | null>;
    checkMobileExists(mobile:string):Promise<boolean>;
}