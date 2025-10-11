import { Messages } from "../../constants/Messeges";
import { IProductRepository } from "../../interfaces/user/products/IProductRepository";
import { IProductService } from "../../interfaces/user/products/IProductService";
import Product, { IProducts, IProductsDetails } from "../../models/hotelModel/productModel";
import Cart, { ICart } from "../../models/usermodel/cartModel";
import mongoose from "mongoose";
import { BaseRepository } from "../../repositories/userrepository/baseRepository";
import { createHttpError } from "../../utils/httperr";
import { HttpStatus } from "../../constants/HttpStatus";
import { IOrderHistory } from "../../interfaces/user/IOrderHistory";
import { IOrder } from "../../models/usermodel/orderModel";
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
        throw createHttpError(HttpStatus.BAD_REQUEST, Messages.PRODUCT_ID_NOT_FOUND);
      }
      const existingProductInCart = await Cart.findOne({
        userId,
        hotelId,
        "productDetails.productsId": productId
      });
      if (existingProductInCart) {
        throw createHttpError(HttpStatus.BAD_REQUEST, Messages.DUBLICATE_PRODUCT_IN_CART);
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
  async createOrder(userId: string, paymentMetherd: string, selectedDeliveryOption: string): Promise<{ status: number; message: string; totalAmount: number | undefined; orderId: string }> {
    try {
      if (!userId) {
        throw createHttpError(HttpStatus.BAD_REQUEST, Messages.INVALID_USER_ID)
      }
      if (!paymentMetherd || !selectedDeliveryOption) {
        throw createHttpError(HttpStatus.BAD_REQUEST, 'Payment method and total amount are required')
      }

      // Validate payment method
      if (!['Online', 'COD'].includes(paymentMetherd)) {
        throw createHttpError(HttpStatus.BAD_REQUEST, 'Invalid payment method')
      }

      const orderResult = await this._userProducteRepository.createOrder(userId, paymentMetherd, selectedDeliveryOption)

      return {
        status: 200,
        message: 'Order Created Successfully',
        orderId: orderResult.orderId,
        totalAmount: orderResult.totalAmount
      }
    } catch (error) {
      throw error
    }
  }
  async updatePayementStatus(orderId: string, paymentStatus: string, paypalOrderId: string): Promise<{ status: number; message: string; updatedStatus: Object }> {
    try {
      if (!orderId) {
        throw createHttpError(HttpStatus.BAD_REQUEST, 'Invalid Order ID')
      }
      if (!paymentStatus) {
        throw createHttpError(HttpStatus.BAD_REQUEST, 'Payment Status Not Found')
      }
      if (!paypalOrderId) {
        throw createHttpError(HttpStatus.BAD_REQUEST, 'Invalid PayPal Order ID')
      }
      const status = this._userProducteRepository.updatePayementStatus(orderId, paymentStatus, paypalOrderId)
      return { status: 200, message: 'Payment status updated Successfully', updatedStatus: status }
    } catch (error) {
      throw error
    }
  }
  async getOrderHistory(userId: string): Promise<{ status: number, message: string, orderDetails: IOrderHistory[] | null }> {
    try {
      if (!userId) {
        throw createHttpError(HttpStatus.BAD_REQUEST, Messages.USER_ID_REQUIRED)
      }
      const { orderDetails } = await this._userProducteRepository.getOrderHistory(userId)
      return { status: 200, message: 'Order Histery get successfully', orderDetails }
    } catch (error) {
      throw error
    }
  }
  async rePayOrder(orderId: string): Promise<{ status: number; message: string; payementStatus: Object | null } > {
      try {
        if(!orderId) {
          throw createHttpError(HttpStatus.BAD_REQUEST,Messages.INVALID_ORDER_ID_PROVIDED)
        }
        const rePayPaymentStatus = await this._userProducteRepository.rePayOrder(orderId)
        return {status : 200 ,message:'Paid Successfully',payementStatus : rePayPaymentStatus}
      } catch (error) {
         throw error
      }
  }
  async rePayUpdateStatus(orderId: string,payementStatus:string): Promise<{ status: number; message: string; updatedStatus: Object | null; }> {
      try {
        if(!orderId){
          throw createHttpError(HttpStatus.BAD_REQUEST,Messages.INVALID_ORDER_ID_PROVIDED)
        }
        const updatedStatus = await this._userProducteRepository.rePayUpdateStatus(orderId,payementStatus)

        return {
          status : 200,
          message : 'Paid Successfully',
          updatedStatus : updatedStatus
        }
      } catch (error) {
        throw error
      }
  }
  async getOrderDetails(orderId: string): Promise<{ status: number; message: string; orderDetails: IOrderHistory[] | null; }> {
      try {
        if(!orderId){
          throw createHttpError(HttpStatus.BAD_REQUEST,Messages.INVALID_ORDER_ID_PROVIDED)
        }
        const  orderDetails  = await this._userProducteRepository.getOrderDetails(orderId)

        console.log(orderDetails,'THIS IS ORDER DETAILS ');
        
        return {
          status : 200,
          message : 'Order Details Fetched Successfully',
         orderDetails : orderDetails
        }
      } catch (error) {
        throw error
      }
  }
}