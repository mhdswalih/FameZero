// profileSlice.ts
import { createSlice,} from '@reduxjs/toolkit'

interface UserProfileState {
    _id:string
    name:string;
    profilepic: string;
    phone: string;
    address: string;
    city: string;
}

const initialState: UserProfileState = {
    _id:'',
    name : '',
    profilepic: '',
    phone: '',
    address: '',
    city: '',
}
const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        addUserProfile: (state, action) => {  
            state._id = action.payload._id
            state.name = action.payload.name 
            state.profilepic = action.payload.profilepic;
            state.phone = action.payload.phone;
            state.address = action.payload.address;
            state.city = action.payload.city;
         
        },
        removeUserProfile: () => {
            return initialState;
        },
  
    }
})

export const { addUserProfile, removeUserProfile } = profileSlice.actions;
export default profileSlice.reducer;