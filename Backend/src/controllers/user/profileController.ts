import { Request, Response, NextFunction } from "express";
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

}