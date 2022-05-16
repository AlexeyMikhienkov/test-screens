import Alpha from "../components/screens/alpha/Alpha";
import Beta from "../components/screens/beta/Beta";
import Gamma from "../components/screens/gamma/Gamma";

export const screens = {
  alpha: {
    name: "alpha",
    Component: Alpha,
    transitions: {
      cycle: {to: "hide", duration: 1200, delay: 200},
      hide: {to: "hidden"},
      hidden: {to: "show", duration: 2000, delay: 600},
      show: {to: "cycle"}
    }
  },
  beta: {
    name: "beta",
    Component: Beta,
    transitions: {
      cycle: {to: "hide", duration: 1200, delay: 300},
      hide: {to: "hidden"},
      hidden: {to: "show", duration: 2000, delay: 500},
      show: {to: "cycle"}
    }
  },
  gamma: {
    name: "gamma",
    Component: Gamma,
    transitions: {
      cycle: {to: "hide", duration: 1200, delay: 350},
      hide: {to: "hidden"},
      hidden: {to: "show", duration: 2000, delay: 400},
      show: {to: "cycle"}
    }
  },
};

export const states = {
  CYCLE: "cycle",
  SHOW: "show",
  HIDE: "hide",
  HIDDEN: "hidden",
};

export const nextTransitionState = {
  cycle: {
    to: "hide",
    duration: 1200
  },
  hide: {
    to: "hidden"
  },
  hidden: {
    to: "show",
    duration: 2000
  },
  show: {
    to: "cycle"
  }
};

export const statesTypes = {
  appearing: ["show", "cycle"],
  hiding: ["hide", "hidden"]
};

export const stopTransitionStates = ["cycle", "hidden"];

export const startScreen = "alpha";

export const stateChangeTypes = {
  PARALLEL: {
    name: "parallel",
    translate: "параллельно"
  },
  IN_SERIES: {
    name: "inSeries",
    translate: "последовательно"
  }
};

export function getTranslation(typeName) {
  return Object.values(stateChangeTypes)
    .find(({name}) => typeName === name)?.translate ?? "not found"
}
