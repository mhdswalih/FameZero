import { Router } from "express";
import { HotelProfileRepository } from "../../repositories/hotelRepository/hotelProfileRepository";
import { HotelProfileService } from "../../services/hotel/profileHotelService";
import { HotelProfileController } from "../../controllers/hotel/hotelProfileController";
import upload from "../../config/multer";
import { authenticateToken } from "../../middleware/authMiddleware";
import { UserRepository } from "../../repositories/userrepository/userRepository";



const hotelProfileRoutes = Router()

const hotelProfileRepository =  new HotelProfileRepository()
const userRepository = new UserRepository()
const hotelProfileService = new HotelProfileService(hotelProfileRepository,userRepository)
const hotelProfileController = new HotelProfileController(hotelProfileService)

hotelProfileRoutes.get('/get-hotel-profile/:id',authenticateToken,hotelProfileController.getHotelProfile.bind(hotelProfileController))
hotelProfileRoutes.post( 
  '/update-hotelprofile/:id',authenticateToken,
  upload.fields([
    { name: 'profilepic', maxCount: 1 },
    { name: 'idProof', maxCount: 1 }
  ]),
  hotelProfileController.updateHotelProfile.bind(hotelProfileController));
hotelProfileRoutes.post('/rerequst-profile/:id',authenticateToken,hotelProfileController.reRequstProfile.bind(hotelProfileController))
hotelProfileRoutes.post('/change-password/:id',authenticateToken,hotelProfileController.changePassword.bind(hotelProfileController))


export default hotelProfileRoutes