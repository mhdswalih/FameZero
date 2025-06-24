import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
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
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'hotel']  
    },
  
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,  
});



export const User = mongoose.model<IUser>('users', userSchema);