import { Request, Response, NextFunction, response } from "express";
import { IProfileController } from "../../interfaces/user/profile/IProfileController";
import { IProfileService } from "../../interfaces/user/profile/IProfileService";
import { HttpStatus } from "../../constants/HttpStatus";

export class ProfileController implements IProfileController {
  constructor(private _profileService: IProfileService) { }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const response = await this._profileService.getProfile(id);
      res.status(HttpStatus.OK).json({ data: response });
    } catch (error) {
      next(error);
    }
  }

  async updateUserProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      let userProfile;
      if (req.file) {
        userProfile = {
          ...req.body,
          profilepic: req.file.path
        };
      } else {
        userProfile = req.body.userProfile || req.body;
      }
      
      // if (userProfile.userId && typeof userProfile.userId === 'object' && userProfile.userId._id) {
      //   userProfile.userId = userProfile.userId._id;
      // }

      const response = await this._profileService.updateUserProfile(id, userProfile);
      res.status(HttpStatus.OK).json({ data: response });
    } catch (error) {
      next(error);
    }
  }
  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const {id} = req.params  
        const {currentPasswords,newPassword,confirmPassword} = req.body  
        const response = await this._profileService.changePassword(id,currentPasswords,newPassword,confirmPassword)
        res.status(HttpStatus.OK).json({response})
      } catch (error) {
        next(error)
      }
  }
  async getHotels(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const hotels = await this._profileService.getHotels()
        res.status(HttpStatus.OK).json({hotels})
      } catch (error) {
       next(error) 
      }
  }
  async getHotelDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const {hotelId} = req.params
        const response = await this._profileService.getHotelDetails(hotelId)
        res.status(HttpStatus.OK).json(response)
      } catch (error) {
       next(error) 
      }
  }
  async ratingAndReview(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const {hotelId} = req.params
        const {review} = req.body
        
        const response = await this._profileService.ratingAndReview(hotelId,review)
        res.status(HttpStatus.OK).json(response)
      } catch (error) {
        next(error)
      }
  }
}

