import { IUser } from "../../models/usermodel/userModel";
import { IBaseRepository } from "../baserepo/IbaseRepo";

export interface IHotelRepository extends IBaseRepository<IUser> {
    
    // updateHotel(id:string,userData:Partial<IUser>):Promise<IUser |null>;
    // findAllhotels():Promise<IUser[]>;
    // updateHotelsPassword(id:string,hashedPassword:string):Promise<IUser | null>;
    // checkMobileExists(mobile:string):Promise<boolean>;
} 