import { createSlice,PayloadAction } from '@reduxjs/toolkit'

interface UserState  {
    name : string;
    email : string;
    token : string | null;
    isLoggedIn : boolean;
}

const initialState:UserState = {
    name : '',
    email : '',
    token : null,
    isLoggedIn : false
}

const loginSlice = createSlice({
    name:'login',
    initialState,
    reducers : {
        login : (
            state,action :PayloadAction<{name:string;email:string;token:string}>
        )=>{
            state.name = action.payload.name
            state.email = action.payload.email
            state.token = action.payload.token
            state.isLoggedIn = true
        },
        logout : (state) => {
            state.name = ''
            state.email = ''
            state.token = null
            state.isLoggedIn = false

        }
    } 
})

export const {login,logout} = loginSlice.actions

export default loginSlice.reducer