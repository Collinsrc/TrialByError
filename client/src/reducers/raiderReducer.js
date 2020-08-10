import { GET_RAIDERS } from "../actions/types";

const initialState = {
  raiders: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_RAIDERS:
      return {
        ...state,
        raiders: action.payload,
      };
    default:
      return state;
  }
}
