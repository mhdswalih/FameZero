import { IAdmin } from "../../models/adminModel/adminModel";
import { IUser } from "../../models/usermodel/userModel";
import { IBaseRepository } from "../baserepo/IbaseRepo";


export interface IAdminRepository extends IBaseRepository<IAdmin> {
  
}