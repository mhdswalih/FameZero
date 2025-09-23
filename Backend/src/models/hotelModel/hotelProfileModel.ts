import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../usermodel/userModel";


export interface IHotelProfile extends Document {
    _id: string;
    userId: Schema.Types.ObjectId | IUser;
    name: string;
    email: string;
    idProof: string;
    status: string;
    profilepic: string;
    location: {
    type: "Point";       
    coordinates: number[];
    locationName: string;
  };
    city: string;
    phone: string;
}

const hotelProfileSchema = new mongoose.Schema<IHotelProfile>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    name: {
        type: String,

    },
    profilepic: {
        type: String,

    },
    email: {
        type: String,
        trim: true,
        unique : true
    },
    idProof: {
        type: String,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            
        },
        locationName : {
            type : String,
        }
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
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

const hotelProfile = mongoose.model<IHotelProfile>('hotelProfile', hotelProfileSchema, 'hotelProfile');
export default hotelProfile;