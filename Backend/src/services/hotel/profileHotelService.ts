import { UUID } from "crypto";
import { Messages } from "../../constants/Messeges";
import { IProfileHotelRepositer } from "../../interfaces/hotel/profile/IProfileHotelRepository";
import { IProfileHotelService } from "../../interfaces/hotel/profile/IProfileHotelService";
import { IUserRepository } from "../../interfaces/user/IUserRepository";
import { IHotelProfile } from "../../models/hotelModel/hotelProfileModel";
import { IProducts, IProductsDetails } from "../../models/hotelModel/productModel";
import { comparePassword, hashPassword } from "../../utils/hashPassword";
import { createHttpError } from "../../utils/httperr";
import productModel from '../../models/hotelModel/productModel'
import { HttpStatus } from "../../constants/HttpStatus";
import { IOrder } from "../../models/usermodel/orderModel";
import { Socket } from "socket.io";
import { orderStatusUpdates } from "../../middleware/soket.io";
import { io } from '../../index'



export class HotelProfileService implements IProfileHotelService {
    constructor(private _hotelProfileRepository: IProfileHotelRepositer, private _userRepository: IUserRepository) { }

    async getHotelProfile(hotelId: string): Promise<IHotelProfile | null> {
        return await this._hotelProfileRepository.findByHotelId(hotelId)
    }
    async updateHotelProfile(userId: string, profileData: Partial<IHotelProfile>): Promise<IHotelProfile | null> {
        try {
            if (!userId) {
                throw new Error(Messages.USER_ID_REQUIRED)
            }
            const updateProfile = await this._hotelProfileRepository.updateHotelProfile(userId, profileData)
            if (!updateProfile) {
                throw new Error(Messages.USER_NOT_FOUND)
            }

            if (profileData.email) {
                await this._userRepository.updateEmail(userId, profileData.email);
            }
            return updateProfile
        } catch (error) {
            throw error
        }
    }
    async reqRequstProfile(id: string): Promise<IHotelProfile | null> {
        return await this._hotelProfileRepository.reRequstHotelProfile(id)
    }
    async changePassword(id: string, currentPasswords: string, newPassword: string, confirmPassword: string): Promise<{ status: number; message: string; }> {
        try {
            if (confirmPassword !== newPassword) {
                throw new Error(Messages.PASSWORD_NOT_MATCH)
            }
            const cleanedId = id.replace(/^:/, '')
            const user = await this._userRepository.findById(cleanedId)
            if (!user) {
                throw new Error(Messages.USER_NOT_FOUND)
            }
            if (user.password.length <= 0) {
                throw new Error('You don’t have a password set. Please create a new password.')
            }
            const password = await hashPassword(newPassword)
            const isCurrentPassword = await comparePassword(currentPasswords, user.password)
            if (!isCurrentPassword) {
                throw new Error(Messages.INVALID_CURRENT_PASSWORD)
            }
            const isSamePassword = await comparePassword(newPassword, user.password);
            if (isSamePassword) {
                throw new Error('New password must be different from the current password');
            }
            await this._userRepository.changePassword(cleanedId, password)
            return { status: 200, message: 'Password changed Successfully' }
        } catch (error) {
            throw error
        }
    }
    async addProducts(
        hotelId: string,
        products: IProductsDetails[]
    ): Promise<{ status: number; message: string }> {
        try {
            if (!products || products.length === 0) {
                return { status: 400, message: Messages.PRODUCT_NOT_FOUND };
            }

            // 1. Check duplicates inside request
            const productNames = products.map(p => p.productName);
            const duplicates = productNames.filter((name, i) => productNames.indexOf(name) !== i);

            if (duplicates.length > 0) {
                throw createHttpError(HttpStatus.BAD_REQUEST, Messages.DUBLICATE_PRODUCT);
            }

            // 2. Check duplicates in DB
            const existingProducts = await productModel.findOne({ hotelId });
            if (existingProducts) {
                const existingNames = existingProducts.productDetails
                    .map(item => item.productName)
                    .filter(name => productNames.includes(name));

                if (existingNames.length > 0) {
                    throw createHttpError(HttpStatus.BAD_REQUEST, Messages.DUBLICATE_PRODUCT);
                }
            }

            // 3. Save if no duplicates
            await this._hotelProfileRepository.addProducts(hotelId, products);

            return { status: 200, message: "Products added successfully" };
        } catch (error: any) {
            return { status: 500, message: error.message || "Something went wrong" };
        }
    }


    async getAllMenu(userId: string): Promise<IProductsDetails[] | null> {
        try {
            if (!userId) {
                throw new Error(Messages.INVALID_USER_ID)
            }
            const ListedMenu = await this._hotelProfileRepository.getAllMenu(userId)
            return ListedMenu
        } catch (error) {
            throw error
        }
    }
    async getOrderList(hotelId: string): Promise<IOrder[] | undefined> {
        try {
            if (!hotelId) {
                throw createHttpError(HttpStatus.BAD_REQUEST, Messages.USER_ID_REQUIRED)
            }
            const orders = await this._hotelProfileRepository.getOrderList(hotelId)
            return orders
        } catch (error) {
            throw error
        }
    }
    async updateOrderStatus(orderId: string, userId: string, orderStatus: string) {
       try {
         if (!orderId || !orderStatus || !userId) {
            throw createHttpError(HttpStatus.BAD_REQUEST, 'Order ID or Order Status is missing')
        }

        if (!['Pending', 'Preparing', 'Out_for_delivery', 'Delivered', 'Cancelled', 'Returned'].includes(orderStatus)) {
            throw createHttpError(HttpStatus.BAD_REQUEST, 'Invalid Order Status')
        }
       
        await this._hotelProfileRepository.updatedOrderStatus(orderId, orderStatus)
         console.log(orderId,userId,'THIS ISI FROM SERVICE');
         
        const message = `Your order #${orderId} status updated to ${orderStatus}`

        // Save in DB
        await this._hotelProfileRepository.notificationCreate(userId, message)

        // ✅ Emit via socket (only once)
        orderStatusUpdates(userId, message)

        return { status: 200, message: 'Order Status Updated' }
       } catch (error) {
        console.log(error);
        
        throw error
       }
    }
    async deleteProducts(producId: string): Promise<{ status: number; message: string; }> {
        try {
            if(!producId){
                throw createHttpError(HttpStatus.BAD_REQUEST,Messages.PRODUCT_ID_NOT_FOUND)
            }
            await this._hotelProfileRepository.deleteProduct(producId)
            return {status : 200 ,message : 'Product Deleted Successfully'}
        } catch (error) {
            throw error
        }
    }
    async updatedProducts(updatedProductsData:IProductsDetails,productId:string,hotelId:string):Promise<Object | null>{
        console.log(updatedProductsData,'THIS IS FROM SERVICE');
        
        try {
            if(!hotelId){
                throw createHttpError(HttpStatus.BAD_REQUEST,Messages.INVALID_USER_ID)
            }
            const updatedProducts = await this._hotelProfileRepository.updateProducts(updatedProductsData,productId ,hotelId);
            return updatedProducts;
        } catch (error) {
           throw error;
        }
    }
}   