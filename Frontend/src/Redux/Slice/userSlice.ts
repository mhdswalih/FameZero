// loginSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'js-cookie';

interface UserState {
    id: string;
    email: string;
    role: string;
    token: string | null;
}

const initialState: UserState = {
    id: '',
    email: '',
    role: '',
    token: null,
}

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        addUser: (
            state, 
            action: PayloadAction<{ 
                id: string
                email: string; 
                role: string; 
                token: string; 
            }>
        ) => {
            state.id = action.payload.id;
            state.email = action.payload.email;
            state.role = action.payload.role;
            state.token = action.payload.token;
            Cookies.set('token', action.payload.token, { expires: 7 });
        },
        removeUser: () => {
            Cookies.remove('token');
            return initialState;
        }
    }
})

export const { addUser, removeUser } = loginSlice.actions;
export default loginSlice.reducer;