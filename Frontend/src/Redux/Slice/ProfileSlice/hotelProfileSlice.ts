
import { createSlice } from "@reduxjs/toolkit";

interface HotelProfile {
    name: string,
    profilepic:string,
    status:string,
    phone: string,
    location: string,
    idProof:string,
    role:string;
    city: string,

}

const initialState : HotelProfile = {
    name: '',
    profilepic: "",
    role:'',
    status:'',
    phone: '',
    location: '',
    idProof:'',
    city: '',
}

const hotelProfileSlice = createSlice({
    name : 'hotelProfile',
    initialState,
    reducers : {
        addHotelProfile : (state,action) =>{
            state.name =  action.payload.name, 
            state.profilepic = action.payload.profilepic,
            state.status = action.payload.status,
            state.location = action.payload.location,
            state.idProof = action.payload.idProof, 
            state.phone = action.payload.phone,
            state.role = action.payload.role,
            state.city = action.payload.city
        },
        removeHotelProfile : () =>{
            return initialState
        }
    }

})

export const {addHotelProfile,removeHotelProfile} = hotelProfileSlice.actions
export default hotelProfileSlice.reducer