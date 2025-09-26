import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../usermodel/userModel";

export interface IReview {
    userId: Schema.Types.ObjectId | IUser
    _id:string;
    profilePic:string;
    name: string;
    reviweIMG:string
    rating: number;
    comment: string;
    like: number;
    createAt: Date;
}

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
    review: IReview[]
    city: string;
    phone: string;
    rating: number;
}

const reviewScheme = new mongoose.Schema<IReview>({
    userId : {type : Schema.Types.ObjectId,ref:'Users'},
    name : {type : String},
    profilePic : {type : String},
    rating : {type : Number},
    reviweIMG : {type : String},
    comment : {type:String},
    like:{type : Number},
    createAt : {type : Date,default: Date.now}
})

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
        unique: true
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
        locationName: {
            type: String,
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
    review: {
        type: [reviewScheme]
    },
    phone: {
        type: String,
        trim: true,

    },
    rating : {
        type:Number,
        default : 0
    }
});

const hotelProfile = mongoose.model<IHotelProfile>('hotelProfile', hotelProfileSchema, 'hotelProfile');
export default hotelProfile;