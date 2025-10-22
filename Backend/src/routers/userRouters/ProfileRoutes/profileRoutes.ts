import { Router } from "express";
import { ProfileRepository } from "../../../repositories/userrepository/profileRepository";
import { ProfileService } from "../../../services/user/profileService";
import { ProfileController } from "../../../controllers/user/profileController";
import upload from "../../../config/multer";
import { authenticateToken } from "../../../middleware/authMiddleware";
import { UserRepository } from "../../../repositories/userrepository/userRepository";
import { HotelRepository } from "../../../repositories/hotelRepository/hotelRepository";
import { HotelProfileRepository } from "../../../repositories/hotelRepository/hotelProfileRepository";


const profileRouter = Router()  

const profileRepository = new ProfileRepository()
const userRepository = new UserRepository()
const hotelRepository = new HotelRepository()
const hotelProfileRepository = new HotelProfileRepository()
const profileService = new ProfileService(profileRepository,userRepository,hotelRepository,hotelProfileRepository);
const profileController = new ProfileController(profileService)

profileRouter.get('/get-user-details/:id',authenticateToken,profileController.getProfile.bind(profileController))
profileRouter.post('/update-userprofile/:id',authenticateToken,upload.single('profilepic'),profileController.updateUserProfile.bind(profileController))
profileRouter.post('/change-password/:id',authenticateToken,profileController.changePassword.bind(profileController))
profileRouter.get('/get-hotels',profileController.getHotels.bind(profileController))
profileRouter.get('/get-hotel/:hotelId',profileController.getHotelDetails.bind(profileController))
profileRouter.post("/rating-review/:hotelId",authenticateToken,upload.single("reviweIMG"), profileController.ratingAndReview.bind(profileController));
profileRouter.post('/like-unlike/:reviewId/:userId/:hotelId',authenticateToken,profileController.likeAndUnlike.bind(profileController))
profileRouter.get('/get-wallet/:userId',authenticateToken,profileController.getWalletBalance.bind(profileController))


export default profileRouter