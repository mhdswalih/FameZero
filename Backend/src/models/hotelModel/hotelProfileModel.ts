import mongoose, { Document, Schema} from "mongoose";
import { IUser } from "../usermodel/userModel";


export interface IHotelProfile extends Document {
    _id: string;
    userId: Schema.Types.ObjectId | IUser;
    name:string;
    email:string;
    zipcode:string;
    profilepic: string;
    address: string;
    foodlicensepic:string;
    city: string;
    phone: string;
}
 
const hotelProfileSchema = new mongoose.Schema<IHotelProfile>({
    userId: {
        type:Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    name : {
        type:String,
       
    },
    profilepic: {
        type: String,
       
    },
    foodlicensepic: {
        type:String,
    },
    email:{
        type:String,
        trim:true
    },
    zipcode:{
        type:String,
        trim:true
    },
    address: {
        type: String,
        
        trim: true
    },
    city: {
        type: String,
     
        trim: true
    },
    phone: {
        type: String,
        trim: true,
     
    }
});

const hotelProfile = mongoose.model<IHotelProfile>('hotelprofile', hotelProfileSchema, 'hotelprofile');
export default hotelProfile;