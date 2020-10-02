import axios from "axios";
import { GET_ERRORS, GET_ALL_MAIN_DATA } from "./types";

export const getAllMainData = () => async (dispatch) => {
  await axios
    .get("/api/mainData/getAllMainData/")
    .then((res) => {
      dispatch({
        type: GET_ALL_MAIN_DATA,
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

// Create a new post
export const createPost = (post) => async (dispatch) => {
  await axios
    .post("/api/mainData/createPost", post)
    .then((res) => {
      if (res.data.post === "TPAE") {
        dispatch({
          type: GET_ERRORS,
          payload: res.data,
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

//Delete a post
export const deletePost = (post) => async (dispatch) => {
  await axios
    .post("/api/mainData/deletePost", post)
    .catch((err) => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};
