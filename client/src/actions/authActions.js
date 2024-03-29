import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING,
  GET_USER_INFO,
} from "./types";
// Register User
export const registerUser = (userData, history) => async (dispatch) => {
  await axios
    .post("/api/users/register", userData)
    .then((res) => {
      if (res.data.register === "CAE") {
        dispatch({
          type: GET_ERRORS,
          payload: res.data,
        });
      } else if (res.data.register === "UAE") {
        dispatch({
          type: GET_ERRORS,
          payload: res.data,
        });
      } else {
        history.push("/login"); // re-direct to login on successful register
      }
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};
// Login - get user token
export const loginUser = (userData) => async (dispatch) => {
  await axios
    .post("/api/users/login", userData)
    .then((res) => {
      // Save to localStorage
      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};
// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};
// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING,
  };
};

export const setUserInfo = (decoded) => {
  return {
    type: GET_USER_INFO,
    payload: decoded,
  };
};

// Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("loggedInUserIsAdmin");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
  dispatch(setUserInfo({}));
};
