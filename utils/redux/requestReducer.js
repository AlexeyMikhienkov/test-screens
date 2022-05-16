import {createAsyncThunk} from "@reduxjs/toolkit";

export const PENDING = "pending";
export const IDLE = "idle";

export function createCustomReducer({
                                      sliceName, thunkName, func, saveData, saveError, onSubmit,
                                      checkStatus, updateStatus,
                                    }) {
  const thunk = customCreateAsyncThunk(sliceName, thunkName, func, checkStatus);

  return {reducer: initRequestReducer(thunk, {saveData, saveError, onSubmit}, checkStatus, updateStatus), thunk}
}

export function customCreateAsyncThunk(sliceName, thunkName, request, checkStatus = true) {
  return createAsyncThunk(
    thunkName,
    async (data, {getState, requestId, rejectWithValue}) => {
      const stateData = getState()[sliceName];
      const {loading, currentRequestId} = stateData;
      if (checkStatus && (loading !== PENDING || requestId !== currentRequestId)) return;
      try {
        return await request(data, stateData, getState);
      } catch (err) {
        return rejectWithValue(err?.toSerializable?.() || err)
      }
    }
  );
}

function initRequestReducer(thunk, {saveData, saveError, onSubmit}, checkStatus = true, updateStatus = true) {
  return {
    [thunk.pending]: (state, action) => {
      if (!checkStatus || state.loading === IDLE) {
        if (updateStatus)
          state.loading = PENDING;
        applyCallback(onSubmit, state, action, thunk);
        state.currentRequestId = action.meta.requestId;
      }
    },
    [thunk.fulfilled]: (state, action) => {
      const {requestId} = action.meta;
      if (!checkStatus || checkRequest(state, requestId)) {
        if (updateStatus)
          state.loading = IDLE;
        applyCallback(saveData, state, action, thunk);
        state.currentRequestId = undefined;
        state.error = null;
      }
    },
    [thunk.rejected]: (state, action) => {
      const {requestId} = action.meta;
      if (!checkStatus || checkRequest(state, requestId)) {
        if (updateStatus)
          state.loading = IDLE;
        applyCallback(saveError, state, action, thunk);
        state.currentRequestId = undefined;
      }
    }
  }
}

function applyCallback(callBack, state, action, thunk) {
  if (typeof callBack === "function") {
    callBack(state, action, thunk);
  }
}

function checkRequest(state, requestId) {
  return state.loading === PENDING && state.currentRequestId === requestId;
}

export default initRequestReducer;
