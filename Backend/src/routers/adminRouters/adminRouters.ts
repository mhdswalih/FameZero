import { Router } from "express";
import { AdminRepository } from "../../repositories/adminRepository/adminRepository";
import { AdminService } from "../../services/admin/adminService";
import { adminController } from "../../controllers/admin/AdminController";
import { UserRepository } from "../../repositories/userrepository/userRepository";

const adminRoutes = Router()

const adminRepository = new AdminRepository();
const userRepository = new UserRepository()
const adminService = new AdminService(adminRepository,userRepository)
const AdminController = new adminController(adminService)
 

adminRoutes.post('/admin-login',AdminController.login.bind(AdminController))
adminRoutes.get('/get-users',AdminController.getAllUsers.bind(AdminController))



export default adminRoutes