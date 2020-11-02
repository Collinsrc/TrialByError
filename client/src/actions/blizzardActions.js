import axios from "axios";
import { GET_ERRORS, VERIFY_CHARACTER_EXISTS } from "./types";

export const verifyCharacterExists = (characterName) => async (dispatch) => {
  await axios
    .get("/api/blizzard/verifyCharacterExists/" + characterName.toLowerCase())
    .then((res) => {
      if (res.data === "CDNE") {
        dispatch({
          type: VERIFY_CHARACTER_EXISTS,
          payload: false,
        });
      } else if (res.data === true) {
        dispatch({
          type: VERIFY_CHARACTER_EXISTS,
          payload: true,
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
