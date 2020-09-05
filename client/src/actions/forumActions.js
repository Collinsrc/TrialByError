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

// Create a new Forum
export const createForum = (forum) => async (dispatch) => {
  await axios
    .post("/api/forums/createForum", forum)
    .then((res) => {
      if (res.data.forum === "Title of forum already exists") {
        dispatch({
          type: GET_ERRORS,
          payload: res.data,
        });
      } else if (res.data.forum === "Couldn't add forum into database") {
        dispatch({
          type: GET_ERRORS,
          paylod: res.data,
        });
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: {},
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
