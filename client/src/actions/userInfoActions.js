import axios from "axios";
import { GET_USER_INFO, GET_ERRORS } from "./types";

export const getUserInfo = (username) => async (dispatch) => {
  await axios
    .get("/api/users/getUserInfo/" + username)
    .then((res) =>
      dispatch({
        type: GET_USER_INFO,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};
