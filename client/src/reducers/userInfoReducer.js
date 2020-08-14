import { GET_USER_INFO } from "../actions/types";

const initialState = {
  userData: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_USER_INFO:
      return {
        ...state,
        userData: action.payload,
      };
    default:
      return state;
  }
}
