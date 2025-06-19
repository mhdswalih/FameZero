import { Router } from "express";
import { HotelRepository } from "../../repositories/hotelRepository/hotelRepository";
import { HotelService } from "../../services/hotel/hotelService";
import { HotelController } from "../../controllers/hotel/hotelController";




const hotelRoutes = Router()
const hotelRepository = new HotelRepository();
const hotelService = new HotelService(hotelRepository);
const hotelController = new HotelController(hotelService)

hotelRoutes.post('/hotel-register',hotelController.createHotel.bind(hotelController))
hotelRoutes.post('/verifyOtp-hotel',hotelController.verifyHotelOtp.bind(hotelController))


export default hotelRoutes