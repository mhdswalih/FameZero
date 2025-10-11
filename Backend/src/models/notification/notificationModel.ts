import mongoose, { Schema,Document } from "mongoose";
import { IUser } from "../usermodel/userModel";
import { IHotelProfile } from "../hotelModel/hotelProfileModel";
import { IOrder } from "../usermodel/orderModel";

export interface INotification extends Document {
    hotelId : Schema.Types.ObjectId | IHotelProfile;
    orderId:Schema.Types.ObjectId | IOrder; 
    userId:Schema.Types.ObjectId | IUser;
    messege : string;
    isRead : boolean;
} 

const notificationSchema = new mongoose.Schema<INotification>({
    userId : {type : Schema.Types.ObjectId , ref : 'Users'},
    hotelId :{type : Schema.Types.ObjectId , ref: 'hotelProfile'},
    orderId : {type : Schema.Types.ObjectId ,ref : 'Orders'},
    messege : {type : String},
    isRead : {type : Boolean,default:false}
},{timestamps : true})

const Notifications = mongoose.model('Notifications',notificationSchema,'Notifications')
export default Notifications;