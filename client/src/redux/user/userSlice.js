// Creating a slice requires a string name to identify the slice, 
// an initial state value, and one or more reducer functions to define how the state can be updated.
// Once a slice is created, we can export the generated Redux action creators and the reducer function for the whole slice.
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({ 
    name: "user",
    initialState,
    reducers: {
       signInStart: (state) => {
        state.loading = true;
       },
       signInSuccess: (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
        state.error = null;
       },
       signInFailure: (state, action) => {
        state.error = action.payload;
        state.loading = false;
       },
       updateUserStart: (state) => {
        state.loading = true;
       },
       updateUserSuccess: (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
        state.error = null;
       },
       updateUserFailure: (state, action) => {
        state.error = action.payload;
        state.loading = false;
       },
       deleteUserStart: (state) => {
        state.loading = true;
       },
       deleteUserSuccess: (state) => {
        state.currentUser = null;
        state.loading = false;
        state.error = null;
       }, 
       deleteUserFailure: (state, action) => {
        state.error = action.payload;
        state.loading = false;
       },
       signOutUserStart: (state) => {
        state.loading = true;
       },
       signOutUserSuccess: (state) => {
        state.currentUser = null;
        state.loading = false;
        state.error = null;
       }, 
       signOutUserFailure: (state, action) => {
        state.error = action.payload;
        state.loading = false;
       },
    },
});

export const { 
    signInStart, 
    signInSuccess, 
    signInFailure, 
    updateUserFailure, 
    updateUserStart, 
    updateUserSuccess,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutUserStart,
    signOutUserSuccess,
    signOutUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
