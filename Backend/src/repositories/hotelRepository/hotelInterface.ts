import { IReview } from "../../models/hotelModel/hotelProfileModel";


export interface IHotelFullProfile {
    id:string;
    userId:string;
    name : string;
    email:string;
    status:string;
    phone:string;
    location:string;
    city:string;
    rating:number;
    review  : IReview[]
    profilepic:string;
    idProof:string;
}