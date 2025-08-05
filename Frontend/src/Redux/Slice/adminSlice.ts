import Cookies from 'js-cookie';
import { createSlice,PayloadAction } from '@reduxjs/toolkit'


interface AdminState {
    _id:string;
    email:string;
    token:string|null;
}

const initialState : AdminState = {
    _id:'',
    email:'',
    token:'',
}

const adminLoginSlice = createSlice({
    name:'adminLogin',
    initialState,
    reducers:{
        Login:(
            state,action:PayloadAction<{email:string,token:string,_id:string}>
        ) => {
            state._id = action.payload._id
            state.email = action.payload.email
            state.token = action.payload.token
        },
        Logout:(state) => {
            state._id = ''
            state.email = ''
            state.token = null
            Cookies.remove('token')
        }
    }
})

export const {Login,Logout} = adminLoginSlice.actions

export default adminLoginSlice.reducer