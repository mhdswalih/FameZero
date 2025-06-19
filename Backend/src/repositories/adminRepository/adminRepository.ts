import { IAdminRepository } from "../../interfaces/admin/IAdminRepository";
import { Admin, IAdmin } from "../../models/adminModel/adminModel";
import { BaseRepository } from "../userrepository/baseRepository";

export class AdminRepository extends BaseRepository<IAdmin> implements IAdminRepository {
    constructor(){
        super(Admin)
    }
    async getAllUsers(): Promise<IAdmin[]> {
        return await this.find({role:'admin'})
    }
}