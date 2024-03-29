import axios from "axios";
import {
  GET_USER_INFO,
  GET_ERRORS,
  SET_USER_ADMIN_STATUS,
  GET_PROFILE_INFO,
  GET_ALL_USERS,
} from "./types";

// Get a users information
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

//update profile info
export const updateUser = (updateUser) => async (dispatch) => {
  await axios
    .post("/api/users/updateUser/", updateUser)
    .then((res) => {
      if (res.data.detailUpdate === "EAE") {
        dispatch({
          type: GET_ERRORS,
          payload: res.data,
        });
      } else if (res.data.detailUpdate === "PDNM") {
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

//update a character
export const updateCharacter = (character) => async (dispatch) => {
  await axios.post("/api/users/updateCharacter/", character).catch((err) => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data,
    });
  });
};

//add a character
export const addCharacter = (character) => async (dispatch) => {
  await axios
    .post("/api/users/addCharacter/", character)
    .then((res) => {
      if (res.data.detailUpdate === "CAE") {
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
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const getAllUsers = () => async (dispatch) => {
  await axios
    .get("/api/users/getAllUsers/")
    .then((res) => {
      dispatch({
        type: GET_ALL_USERS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};
