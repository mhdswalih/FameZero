import { IProductsDetails } from "../../../models/hotelModel/productModel"


export interface IProductRepository {
    addToCart(productId:string,userId:string,hotelId:string):Promise<void>
    getCart(userId:string):Promise<IProductsDetails[] | null>
    removeFromCart(productId:string,userId:string):Promise<void>
    updateStockInCart(userId:string,productId:string,action:"increment" | "decrement"):Promise<{updatedQuantity:number}>
}