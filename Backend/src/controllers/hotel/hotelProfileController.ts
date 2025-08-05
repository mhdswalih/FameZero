import { Request, Response, NextFunction } from "express";
import { IProfileHotelController } from "../../interfaces/hotel/profile/IProfileHotelController";
import { IProfileHotelService } from "../../interfaces/hotel/profile/IProfileHotelService";
import { HttpStatus } from "../../constants/HttpStatus";

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
    const hotelData = {
      ...req.body,
      ...(profilepicPath && { profilepic: profilepicPath }),
      ...(idProofPath && { idProof: idProofPath }),
    };

    const response = await this._hotelProfileService.updateHotelProfile(id, hotelData);

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    next(error);
  }
}
async reRequstProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {id} = req.params
      const status = await this._hotelProfileService.reqRequstProfile(id)
      res.status(HttpStatus.OK).json({success:true,data:status})
    } catch (error) {
      next(error)
    }
}

}