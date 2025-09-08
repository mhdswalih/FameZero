import { Messages } from "../../constants/Messeges";
import { IProductRepository } from "../../interfaces/user/products/IProductRepository";
import { IProductService } from "../../interfaces/user/products/IProductService";
import Product, { IProducts, IProductsDetails } from "../../models/hotelModel/productModel";
import Cart, { ICart } from "../../models/usermodel/cartModel";
import mongoose from "mongoose";
import { BaseRepository } from "../../repositories/userrepository/baseRepository";
import { createHttpError } from "../../utils/httperr";
import { HttpStatus } from "../../constants/HttpStatus";




export class ProductService extends BaseRepository<IProducts> implements IProductService {
  constructor(private _userProducteRepository: IProductRepository) {
    super(Product)
  }
  async addToCart(
    productId: string,
    userId: string,
    hotelId: string
  ): Promise<{ status: number; message: string }> {
    try {
      if (!productId) {
        throw new Error(Messages.PRODUCT_ID_NOT_FOUND);
      }

      const existingProductInCart = await Cart.findOne({
        userId,
        hotelId,
        "productDetails._id": new mongoose.Types.ObjectId(productId)
      });

      if (existingProductInCart) {
        throw new Error(Messages.DUBLICATE_PRODUCT_IN_CART);
      }

      await this._userProducteRepository.addToCart(productId, userId, hotelId);

      return { status: 200, message: "Product added to cart successfully" };
    } catch (error) {
      throw error;
    }
  }

  async getCart(userId: string): Promise<{ status: number; message: string; data: IProductsDetails[] | null }> {
    if (!userId) {
      throw new Error(Messages.USER_NOT_FOUND)
    }
    const response = await this._userProducteRepository.getCart(userId);
    return { status: 200, message: 'Cart fetched Successfully', data: response }
  }
  async removeFromCart(productId: string, userId: string): Promise<{ status: number; message: string; }> {
    try {
      if (!productId) {
        throw new Error(Messages.PRODUCT_ID_NOT_FOUND)
      }
      await this._userProducteRepository.removeFromCart(productId, userId)
      return { status: 200, message: 'Item Removed Successfully' }
    } catch (error) {
      throw error
    }
  }
  async updateStockInCart(
    userId: string,
    productId: string,
    action: "increment" | "decrement"
  ): Promise<{ status: number; updatedQuantity: Object }> {
    const response = await this._userProducteRepository.updateStockInCart(userId, productId, action);
    return { status: 200, updatedQuantity: response };
  }
  async getCheckOut(userId: string): Promise<{ status: number, checkOutDetails: ICart[] | null }> {
    try {
      if (!userId) {
        throw createHttpError(HttpStatus.BAD_REQUEST, Messages.USER_ID_REQUIRED)
      }
      const checkOutDetails = await this._userProducteRepository.getCheckOut(userId)
      return { status: 200, checkOutDetails: checkOutDetails ? [checkOutDetails] : null }
    } catch (error) {
      throw error
    }
  }
  async createOrder(userId:string): Promise<{ status: number; message: string; }> {
    try {
      if (!userId) {
        throw createHttpError(HttpStatus.BAD_REQUEST,Messages.INVALID_USER_ID)
      }
      const data = await this._userProducteRepository.createOrder(userId)
      return { status: 200, message: 'Order Created Successfully' }
    } catch (error) {
      throw error
    }
  }
}