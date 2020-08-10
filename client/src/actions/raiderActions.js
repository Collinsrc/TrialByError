import axios from "axios";
import { GET_ERRORS, GET_RAIDERS } from "./types";

export const getRaiders = () => async (dispatch) => {
  await axios
    .get("/api/raiders/getRaiders/")
    .then((res) =>
      dispatch({
        type: GET_RAIDERS,
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
