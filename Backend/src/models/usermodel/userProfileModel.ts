import mongoose, { Document, Schema} from "mongoose";
import { IUser } from "./userModel";

export interface IUserProfile extends Document {
    _id: string;
    userId: Schema.Types.ObjectId | IUser;
    name:string;
    email:string;
    zipcode:string;
    profilepic: string;
    address1: string;
    address2: string;
    city: string;
    phone: string;
}
 
const userProfileSchema = new mongoose.Schema<IUserProfile>({
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
    email:{
        type:String,
        trim:true
    },
    zipcode:{
        type:String,
        trim:true
    },
    address1: {
        type: String,
        
        trim: true
    },
    address2: {
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

const userProfile = mongoose.model<IUserProfile>('userprofile', userProfileSchema, 'userprofile');
export default userProfile;