import { IProductsDetails } from "../../../models/hotelModel/productModel"
import { ICart } from "../../../models/usermodel/cartModel"
import { IOrder } from "../../../models/usermodel/orderModel"
import { IOrderHistory } from "../IOrderHistory"


export interface IProductRepository {
    addToCart(productId:string,userId:string,hotelId:string):Promise<void>
    getCart(userId:string):Promise<IProductsDetails[] | null>
    removeFromCart(productId:string,userId:string):Promise<void>
    updateStockInCart(userId:string,productId:string,action:"increment" | "decrement"):Promise<{updatedQuantity:number}>
    getCheckOut(userId:string):Promise<ICart |null>
    createOrder(userId:string,paymentMetherd:string,selectedDeliveryOption:string):Promise<{totalAmount:number | undefined,orderId:string}>
    updatePayementStatus(orderId:string,paymentStatus:string, paypalOrderId:string):Promise<{paymentStatus:string} | null>
    getOrderHistory(userId:string):Promise<{orderDetails : IOrderHistory [] | null}>
    rePayOrder(orderId:string):Promise<{paymentStatus:string} | null>
    rePayUpdateStatus (orderId:string,payementStatus:string):Promise<{orderStatus:string} | null>
    getOrderDetails (orderId:string):Promise<IOrderHistory[] | null>
    cancelOrder(orderId:string,userId:string):Promise<void>
}