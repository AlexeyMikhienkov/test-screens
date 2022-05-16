import {createSlice} from "@reduxjs/toolkit";
import {screens, startScreen, stateChangeTypes, states} from "../../constants/settings";
import {createCustomReducer} from "../../utils/redux/requestReducer";
import {useSelector} from "react-redux";
import {loadGetInitialProps} from "next/dist/shared/lib/utils";

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
    stateChangeType: stateChangeTypes.PARALLEL.name,
    currentScreen: {name: startScreen, isActive: false},
    nextScreen: null,
    transitionStates: (() => {
      const transitions = {};

      Object.keys(screens).forEach(name => {
        return transitions[name] = name === startScreen ? states.CYCLE : states.HIDDEN
      });

      return transitions;
    })(),
    transitionData: [],
    transitionResolver: null,
    loadingComplete: false
  },
  reducers: {
    selectScreens(state, {payload: {current = state.currentScreen, next = null}}) {
      state.currentScreen = current;
      state.nextScreen = next;
      state.activityState = "action";

      console.log(state.currentScreen)
      console.log(state.nextScreen);
      debugger
    },
    setTransitionData(state, {payload: {screen, to, duration}}) {
      console.log("REDUX: set transition data")
      state.transitionData.push({screen, to, duration});
      state.transitionStates[screen.name] = to;
      state.transitionResolver = null;
    },
    removeTransitionData(state, {payload: {screen, to}}) {
      const deleteIndex = state.transitionData.find(data => data.screen === screen && data.to === to);
      if (deleteIndex === -1) return;

      state.transitionData.splice(deleteIndex, 1);
    },
    stopTransition(state) {
      state.currentScreen = state.nextScreen;
      state.nextScreen = null;
      state.transitionData.length = 0;
      state.transitionResolver = null;
      state.activityState = "idle";
    },
    selectTransitionScreen(state, {payload: {type, isActive}}) {
      console.log("REDUX: select transition screen")
      const screen = state[`${type}Screen`];
      if (!screen) return;

      screen.isActive = isActive;
      console.log("selectTransitionScreen")
      console.log(screen);
      debugger
    },
    transitionResolved(state, {payload: {screen, to}}) {
      state.transitionResolver = {screen, to};
    },
    changeStateChangeType(state, action) {
      const availableTypes = Object.values(stateChangeTypes).map(data => data.name);
      if (!availableTypes.includes(action.payload)) return;

      state.stateChangeType = action.payload;
    }
  },
  extraReducers: {
    ...loadReducer
  }
});

export const {
  selectScreens, setTransitionData, stopTransition,
  selectTransitionScreen, changeTransitionState,
  transitionResolved, changeStateChangeType, removeTransitionData
} = appSlice.actions;

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
