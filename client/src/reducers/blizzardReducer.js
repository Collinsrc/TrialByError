import { VERIFY_CHARACTER_EXISTS } from "../actions/types";

const initialState = {
  characterExists: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case VERIFY_CHARACTER_EXISTS:
      return {
        ...state,
        characterExists: action.payload,
      };
    default:
      return state;
  }
}
