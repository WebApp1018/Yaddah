import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: "",
  isLogin: false,
  user: null,
  mode: "light",
  isOpen: false,
  fcmToken: "",
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  //   reducer needs a map
  reducers: {
    saveLoginUserData(state, action) {
      state.user = action.payload.data.user;
      state.isLogin = true;
      state.accessToken = action.payload?.data.token;
    },
    updateUser(state, action) {
      state.user = action.payload;
    },
    signOutRequest(state) {
      state.accessToken = "";
      state.isLogin = false;
      state.user_type = "";
      state.user = null;
    },
    ToggleDrawer(state, action) {
      state.isOpen = action.payload;
    },
  },
});

export const { saveLoginUserData, signOutRequest, ToggleDrawer, updateUser } =
  authSlice.actions;

export default authSlice.reducer;
