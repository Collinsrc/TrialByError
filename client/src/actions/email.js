import axios from "axios";
import { GET_ERRORS, CONFIRM_EMAIL } from "./types";

export const confirmEmail = (tempUserID) => async (dispatch) => {
  let tempUserIDObject = {
    tempUserID: tempUserID,
  };
  await axios
    .post("/api/emailing/email/confirmEmail/", tempUserIDObject)
    .then((res) => {
      dispatch({
        type: CONFIRM_EMAIL,
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
