import axios from "axios";
import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  CLEAR_PROFILE
} from "./types";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";

// Load user
export const loadUser = () => async dispatch => {
  if (localStorage.getItem("token")) {
    setAuthToken(localStorage.getItem("token"));
  }

  try {
    const res = await axios.get("/api/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });

  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = ({ name, email, password }, time) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post("/api/users", body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(err => dispatch(setAlert(err, "danger", time)));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

//Login action

export const login = (email, password, time = 3000) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/auth", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    //By default we have to refresh page to activate loadUser
    //Load user after login
    dispatch(loadUser());
  } catch (err) {
    if(err.response){
    const errors = err.response.data.errors;

      if (errors) {
        errors.forEach(err => dispatch(setAlert(err, "danger", time)));
      }

      dispatch({
        type: LOGIN_FAIL
      });
    }else{
      console.log(err);
    }
  }
};

//Logout

export const logout = (history) => dispatch => {
  dispatch({
    type: LOGOUT
  });
  dispatch({
    type: CLEAR_PROFILE
  });
  history.push('/login');
};
