import { GET_ALL_MAIN_DATA } from "../actions/types";

const initialState = {
  mainData: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ALL_MAIN_DATA:
      return {
        ...state,
        mainData: action.payload,
      };
    default:
      return state;
  }
}
