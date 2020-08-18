import axios from "axios";
import { GET_FORUMS, GET_ERRORS } from "./types";

export const getForums = () => async (dispatch) => {
  await axios.get("/api/forums/getForums/").then((res) => {
    if (res.data === "NA") {
      dispatch({
        type: GET_ERRORS,
        payload: "No Forums Retrieved",
      });
    } else {
      dispatch({
        type: GET_FORUMS,
        payload: res.data,
      });
    }
  });
};
