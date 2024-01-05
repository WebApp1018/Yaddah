import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: "",
  isLogin: false,
  user: null,
  isOpen: false,
  fcmToken: null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  //   reducer needs a map
  reducers: {
    SaveFcmToken(state, action) {
      state.fcmToken = action.payload.fcmToken;
    },
    saveLoginUserData(state, action) {
      state.user = action.payload.data.user;
      state.isLogin = true;
      state.accessToken = action.payload.data.token;
    },
    updateUser(state, action) {
      state.user = action.payload;
    },
    signOutRequest(state) {
      state.accessToken = "";
      state.isLogin = false;
      state.user = null;
    },
    ToggleDrawer(state, action) {
      state.isOpen = action.payload;
    },
  },
});

export const {
  SaveFcmToken,
  saveLoginUserData,
  signOutRequest,
  ToggleDrawer,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;
