import {createSlice} from "@reduxjs/toolkit";
import initRequestReducer, {customCreateAsyncThunk, IDLE} from "../../utils/redux/requestReducer";
import {addHeaders, get, post} from "../../utils/api/api";
import storage from "../../utils/storage";
import {useSelector} from "react-redux";

/**
 * slice name
 * @type {string}
 */
const NAME = "user";

const _storage = storage("info", (data) => {
  addHeaders({
    "Authorization": data?.access_token ? `Bearer ${data.access_token}` : false
  })
});


function onSubmit(state, action, thunk) {
  state.userInputSource = thunk.typePrefix;
  state.userInput = action.meta.arg;
}

function saveData(state, action, thunk) {
  state.userInfoSource = thunk.typePrefix;
  state.userInfo = action.payload.profile;
  _storage.save(state.userInfo);
}

function saveError(state, action) {
  state.error = action.payload || action.error;
}

function initExtraReducer(thunk) {
  return initRequestReducer(thunk, {saveData, saveError, onSubmit});
}

function getThunk(method, {request = post} = {}) {
  return customCreateAsyncThunk(NAME, method, data => request(method, data));
}

const {extraReducers, thunks} = [
  "/user/login",
  "/user/signup",
  "/user/update",
  ["/user/profile", {request: get}],
  "/user/logout",
].reduce((res, props) => {
  const [method, params] = Array.isArray(props) ? props : [props];
  const thunk = getThunk(method, params);
  res.thunks.push(thunk);
  Object.assign(res.extraReducers, initExtraReducer(thunk, params));
  return res;
}, {extraReducers: {}, thunks: []});
export const [
  signIn,
  signUp,
  update,
  fetchData,
  logout,
] = thunks;

const userSlice = createSlice({
  name: NAME,
  reducers: {
    clearError(state, action) {
      if (action?.payload && state?.error?.fields?.[action.payload]) {
        delete state?.error?.fields?.[action.payload];
        state.error = {...state.error};
      }
    }
  },
  extraReducers,
  initialState: {
    loading: IDLE,
    currentRequestId: undefined,
    error: null,
    userInput: {},
    userInfo: _storage.load(),
    userInfoSource: "localStorage"
  }
});

export default userSlice.reducer;
export const {clearError} = userSlice.actions;

export function useUser() {
  return useSelector((state) => state[NAME]);
}
