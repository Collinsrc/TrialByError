import { RETURN_IMAGE_NAMES } from "../actions/types";

const initialState = {
  imageData: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case RETURN_IMAGE_NAMES:
      return {
        ...state,
        imageData: action.payload,
      };
    default:
      return state;
  }
}
