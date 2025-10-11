import { FilterQuery, UpdateQuery, Document, Model, QueryOptions } from "mongoose"
import { INotification } from "../../models/notification/notificationModel";
export interface IBaseRepository<T extends Document> {
    create(data: Partial<T>): Promise<T>
    findById(id: string): Promise<T | null>;
    findByHotelId(hotelId:string):Promise<T | null>
    findOne(filter: FilterQuery<T>): Promise<T | null>;
    findByEmail(email:string):Promise<T | null> 
    findByPhone(phone:string):Promise<T | null>
    findAll(): Promise<T[]>;
    findOneProduct(productId:string):Promise<T | null>
    findOneCart(userId:string,productId:string):Promise<T | null>
    find(filter: FilterQuery<T>, option?: QueryOptions): Promise<T[]>;
    findWithPagination(
        filter: FilterQuery<T>,
        page: number,
        limit: number,
        sort?: Record<string, 1 | -1>
    ): Promise<{ data: T[]; total: number }>;
    update(id: string, data: UpdateQuery<T>): Promise<T | null>;
    updatePassword(email:string,hashedPassword:string):Promise<T | null>
    delete(id: string): Promise<T | null>;
    countDocument(filter: FilterQuery<T>): Promise<number>;
    notificationCreate(orderId:string,messege:string):Promise<INotification | undefined>
}