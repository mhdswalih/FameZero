import { Router } from 'express'
import { UserService } from '../../services/user/userService'
import { UserRepository } from '../../repositories/userrepository/userRepository'
import { UserController } from '../../controllers/user/userController';

const userRoute = Router()

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService)
 

userRoute.post('/create-user', userController.createUser.bind(userController))
userRoute.post('/veryfy-otp',userController.verifyOtp.bind(userController))
userRoute.post('/resend-otp',userController.resendOtp.bind(userController))


export default userRoute