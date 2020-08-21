import axios from "axios";
import { GET_FORUMS, GET_ERRORS, GET_SINGLE_FORUM } from "./types";

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

export const getForum = (forumTitle) => async (dispatch) => {
  await axios.get("/api/forums/getForum/" + forumTitle).then((res) => {
    if (res.data === "NA") {
      dispatch({
        type: GET_ERRORS,
        payload: "No Forum Retrieved",
      });
    } else {
      dispatch({
        type: GET_SINGLE_FORUM,
        payload: res.data,
      });
    }
  });
};
