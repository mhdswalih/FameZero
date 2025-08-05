import { Router } from "express";
import { AdminRepository } from "../../repositories/adminRepository/adminRepository";
import { AdminService } from "../../services/admin/adminService";
import { adminController } from "../../controllers/admin/AdminController";
import { UserRepository } from "../../repositories/userrepository/userRepository";
import { HotelProfileRepository } from "../../repositories/hotelRepository/hotelProfileRepository";
import { HotelRepository } from "../../repositories/hotelRepository/hotelRepository";

const adminRoutes = Router()

const adminRepository = new AdminRepository();
const userRepository = new UserRepository()
const hotelRepository = new HotelRepository()
const adminService = new AdminService(adminRepository,userRepository,hotelRepository)
const AdminController = new adminController(adminService)
 

adminRoutes.post('/admin-login',AdminController.login.bind(AdminController))
adminRoutes.get('/get-users',AdminController.getAllUsers.bind(AdminController))
adminRoutes.get('/get-hotels',AdminController.getAllHotels.bind(AdminController))
adminRoutes.post('/accept-requst/:id',AdminController.acceptRequst.bind(AdminController))
adminRoutes.post('/reject-requst/:id',AdminController.rejectRequst.bind(AdminController))


export default adminRoutes