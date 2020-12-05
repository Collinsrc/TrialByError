import axios from "axios";
import { GET_ERRORS, GET_GUILD_INFORMATION } from "./types";

export const getGuildInformation = () => async (dispatch) => {
  await axios
    .get("/api/guildInformation/getGuildInformation/")
    .then((res) => {
      dispatch({
        type: GET_GUILD_INFORMATION,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};
