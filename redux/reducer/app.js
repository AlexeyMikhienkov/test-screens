import {createSlice} from "@reduxjs/toolkit";
import {screens, startScreen, stateChangeTypes, states} from "../../constants/settings";
import {createCustomReducer} from "../../utils/redux/requestReducer";
import {useSelector} from "react-redux";

const name = "app";
let importPromise;
let appInstance;

const {reducer: loadReducer, thunk: loadThunk} = createCustomReducer({
  sliceName: name,
  thunkName: `${name}/load`,
  checkStatus: false,
  updateStatus: false,
  saveData(state) {
    state.loadingComplete = true;
  },
  func: async function () {
    const {app} = await importApp();
    appInstance = app;
  }
});

const appSlice = createSlice({
  name,
  initialState: {
    activityState: "idle",
    stateChangeType: stateChangeTypes.IN_SERIES,
    currentScreen: startScreen,
    nextScreen: null,
    transitionStates: (() => {
      const transitions = {};

      Object.keys(screens).forEach(name => {
        return transitions[name] = name === startScreen ? states.CYCLE : states.HIDDEN
      });

      return transitions;
    })(),
    transitionData: null,
    transitionScreen: null,
    transitionResolver: null,
    loadingComplete: false
  },
  reducers: {
    selectScreens(state, {payload: {current = state.currentScreen, next = null}}) {
      state.currentScreen = current;
      state.nextScreen = next;
      state.activityState = "action";
    },
    setTransitionData(state, {payload: {screen, to, duration}}) {
      state.transitionData = {screen, to, duration};
      state.transitionStates[screen] = to;
      state.transitionResolver = null;
    },
    stopTransition(state) {
      state.currentScreen = state.nextScreen;
      state.nextScreen = null;
      state.transitionScreen = null;
      state.transitionData = null;
      state.transitionResolver = null;
      state.activityState = "idle";
    },
    selectTransitionScreen(state, action) {
      state.transitionScreen = action.payload;
    },
    transitionResolved(state, {payload: {screen, to}}) {
      state.transitionResolver = {screen, to};
    }
  },
  extraReducers: {
    ...loadReducer
  }
});

export const {selectScreens, setTransitionData, stopTransition, selectTransitionScreen, changeTransitionState, transitionResolved} = appSlice.actions;

export {loadThunk};

export function useApp() {
  return useSelector(state => state[name]);
}

export function setImportPromise(promise) {
  importPromise = promise;
}

function importApp() {
  return importPromise;
}

export default appSlice.reducer;
