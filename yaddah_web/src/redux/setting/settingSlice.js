import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  googleMapsApiKey: null,
  paypalClientId: null,
};

const settingSlice = createSlice({
  initialState,
  name: "settingSlice",
  reducers: {
    setGoogleMapsApiKey: (state, action) => {
      state.googleMapsApiKey = action.payload;
    },
    setPaypalClientId: (state, action) => {
      state.paypalClientId = action.payload;
    },
  },
});

export const { setGoogleMapsApiKey, setPaypalClientId } = settingSlice.actions;
export default settingSlice.reducer;
