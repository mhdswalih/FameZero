import { Router } from 'express'
import { UserService } from '../../services/user/userService'
import { UserRepository } from '../../repositories/userrepository/userRepository'
import { UserController } from '../../controllers/user/userController';
import { ProfileRepository } from '../../repositories/userrepository/profileRepository';

const userRoute = Router()

const userRepository = new UserRepository();
const profileRepository = new ProfileRepository();
const userService = new UserService(userRepository, profileRepository);
const userController = new UserController(userService)
 

userRoute.post('/create-user', userController.createUser.bind(userController))
userRoute.post('/veryfy-otp',userController.verifyOtp.bind(userController))
userRoute.post('/resend-otp',userController.resendOtp.bind(userController))
userRoute.post('/login-user',userController.login.bind(userController))



export default userRoute