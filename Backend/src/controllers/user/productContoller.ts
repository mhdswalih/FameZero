import { NextFunction, Request, Response } from "express";
import { IProductController } from "../../interfaces/user/products/IProductController";
import { IProductService } from "../../interfaces/user/products/IProductService";
import { HttpStatus } from "../../constants/HttpStatus";

export class ProductController implements IProductController {
    constructor(private _userProductService:IProductService) {}
  async addToCart(req: Request, res: Response,next:NextFunction): Promise<void> {
      try {
        const {productId,userId,hotelId} = req.params;
        const response = await this._userProductService.addToCart(productId,userId,hotelId)
        res.status(HttpStatus.OK).json(response)
      } catch (error) {
        next(error)
      }
  }
  async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const {userId} = req.params;
        const reponse = await this._userProductService.getCart(userId)
        res.status(HttpStatus.OK).json(reponse)
      } catch (error) {
        next(error)
      }
  }

async removeFromCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {productId,userId} = req.params;
      const response = await this._userProductService.removeFromCart(productId,userId)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
     next(error) 
    }
}
async updateStock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {userId,productId,action} = req.body
      const response = await this._userProductService.updateStockInCart(userId,productId,action)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
}
}