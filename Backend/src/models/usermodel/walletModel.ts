import mongoose from "mongoose";

export interface IWallet {
    userId : string;
    productId : string;
    hotelId:string
    totalAmount : number
}

const walletSchema = new mongoose.Schema<IWallet>({
 userId : {type : String , ref : 'User'} ,
 hotelId : {type : String,ref : 'hotelProfile'},
 productId : {type : String,ref:'Products'},
 totalAmount  : {type : Number} 
})

const Wallet = mongoose.model<IWallet>('wallet',walletSchema,'wallet')
export default Wallet