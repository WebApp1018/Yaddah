import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: true,
  allCategories: [],
  allStaffs: [],
  allVenues: [],
  cms: {
    home: null,
    aboutUs: null,
    services: null,
    faq: null,
    contactUs: null,
    footer: null,
  },
  noti_counter: 0,
  chat_counter: 0,
};

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  //   reducer needs a map
  reducers: {
    toggleDrawer(state, action) {
      state.sidebarOpen = action.payload;
    },
    setAllCategories: (state, action) => {
      state.allCategories = action.payload;
    },
    setAllStaffs: (state, action) => {
      state.allStaffs = action.payload;
    },
    setAllVenues: (state, action) => {
      state.allVenues = action.payload;
    },
    setCms: (state, action) => {
      state.cms = action.payload;
    },
    saveNotiData(state, action) {
      state.noti_counter += action?.payload || 1;
    },
    clearNotiData(state) {
      state.noti_counter = 0;
    },
    saveChatCounter(state) {
      state.chat_counter += 1;
    },
    clearChatCounter(state) {
      state.chat_counter = 0;
    },
  },
});

export const {
  toggleDrawer,
  setAllCategories,
  setAllStaffs,
  setAllVenues,
  setCms,
  saveNotiData,
  saveChatCounter,
  clearChatCounter,
  clearNotiData,
} = commonSlice.actions;

export default commonSlice.reducer;
