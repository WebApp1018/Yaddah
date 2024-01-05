import { combineReducers } from "redux";
import authReducer from "./auth/authSlice";
import commonReducer from "./common/commonSlice";
import settingSlice from "./setting/settingSlice";

const rootReducer = combineReducers({
  authReducer,
  commonReducer,
  settingSlice
});

export default rootReducer;
