import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: true,
  notifications: [],
  noti_counter: 0,
};

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  //   reducer needs a map
  reducers: {
    ToggleDrawer(state, action) {
      state.sidebarOpen = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    saveNotiData(state, action) {
      state.noti_counter += action?.payload || 1;
    },
    clearNotiData(state, action) {
      state.noti_counter = 0;
    },
  },
});

export const { toggleDrawer, setNotifications, saveNotiData, clearNotiData } =
  commonSlice.actions;

export default commonSlice.reducer;
