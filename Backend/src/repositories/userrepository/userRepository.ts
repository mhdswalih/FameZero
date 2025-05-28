import { IUser, User } from "../../models/usermodel/usermodel";
import { BaseRepository } from "./baseRepository";
import { IUserRepository } from "../../interfaces/user/IUserRepository";

export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
   constructor() {
      super(User);
   }

   // async createUser(userData: Partial<IUser>): Promise<IUser> {
   //    try {
   //       return await this.create(userData); // Fixed recursive call
   //    } catch (error) {
   //       throw new Error(`Error creating user: ${error instanceof Error ? error.message : String(error)}`);
   //    }
   // }

   // async findById(id: string): Promise<IUser | null> {
   //    return await super.findById(id);
   // }

   // async findByEmail(email: string): Promise<IUser | null> {
   //    return await this.findOne({ email });
   // }

   async findAllUsers(): Promise<IUser[]> {
      return await this.findAll();
   }

   async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
      return await this.update(id, userData);
   }

   async updateUserPassword(id: string, hashedPassword: string): Promise<IUser | null> {
      return await this.update(id, { password: hashedPassword });
   }

   async checkMobileExists(mobile: string): Promise<boolean> {
      const user = await this.findOne({ mobile });
      return !!user;
   }
}