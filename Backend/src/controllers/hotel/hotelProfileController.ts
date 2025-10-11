import { Request, Response, NextFunction } from "express";
import { IProfileHotelController } from "../../interfaces/hotel/profile/IProfileHotelController";
import { IProfileHotelService } from "../../interfaces/hotel/profile/IProfileHotelService";
import { HttpStatus } from "../../constants/HttpStatus";
import { emitAdminHotelsTable, emitToHotel } from "../../middleware/soket.io";

export class HotelProfileController implements IProfileHotelController {
  constructor(private _hotelProfileService: IProfileHotelService) { }

  async getHotelProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const response = await this._hotelProfileService.getHotelProfile(id)
      res.status(HttpStatus.OK).json({ data: response });
    } catch (error) {
      next(error);
    }
  }
  async updateHotelProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      const profilepicPath = files?.profilepic?.[0]?.path;
      const idProofPath = files?.idProof?.[0]?.path;
      const cleanedId = id.replace(/^:/, '').trim();
      const hotel = await this._hotelProfileService.getHotelProfile(cleanedId);
      if (!hotel) {
        throw new Error("Hotel not found");
      }

      const hotelData = {
        ...req.body,
        ...(profilepicPath && { profilepic: profilepicPath }),
        ...(idProofPath && { idProof: idProofPath }),
        status: 'Pending'
      };

      const response = await this._hotelProfileService.updateHotelProfile(cleanedId, hotelData);
      const emitted = emitToHotel(hotel._id.toString(), 'Pending');
      const adminEmitted = emitAdminHotelsTable(hotel._id.toString(), 'Pending')
      res.status(200).json({
        success: true,
        data: response,
        socketEmitted: emitted,
        hotelIdUsed: hotel._id
      });
    } catch (error) {
      next(error);
    }
  }
  async reRequstProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const cleanedId = id.replace(/^:/, '').trim();
      const status = await this._hotelProfileService.reqRequstProfile(cleanedId)
      const adminEmitted = emitAdminHotelsTable(cleanedId.toString(), 'Pending')
      res.status(HttpStatus.OK).json({ success: true, data: status, socketEmitted: adminEmitted })
    } catch (error) {
      next(error)
    }
  }
  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { currentPasswords, newPassword, confirmPassword } = req.body
      const response = await this._hotelProfileService.changePassword(id, currentPasswords, newPassword, confirmPassword)
      res.status(HttpStatus.OK).json({ response })
    } catch (error) {
      next(error)
    }
  }
  async addProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { hotelId } = req.params;
      const { products } = req.body;
     console.log(hotelId,products,'THIS IS FRON NASKJDBSAHDBASHDBAHSd');
     
      const response = await this._hotelProfileService.addProducts(hotelId, products);
        res.status(HttpStatus.OK).json({
      success: true,
      message: "Products added successfully",
      data: response,
    });
    } catch (error) {
      next(error);
    }
  }

  async getAllMenu(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;

      const response = await this._hotelProfileService.getAllMenu(userId)
      res.status(HttpStatus.OK).json({ response })
    } catch (error) {
      next(error)
    }
  }
  async getOrderList(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const {hotelId} = req.params
        const response = await this._hotelProfileService.getOrderList(hotelId)
        res.status(HttpStatus.OK).json(response)
      } catch (error) {
        next(error)
      }
  }
  async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const {orderId,userId} = req.params;
        const {newStatus} = req.body
        const response = await this._hotelProfileService.updateOrderStatus(orderId,userId,newStatus)
        res.status(HttpStatus.OK).json(response)
      } catch (error) {
        next(error)
      }
  }
  async deleteProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const {producId} = req.params
        const response = await this._hotelProfileService.deleteProducts(producId)
        res.status(HttpStatus.OK).json(response)
      } catch (error) {
        next(error)
      }
  }
  async updateProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const {productId,hotelId} = req.params;
        const {updatedProducts} = req.body;
        const respone = await this._hotelProfileService.updatedProducts(updatedProducts,productId,hotelId)
        res.status(HttpStatus.OK).json(respone)
      } catch (error) {
        next(error)
      }
  }
  
}