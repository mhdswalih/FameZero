import mongoose from "mongoose";
import { IProfileHotelRepositer } from "../../interfaces/hotel/profile/IProfileHotelRepository";
import hotelProfile, { IHotelProfile } from "../../models/hotelModel/hotelProfileModel";
import productModel, { IProducts, IProductsDetails } from "../../models/hotelModel/productModel";
import { BaseRepository } from "../userrepository/baseRepository";



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
                throw new Error(`Product "${product.productName}" already exists for this hotel`);
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
        throw error;
    }
}

    async getAllMenu(userId: string): Promise<IProductsDetails[] | null> {
        return await productModel.find({hotelId:userId})
    }

}