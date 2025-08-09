import { Router } from "express";
import { ProfileRepository } from "../../../repositories/userrepository/profileRepository";
import { ProfileService } from "../../../services/user/profileService";
import { ProfileController } from "../../../controllers/user/profileController";
import upload from "../../../config/multer";
import { authenticateToken } from "../../../middleware/authMiddleware";


const profileRouter = Router()  

const profileRepository = new ProfileRepository()
const profileService = new ProfileService(profileRepository);
const profileController = new ProfileController(profileService)

profileRouter.get('/get-user-details/:id',authenticateToken,profileController.getProfile.bind(profileController))
profileRouter.post('/update-userprofile/:id',authenticateToken,upload.single('profilepic'),profileController.updateUserProfile.bind(profileController))


export default profileRouter