import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import userInfoReducer from "./userInfoReducer";
import raiderReducer from "./raiderReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  userInfo: userInfoReducer,
  raider: raiderReducer,
});
