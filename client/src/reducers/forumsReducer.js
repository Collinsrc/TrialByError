import {
  GET_ALL_FORUM_DATA,
  GET_FORUMS,
  GET_SINGLE_FORUM,
} from "../actions/types";

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
    case GET_SINGLE_FORUM:
      return {
        ...state,
        forumData: action.payload,
      };
    case GET_ALL_FORUM_DATA:
      return {
        ...state,
        forumData: action.payload,
      };
    default:
      return state;
  }
}
