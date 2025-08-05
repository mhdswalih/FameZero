import { FilterQuery, UpdateQuery, Document, Model, QueryOptions } from "mongoose"
export interface IBaseRepository<T extends Document> {
    create(data: Partial<T>): Promise<T>
    findById(id: string): Promise<T | null>;
    findOne(filter: FilterQuery<T>): Promise<T | null>;
    findByEmail(email:string):Promise<T | null> 
    findAll(): Promise<T[]>;
    find(filter: FilterQuery<T>, option?: QueryOptions): Promise<T[]>;
    findWithPagination(
        filter: FilterQuery<T>,
        page: number,
        limit: number,
        sort?: Record<string, 1 | -1>
    ): Promise<{ data: T[]; total: number }>;
    update(id: string, data: UpdateQuery<T>): Promise<T | null>;
    delete(id: string): Promise<T | null>;
    countDocument(filter: FilterQuery<T>): Promise<number>;
}