import mongoose, { Schema } from "mongoose";
import { IProfileHotelRepositer } from "../../interfaces/hotel/profile/IProfileHotelRepository";
import hotelProfile, { IHotelProfile, ILike, IReview } from "../../models/hotelModel/hotelProfileModel";
import productModel, { IProducts, IProductsDetails } from "../../models/hotelModel/productModel";
import { BaseRepository } from "../userrepository/baseRepository";
import { IHotelFullProfile } from "./hotelInterface";
import { createHttpError } from "../../utils/httperr";
import { HttpStatus } from "../../constants/HttpStatus";
import { Messages } from "../../constants/Messeges";
import Order, { IOrder } from "../../models/usermodel/orderModel";
import Product from "../../models/hotelModel/productModel";



export class HotelProfileRepository extends BaseRepository<IHotelProfile> implements IProfileHotelRepositer {
  constructor() {
    super(hotelProfile)
  }
  async create(data: Partial<IHotelProfile>): Promise<IHotelProfile> {
    return await this.model.create(data)
  }
  async findByHotelId(userId: string): Promise<IHotelProfile | null> {
    return await this.model.findOne({ userId }).exec();
  }
  async updateHotelProfile(userId: string, profileData: Partial<IHotelProfile>): Promise<IHotelProfile | null> {
    return await this.model.findOneAndUpdate(
      { userId },
      { $set: profileData },
      { new: true, upsert: true, runValidators: true }
    );
  }
  async reRequstHotelProfile(id: string): Promise<IHotelProfile | null> {
    const cleanedId = id.replace(/^:/, '');
    return await this.model.findByIdAndUpdate(cleanedId, { status: 'Pending' }, { new: true })
  }
  async addProducts(hotelId: string, newProducts: IProductsDetails[]) {
    try {
      const currentProducts = newProducts.filter(item => item.productName);

      for (const product of currentProducts) {
        const existingItem = await productModel.findOne({
          hotelId,
          "productDetails.productName": product.productName
        });
        if (existingItem) {
          throw createHttpError(HttpStatus.BAD_REQUEST, `Product "${product.productName}" already exists for this hotel`);
        }
      }
      let existProduct = await productModel.findOne({ hotelId });

      if (existProduct) {
        existProduct.productDetails.push(...currentProducts);
      } else {
        existProduct = new productModel({
          hotelId: hotelId,
          productDetails: currentProducts
        });
      }

      return await existProduct.save();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllMenu(userId: string): Promise<IProductsDetails[] | null> {
    return await productModel.find({ hotelId: userId })
  }
  async getHotelDetails(hotelId: string): Promise<IHotelFullProfile[] | null> {
    return await hotelProfile.findOne({ userId: hotelId })
  }
  async ratingAndReview(hotelId: string, review: IReview[]): Promise<IHotelProfile | undefined> {
    const hotel = await hotelProfile.findOne({ userId: hotelId });
    if (hotel) {
      review.forEach(r => {
        const { _id, ...rest } = r as any;

        hotel.review.push({
          ...rest,
          userId: r.userId || hotel?.userId,
          createAt: r.createAt ? new Date(r.createAt) : new Date(),
        });
      });

      hotel.rating = hotel.review.reduce((sum, r) => sum + r.rating, 0) / hotel.review.length;

      const updatedHotel = await hotel.save();
      return updatedHotel;
    }

    return undefined;
  }

  async likeAndUnlike(reviewId: string, userId: string, hotelUserId: string): Promise<void> {
    try {
      // Find hotel by userId
      const hotel = await hotelProfile.findOne({ userId: hotelUserId });
      if (!hotel) throw new Error("Hotel not found");
      const review = hotel.review.find(r => r._id.toString() === reviewId);
      if (!review) throw new Error("Review not found");
      const existingLikeIndex = review.like.findIndex(
        l => l.userId.toString() === userId.toString()
      );

      if (existingLikeIndex > -1) {
        review.like.splice(existingLikeIndex, 1);
      } else {
        review.like.push({ like: 1, userId: new mongoose.Types.ObjectId(userId) } as any);
      }
      review.totalLike = review.like.reduce((sum, l) => sum + (l.like || 0), 0);
      await hotel.save();

    } catch (error) {
      throw error;
    }
  }
  async getOrderList(hotelId: string): Promise<IOrder[] | undefined> {
    try {
      const orders = await Order.aggregate([
        {
          $match: {
            hotelId: new mongoose.Types.ObjectId(hotelId),
          },
        },
        {
          $lookup: {
            from: "userprofile",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 1,
            orderDate: 1,
            totalAmount: 1,
            orderStatus: 1,
            paymentStatus: 1,
            selectedPaymentMethod: 1,
            orderMethod: 1,
            products: 1,
            "user.name": 1,
            "user.email": 1,
            "user.city": 1,
            "user.address": 1,
            "user.profilepic": 1,
            "user.phone": 1,
            "user.userId": 1
          },
        },
      ]);

      return orders;
    } catch (error) {
      throw error;
    }

  }
  async updatedOrderStatus(orderId: string, orderStatus: string): Promise<string | null> {
    return await Order.findByIdAndUpdate(orderId, { orderStatus: orderStatus })
  }
  async deleteProduct(productId: string): Promise<boolean | null> {
    try {

      const result = await productModel.updateOne(
        { "productDetails._id": productId },
        { $pull: { productDetails: { _id: productId } } }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      throw error

    }
  }

  async updateProducts(
    updatedProduct: IProductsDetails,
    productId: string,
    hotelId: string
  ): Promise<Object | null> {
    try {
      const res = await productModel.updateOne(
        {
          hotelId: new mongoose.Types.ObjectId(hotelId),
          "productDetails._id": productId,
        },
        { productDetails: updatedProduct }
      );
      return res;
    } catch (error) {
      throw error;
    }
  }
  async updateRreviews(reviewId: string, hotelId: string, updateReviews: IReview[]): Promise<void> {
    try {
      const updatedHotel = await hotelProfile.findOneAndUpdate(
        {
          userId: hotelId,          // match hotel by userId
          "review._id": reviewId    // match the review inside array
        },
        {
          $set: {
            "review.$": updateReviews[0] // update only the matched review
          }
        },
        { new: true } // returns the updated document
      );

      if (!updatedHotel) {
        console.log("No matching hotel/review found");
      } else {
        console.log("Review updated successfully:", updatedHotel.review);
      }
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  }


  async deleteReviews(reviewId: string, hotelId: string): Promise<IReview[] | null> {
    try {
      const updatedHotel = await hotelProfile.findOneAndUpdate(
        { userId: hotelId },
        { $pull: { review: { _id: reviewId } } }, 
        { new: true } 
      );
      if (updatedHotel) {
        return updatedHotel.review;
      }
      return null;
    } catch (error) {
      throw error
    }
  }

}