import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGOUT,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAIL,
  USER_PROFILE_RESET,
  USER_PROFILE_CREATE_REQUEST,
  USER_PROFILE_CREATE_SUCCESS,
  USER_PROFILE_CREATE_FAIL,
} from "../constants/userConstants";
import axios from "axios";
export const register =
  (username, email, password1, password2) => async (dispatch) => {
    try {
      dispatch({ type: USER_REGISTER_REQUEST });

      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/dj-rest-auth/registration/",
        {
          username: username,
          email: email,
          password1: password1,
          password2: password2,
        },
        config
      );

      dispatch({
        type: USER_REGISTER_SUCCESS,
        payload: data,
      });

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: data,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: USER_REGISTER_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/dj-rest-auth/login/",
      {
        email: email,
        password: password,
      },
      config
    );

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_PROFILE_RESET });
};

export const getUserProfile = () => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    dispatch({ type: USER_PROFILE_REQUEST });

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${userInfo.access_token}`,
      },
    };
    const { data } = await axios.get(
      "/api/user",

      config
    );

    dispatch({
      type: USER_PROFILE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_PROFILE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const createUserProfile = (profile) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    dispatch({ type: USER_PROFILE_CREATE_REQUEST });

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.access_token}`,
      },
    };

    const formData = new FormData();
    const { first, last, image: picture, bio } = profile;
    console.log(picture);
    formData.append("first", first);
    formData.append("last", last);
    formData.append("picture", picture);
    formData.append("bio", bio);

    const { data } = await axios.put(
      "/api/user/createprofile",
      formData,
      config
    );

    dispatch({
      type: USER_PROFILE_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_PROFILE_CREATE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
