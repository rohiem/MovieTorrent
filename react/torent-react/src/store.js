import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  userRegisterReducers,
  userLoginReducers,
  userProfileReducers,
  userProfileCreateReducers,
} from "./redux/reducers/userReducer";
import {
  movieListReducer,
  movieDetailReducer,
  movieCreateCommentReducer,
  movieCreateReducer,
  movieUpdateReducer,
  movieFilterReducer,
} from "./redux/reducers/movieReducer";
const reducer = combineReducers({
  userRegister: userRegisterReducers,
  userLogin: userLoginReducers,
  userProfile: userProfileReducers,
  userProfileCreate: userProfileCreateReducers,
  movieList: movieListReducer,
  movieDetail: movieDetailReducer,
  movieCreateComment: movieCreateCommentReducer,
  movieCreate: movieCreateReducer,
  movieUpdate: movieUpdateReducer,
  movieFilter: movieFilterReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};
const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
