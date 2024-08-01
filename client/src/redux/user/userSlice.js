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
      console.log("state in signInStart", state);
    },
    signInSuccess: (state, action) => {
      console.log("action.payload in signInSuccess",action);
      state.currentUser = action.payload.user;
      state.loading = false;
      state.error = null;
      console.log("signInSuccess state", state.currentUser);
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      console.log("signInfailure state", state);
    },
    signOutUserStart: (state) => {
      state.loading = true;
    },
    signOutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
      console.log("state", state);
    },
    signOutUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      console.log("action in signout failure", action);
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      console.log("action in updateUserSuccess",action);
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
      console.log("state.currentUser in updateUser reducer", state.currentUser);
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
      console.log("deleteUSer success", state);
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      console.log("deleteUserFailure", action);
    },
  },
});
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} = userSlice.actions;

export default userSlice.reducer;
