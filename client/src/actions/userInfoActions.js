import axios from "axios";
import {
  GET_USER_INFO,
  GET_ERRORS,
  SET_USER_ADMIN_STATUS,
  GET_PROFILE_INFO,
} from "./types";

export const getUserInfo = (username) => async (dispatch) => {
  await axios
    .get("/api/users/getUserInfo/" + username)
    .then((res) => {
      localStorage.setItem("loggedInUserIsAdmin", res.data.isAdmin);
      dispatch({
        type: GET_USER_INFO,
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

// Set user admin status
export const setUserAdminStatus = (isAdmin) => {
  return {
    type: SET_USER_ADMIN_STATUS,
    payload: isAdmin,
  };
};

//get Profile Information
export const getProfileInfo = (username) => async (dispatch) => {
  await axios
    .get("/api/users/getProfileInfo/" + username)
    .then((res) => {
      dispatch({
        type: GET_PROFILE_INFO,
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
