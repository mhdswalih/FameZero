import mongoose, { Document } from "mongoose";
import { IUser } from "./userModel";

export interface IUserProfile extends Document {
    _id:string;
    userId : IUser;
    profilePic:string;
    address1:string;
    address2:string;
    city:string;
    phone:string;
}

const userProfileSchema = new mongoose.Schema<IUserProfile>({
    userId:{
        type : String,
        ref : 'users',
        required : true
    },
    profilePic:{
        type : String,
        required:true,
    },
    address1 : {
        type : String,
        required : true,
        trim:true
    },
    address2 : {
        type : String,
        required : true,
        trim:true
    },
    city : {
        type : String,
        required : true,
        trim:true
    },
    phone : {
        type:String,
        trim : true,
        required : true
    }
})

const userProfile = mongoose.model<IUserProfile>('userprofile',userProfileSchema,'userprofile')
export default userProfile