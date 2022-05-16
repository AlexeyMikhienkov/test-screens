import {screens} from "../../constants/settings";

export function getTransitionData(states, screenName) {
  const screenTransitionData = screens[screenName].transitions;
  const currentScreenState = states[screenName];
  return screenTransitionData[currentScreenState];
}

export function getDelay(states, screenName) {
  const nextScreenStartState = states[screenName];
  const transitionData = screens[screenName].transitions;
  return transitionData[nextScreenStartState].delay;
}
