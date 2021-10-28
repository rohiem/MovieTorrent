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
  MOVIE_CREATE_COMMENT_RESET,
  MOVIE_CREATE_SUCCESS,
  MOVIE_CREATE_REQUEST,
  MOVIE_CREATE_FAIL,
  MOVIE_CREATE_RESET,
  MOVIE_UPDATE_REQUEST,
  MOVIE_UPDATE_SUCCESS,
  MOVIE_UPDATE_FAIL,
  MOVIE_UPDATE_RESET,
  MOVIE_FILTER_REQUEST,
  MOVIE_FILTER_SUCCESS,
  MOVIE_FILTER_FAIL,
  MOVIE_FILTER_RESET,
} from "../constants/MovieConstants";

export const movieListReducer = (
  state = {
    movies: [],
  },
  action
) => {
  switch (action.type) {
    case MOVIE_LIST_REQUEST:
      return { ...state, loading: true };
    case MOVIE_LIST_SUCCESS:
      return {
        loading: false,
        movies: action.payload.results,
        next: action.payload.next,
        previous: action.payload.previous,
        count: action.payload.count,
      };
    case MOVIE_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const movieDetailReducer = (
  state = {
    movie: {},
  },
  action
) => {
  switch (action.type) {
    case MOVIE_DETAIL_REQUEST:
      return { ...state, loading: true };
    case MOVIE_DETAIL_SUCCESS:
      return {
        loading: false,
        movie: action.payload,
      };
    case MOVIE_DETAIL_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const movieCreateCommentReducer = (state = {}, action) => {
  switch (action.type) {
    case MOVIE_CREATE_COMMENT_REQUEST:
      return { loading: true };
    case MOVIE_CREATE_COMMENT_SUCCESS:
      return { loading: false, success: true };
    case MOVIE_CREATE_COMMENT_FAIL:
      return { loading: false, error: action.payload };
    case MOVIE_CREATE_COMMENT_RESET:
      return {};
    default:
      return state;
  }
};

export const movieCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case MOVIE_CREATE_REQUEST:
      return { loading: true };
    case MOVIE_CREATE_SUCCESS:
      return { loading: false, success: true, movie: action.payload };
    case MOVIE_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case MOVIE_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const movieUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case MOVIE_UPDATE_REQUEST:
      return { loading: true };
    case MOVIE_UPDATE_SUCCESS:
      return { loading: false, success: true, movie: action.payload };
    case MOVIE_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case MOVIE_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const movieFilterReducer = (
  state = {
    movies: [],
  },
  action
) => {
  switch (action.type) {
    case MOVIE_FILTER_REQUEST:
      return { ...state, loading: true };
    case MOVIE_FILTER_SUCCESS:
      return {
        loading: false,
        movies: action.payload,
        success: true,
      };
    case MOVIE_FILTER_FAIL:
      return { loading: false, error: action.payload };
    case MOVIE_FILTER_RESET:
      return { movies: [] };
    default:
      return state;
  }
};
