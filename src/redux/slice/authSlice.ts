import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface IAuthState {
    isLoggedIn: boolean;
    email: null | string;
    userName: null | string;
    userID: null | string;
}

const initialState = {
    isLoggedIn: false,
    email: null,
    userName: null,
    userID: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // action 생성
        SET_ACTIVE_USER: (state, action) => {
            // console.log('action.payload: ', action.payload);
            const { email, userName, userID } = action.payload;
            state.isLoggedIn = true;
            state.email = email;
            state.userName = userName;
            state.userID = userID;
        },
        // it still works even if no arrow function.
        REMOVE_ACTIVE_USER: (state) => {
            state.isLoggedIn = false;
            state.email = null;
            state.userName = null;
            state.userID = null;
        },
    },
});

// exporting actions
export const { SET_ACTIVE_USER, REMOVE_ACTIVE_USER } = authSlice.actions;

// exporting the states
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectEmail = (state: RootState) => state.auth.email;
export const selectUserName = (state: RootState) => state.auth.userName;
export const selectUserID = (state: RootState) => state.auth.userID;

export default authSlice.reducer;
