import {
  MOVIE_LIST_FAIL,
  MOVIE_LIST_REQUEST,
  MOVIE_LIST_SUCCESS,
  MOVIE_DETAIL_FAIL,
  MOVIE_DETAIL_REQUEST,
  MOVIE_DETAIL_SUCCESS,
  MOVIE_CREATE_COMMENT_REQUEST,
  MOVIE_CREATE_COMMENT_SUCCESS,
  MOVIE_CREATE_COMMENT_FAIL,
  MOVIE_CREATE_REQUEST,
  MOVIE_CREATE_SUCCESS,
  MOVIE_CREATE_FAIL,
  MOVIE_UPDATE_REQUEST,
  MOVIE_UPDATE_SUCCESS,
  MOVIE_UPDATE_FAIL,
  MOVIE_FILTER_REQUEST,
  MOVIE_FILTER_SUCCESS,
  MOVIE_FILTER_FAIL,
} from "../constants/MovieConstants";
import axios from "axios";
export const getMovieList = (urlsp, logged) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    dispatch({ type: MOVIE_LIST_REQUEST });
    const Auth = () => {
      if (logged) {
        return { Authorization: `Bearer ${userInfo.access_token}` };
      }
    };
    const Authorization = Auth();
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization,
      },
    };
    const url = (urlsp) => {
      if (urlsp) {
        const urlstr = `/api/movies${urlsp}`;
        return urlstr;
      } else {
        const nourl = "/api/movies";
        return nourl;
      }
    };
    const { data } = await axios.get(url(urlsp), config);
    dispatch({ type: MOVIE_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: MOVIE_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const getMovieDetail = (slug, logged) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    dispatch({ type: MOVIE_DETAIL_REQUEST });
    const Auth = () => {
      if (logged) {
        return { Authorization: `Bearer ${userInfo.access_token}` };
      }
    };
    const Authorization = Auth();
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization,
      },
    };

    const { data } = await axios.get(`/api/movies/${slug}`, config);
    dispatch({ type: MOVIE_DETAIL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: MOVIE_DETAIL_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const createMovieComment =
  (movieId, body) => async (dispatch, getState) => {
    const {
      userLogin: { userInfo },
    } = getState();
    try {
      dispatch({ type: MOVIE_CREATE_COMMENT_REQUEST });

      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${userInfo.access_token}`,
        },
      };
      const { data } = await axios.post(
        `/api/movies/${movieId}/comment`,
        { body },
        config
      );
      console.log(data);
      dispatch({
        type: MOVIE_CREATE_COMMENT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: MOVIE_CREATE_COMMENT_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

export const createMovie = (movie) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    dispatch({ type: MOVIE_CREATE_REQUEST });
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.access_token}`,
      },
    };

    const formData = new FormData();
    const { name, torrent, image, year, description, category } = movie;
    formData.append("image", image);
    formData.append("torrent", torrent);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("name", name);
    formData.append("year", year);

    const { data } = await axios.post(`/api/create`, formData, config);
    dispatch({
      type: MOVIE_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MOVIE_CREATE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const updateMovie = (slug, movie) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    dispatch({ type: MOVIE_UPDATE_REQUEST });

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${userInfo.access_token}`,
      },
    };

    const { data } = await axios.put(
      `/api/movies/${slug}/update`,
      movie,
      config
    );
    dispatch({
      type: MOVIE_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log(error.response);
    dispatch({
      type: MOVIE_UPDATE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const filterMovies = (movie, logged) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    dispatch({ type: MOVIE_FILTER_REQUEST });
    const Auth = () => {
      if (logged) {
        return { Authorization: `Bearer ${userInfo.access_token}` };
      }
    };
    const Authorization = Auth();
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization,
      },
    };
    const { data } = await axios.get(`/api/browse`, { params: movie }, config);
    dispatch({
      type: MOVIE_FILTER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MOVIE_FILTER_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
