import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    phone:string;
    profilepic:string;
    isGoogleAuth:boolean;
    isPhoneAuth :boolean;
    password: string;
    role: string;
    isBlocked:boolean;
    isVerified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
    },
    profilepic:{
        type:String,
    },
    phone: {
        type : String,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'hotel']  
    },
    isBlocked : {
        type : Boolean,
        default : false
    },
    isGoogleAuth:{
        type:Boolean,
        default:false,
    },
    isPhoneAuth: {
        type:Boolean,
        default :false
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,  
});



export const User = mongoose.model<IUser>('users', userSchema);