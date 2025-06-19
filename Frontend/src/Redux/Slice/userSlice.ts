import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'js-cookie';
interface UserState {
    _id: string;
    name: string;
    email: string;
    role:string;
    token: string | null;
    isLoggedIn: boolean;
}

const initialState: UserState = {
    _id: '',
    name: '',
    email: '',
    role:'',
    token: null,
    isLoggedIn: false
}

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        login: (
            state, action: PayloadAction<{ name: string; email: string; role:string, token: string, _id: string }>
        ) => {
            state._id = action.payload._id
            state.name = action.payload.name
            state.email = action.payload.email
            state.token = action.payload.token
            state.role = action.payload.role
            state.isLoggedIn = true
        },
        logout: (state) => {
            state._id = ''
            state.name = ''
            state.email = ''
            state.role = ''
            state.token = null
            state.isLoggedIn = false
            Cookies.remove('token')
        }
    }
})

export const { login, logout } = loginSlice.actions

export default loginSlice.reducer