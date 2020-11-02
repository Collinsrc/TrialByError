import { VALIDATE_RECAPTCHAV2 } from "../actions/types";

const initialState = {
  isValidRecaptcha: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case VALIDATE_RECAPTCHAV2:
      return {
        ...state,
        isValidRecaptcha: action.payload,
      };
    default:
      return state;
  }
}
