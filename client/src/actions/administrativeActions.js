import axios from "axios";
import { GET_ERRORS, RETURN_IMAGE_NAMES } from "./types";

export const deleteCharacter = (character) => async (dispatch) => {
  await axios
    .post("/api/administrative/deleteCharacter/", character)
    .then((res) => {
      dispatch({
        type: RETURN_IMAGE_NAMES,
        payload: res.data,
      });
    })
    .catch((err) => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const modifyCharacter = (character) => async (dispatch) => {
  await axios
    .post("/api/administrative/modifyCharacter/", character)
    .catch((err) => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const modifyUser = (updateUser) => async (dispatch) => {
  await axios
    .post("/api/administrative/modifyUser/", updateUser)
    .then((res) => {
      if (res.data.detailUpdate === "EAE") {
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

export const deleteUser = (user) => async (dispatch) => {
  await axios
    .post("/api/administrative/deleteUser/", user)
    .then((res) => {
      dispatch({
        type: RETURN_IMAGE_NAMES,
        payload: res.data,
      });
    })
    .catch((err) => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};
