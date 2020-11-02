import axios from "axios";
import { GET_ERRORS, VALIDATE_RECAPTCHAV2 } from "./types";

export const validateRecaptchaV2 = (token) => async (dispatch) => {
  let tokenObject = {
    token: token,
  };
  await axios
    .post("/api/google/validateRecaptchaV2", tokenObject)
    .then((res) => {
      if (res.data.success) {
        dispatch({
          type: VALIDATE_RECAPTCHAV2,
          payload: true,
        });
      } else {
        dispatch({
          type: VALIDATE_RECAPTCHAV2,
          payload: false,
        });
      }
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};
