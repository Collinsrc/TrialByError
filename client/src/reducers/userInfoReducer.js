import { GET_USER_INFO, SET_USER_ADMIN_STATUS } from "../actions/types";

const initialState = {
  userData: {},
  userIsAdmin: "",
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
    default:
      return state;
  }
}
