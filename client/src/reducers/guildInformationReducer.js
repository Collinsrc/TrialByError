import { GET_GUILD_INFORMATION } from "../actions/types";

const initialState = {
  guildInformation: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_GUILD_INFORMATION:
      return {
        ...state,
        guildInformation: action.payload,
      };
    default:
      return state;
  }
}
