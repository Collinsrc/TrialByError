import { GET_FORUMS } from "../actions/types";

const initialState = {
  forumData: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_FORUMS:
      return {
        ...state,
        forumData: action.payload,
      };
    default:
      return state;
  }
}
