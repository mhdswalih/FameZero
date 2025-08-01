
import { createSlice } from "@reduxjs/toolkit";

interface HotelProfile {
    name: string,
    profilepic:string,
    phone: string,
    location: string,
    idProof:string,
    city: string,

}

const initialState : HotelProfile = {
    name: '',
    profilepic: "",
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
            state.profilepic = action.payload.profilepic
            state.location = action.payload.location,
            state.idProof = action.payload.idProof, 
            state.phone = action.payload.phone,
            state.city = action.payload.city
        },
        removeHotelProfile : () =>{
            return initialState
        }
    }

})

export const {addHotelProfile,removeHotelProfile} = hotelProfileSlice.actions
export default hotelProfileSlice.reducer