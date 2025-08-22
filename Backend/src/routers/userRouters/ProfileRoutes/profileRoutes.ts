import { Router } from "express";
import { ProfileRepository } from "../../../repositories/userrepository/profileRepository";
import { ProfileService } from "../../../services/user/profileService";
import { ProfileController } from "../../../controllers/user/profileController";
import upload from "../../../config/multer";
import { authenticateToken } from "../../../middleware/authMiddleware";
import { UserRepository } from "../../../repositories/userrepository/userRepository";
import { HotelRepository } from "../../../repositories/hotelRepository/hotelRepository";


const profileRouter = Router()  

const profileRepository = new ProfileRepository()
const userRepository = new UserRepository()
const hotelRepository = new HotelRepository()
const profileService = new ProfileService(profileRepository,userRepository,hotelRepository);
const profileController = new ProfileController(profileService)

profileRouter.get('/get-user-details/:id',authenticateToken,profileController.getProfile.bind(profileController))
profileRouter.post('/update-userprofile/:id',authenticateToken,upload.single('profilepic'),profileController.updateUserProfile.bind(profileController))
profileRouter.post('/change-password/:id',authenticateToken,profileController.changePassword.bind(profileController))
profileRouter.get('/get-hotels',profileController.getHotels.bind(profileController))


export default profileRouter