import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import userInfoReducer from "./userInfoReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  userInfo: userInfoReducer,
});
