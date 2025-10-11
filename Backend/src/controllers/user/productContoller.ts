import { NextFunction, Request, Response } from "express";
import { IProductController } from "../../interfaces/user/products/IProductController";
import { IProductService } from "../../interfaces/user/products/IProductService";
import { HttpStatus } from "../../constants/HttpStatus";

export class ProductController implements IProductController {
  constructor(private _userProductService: IProductService) { }
  async addToCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId, userId, hotelId } = req.params;
      const response = await this._userProductService.addToCart(productId, userId, hotelId)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  }
  async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const reponse = await this._userProductService.getCart(userId)
      res.status(HttpStatus.OK).json(reponse)
    } catch (error) {
      next(error)
    }
  }

  async removeFromCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId, userId } = req.params;
      const response = await this._userProductService.removeFromCart(productId, userId)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  }
  async updateStock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, productId, action } = req.body
      const response = await this._userProductService.updateStockInCart(userId, productId, action)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  }

  async getCheckOut(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params
      const response = await this._userProductService.getCheckOut(userId)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  }
  async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params
      const { paymentOption, selectedDeliveryOption } = req.body;
      const response = await this._userProductService.createOrder(userId, paymentOption, selectedDeliveryOption)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  }

  async updatePaymentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId } = req.params;
      const { paymentStatus, paypalOrderId } = req.body;
      const response = await this._userProductService.updatePayementStatus(orderId, paymentStatus, paypalOrderId)
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  async getOrderHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const response = await this._userProductService.getOrderHistory(userId)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  }
  async rePayTheOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const {orderId} = req.params
        // console.log(orderId,'THIS IS ORDER ID ');
        
        const response = await this._userProductService.rePayOrder(orderId)
        res.status(HttpStatus.OK).json(response)
      } catch (error) {
        next(error)
      }
  }
  async rePayUpdateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const {orderId} = req.params;
        const {payementStatus} = req.body
        console.log(orderId,req.params,req.params.orderId,'THIS IS UPDATED STTSUS ORDER ID');
        
        const response = await this._userProductService.rePayUpdateStatus(orderId,payementStatus)
        res.status(HttpStatus.OK).json(response)
      } catch (error) {
        next(error)
      }
  }
  async getOrderDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const {orderId} = req.params
        const response = await this._userProductService.getOrderDetails(orderId)
        res.status(HttpStatus.OK).json(response)
      } catch (error) {
        next(error)
      }
  }
}
