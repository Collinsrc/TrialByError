import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import userInfoReducer from "./userInfoReducer";
import raiderReducer from "./raiderReducer";
import forumsReducer from "./forumsReducer";
import administrationReducer from "./administrationReducer";
import mainDataReducer from "./mainDataReducer";
import recaptchaReducer from "./recaptchaReducer";
import blizzardReducer from "./blizzardReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  userInfo: userInfoReducer,
  raider: raiderReducer,
  forums: forumsReducer,
  administration: administrationReducer,
  mainData: mainDataReducer,
  recaptcha: recaptchaReducer,
  blizzard: blizzardReducer,
});
