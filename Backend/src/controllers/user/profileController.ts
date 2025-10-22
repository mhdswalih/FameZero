import { Request, Response, NextFunction, response } from "express";
import { IProfileController } from "../../interfaces/user/profile/IProfileController";
import { IProfileService } from "../../interfaces/user/profile/IProfileService";
import { HttpStatus } from "../../constants/HttpStatus";
import { IReview } from "../../models/hotelModel/hotelProfileModel";

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

      const response = await this._profileService.updateUserProfile(id, userProfile);
      res.status(HttpStatus.OK).json({ data: response });
    } catch (error) {
      next(error);
    }
  }
  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const { currentPasswords, newPassword, confirmPassword } = req.body
      const response = await this._profileService.changePassword(id, currentPasswords, newPassword, confirmPassword)
      res.status(HttpStatus.OK).json({ response })
    } catch (error) {
      next(error)
    }
  }
  async getHotels(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hotels = await this._profileService.getHotels()
      res.status(HttpStatus.OK).json({ hotels })
    } catch (error) {
      next(error)
    }
  }
  async getHotelDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { hotelId } = req.params
      const response = await this._profileService.getHotelDetails(hotelId)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  }
async ratingAndReview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { hotelId } = req.params;
      console.log(req.body.review,'THISIS FROM CONROLLER');
      
    // Ensure review is an array
    let review: IReview[] = [];

    if (req.body.review) {
      review = typeof req.body.review === "string"
        ? JSON.parse(req.body.review)
        : req.body.review;
    }

    if (req.file) {
      if (review.length === 0) {
        review.push({
          comment: req.body.comment || "",
          rating: Number(req.body.rating) || 0,
          userId: (req as any).user?.id, 
          reviweIMG: (req.file as any).path || "",
          createAt: new Date(),
          _id: "",
          profilePic: "",
          name: "",
          like: [],
          totalLike: 0
        });
      } else {
        review[0] = {
          ...review[0],
          reviweIMG: (req.file as any).path,
        };
      }
    }

    const response = await this._profileService.ratingAndReview(hotelId, review);

    res.status(HttpStatus.OK).json({
      success: true,
      review: response,
    });
  } catch (error) {
    next(error)
  }
}


async likeAndUnlike(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {reviewId,userId,hotelId} = req.params
      const response = await this._profileService.likeAndUnlike(reviewId,userId,hotelId)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
}
async getWalletBalance(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {userId} = req.params
    const response = await this._profileService.getWalletBalance(userId)
    res.status(HttpStatus.OK).json(response)
  } catch (error) {
    next(error)
  }
}
async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {userId} = req.params
    const response = await this._profileService.getNotifications(userId)
    res.status(HttpStatus.OK).json(response)
  } catch (error) {
    next(error)
  }
}
async updateReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { reviewId, hotelId } = req.params;
    let updateReviews: IReview[] = [];

    if (req.body.reviewData) {
      updateReviews =
        typeof req.body.reviewData === "string"
          ? JSON.parse(req.body.reviewData)
          : req.body.reviewData;
    }

    if (req.file) {
      updateReviews[0] = {
        ...updateReviews[0],
        reviweIMG: req.file.path || "",
      };
    }

    const response = await this._profileService.updateReviews(
      reviewId,
      hotelId,
      updateReviews
    );

    res.status(HttpStatus.OK).json(response);
  } catch (error) {
    next(error);
  }
}

async deleteReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {reviewId,hotelId} = req.params
    const response = await this._profileService.deleteReviews(reviewId,hotelId)
    res.status(HttpStatus.OK).json(response)
  } catch (error) {
    next(error)
  }
}

}