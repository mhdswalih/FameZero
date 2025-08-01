import { Router } from "express";
import { HotelProfileRepository } from "../../repositories/hotelRepository/hotelProfileRepository";
import { HotelProfileService } from "../../services/hotel/profileHotelService";
import { HotelProfileController } from "../../controllers/hotel/hotelProfileController";
import upload from "../../config/multer";



const hotelProfileRoutes = Router()

const hotelProfileRepository =  new HotelProfileRepository()
const hotelProfileService = new HotelProfileService(hotelProfileRepository)
const hotelProfileController = new HotelProfileController(hotelProfileService)

hotelProfileRoutes.get('/get-hotel-profile/:id',hotelProfileController.getHotelProfile.bind(hotelProfileController))
// Change this in your routes file
hotelProfileRoutes.post(  // Changed from .post to .put
  '/update-hotelprofile/:id',
  upload.fields([
    { name: 'profilepic', maxCount: 1 },
    { name: 'idProof', maxCount: 1 }
  ]),
  hotelProfileController.updateHotelProfile.bind(hotelProfileController)
);



export default hotelProfileRoutes