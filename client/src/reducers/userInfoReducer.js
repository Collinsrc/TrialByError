import {
  GET_USER_INFO,
  SET_USER_ADMIN_STATUS,
  GET_PROFILE_INFO,
  GET_ALL_USERS,
} from "../actions/types";

const initialState = {
  userData: {},
  userIsAdmin: "",
  profileData: {},
  allUserData: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_USER_INFO:
      return {
        ...state,
        userIsAdmin: action.payload.isAdmin,
        userData: action.payload,
      };
    case SET_USER_ADMIN_STATUS:
      return {
        ...state,
        userIsAdmin: action.payload,
      };
    case GET_PROFILE_INFO:
      return {
        ...state,
        profileData: action.payload,
      };
    case GET_ALL_USERS:
      return {
        ...state,
        allUserData: action.payload,
      };
    default:
      return state;
  }
}
