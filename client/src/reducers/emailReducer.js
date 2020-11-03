import { CONFIRM_EMAIL } from "../actions/types";

const initialState = {
  emailConfirmed: false,
  message: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CONFIRM_EMAIL:
      return {
        ...state,
        emailConfirmed: action.payload.emailConfirmed,
        message: action.payload.message,
      };
    default:
      return state;
  }
}
