// profileSlice.ts
import { createSlice,} from '@reduxjs/toolkit'

interface UserProfileState {
    name:string;
    profilepic: string;
    phone: string;
    address: string;
    city: string;
}

const initialState: UserProfileState = {
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