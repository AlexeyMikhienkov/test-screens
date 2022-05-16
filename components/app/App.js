import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {
  useApp,
  selectScreens,
  stopTransition,
  selectTransitionScreen,
  changeStateChangeType
} from "../../redux/reducer/app";
import CommonScreen from "../screens/commonScreen/CommonScreen";
import {getTranslation, stateChangeTypes} from "../../constants/settings";
import countSomeTime from "../../utils/time";
import {getDelay} from "../../utils/transitions/getData";

export default function App() {
  const dispatch = useDispatch();
  const {
    currentScreen, nextScreen, activityState,
    transitionData, startScreen,
    transitionResolver, transitionStates, stateChangeType
  } = useApp();

  useEffect(() => {
    if (activityState === "idle") return;

    if (isParallelType()) {
      const transitionDelay = getDelay(transitionStates, nextScreen.name);
      dispatch(selectTransitionScreen({type: "current", isActive: true}));
      countSomeTime(transitionDelay)
        .then(() => {
          console.log("after delay")
        //  debugger
          dispatch(selectTransitionScreen({type: "next", isActive: true}))
        })
    } else {
      dispatch(selectTransitionScreen({type: "current", isActive: true}));
    }
  }, [activityState]);

  function clickAction(nextScreen) {
    const nextScreenData = {
      name: nextScreen,
      isActive: false
    };
    console.log("__________CLICK ACTION_________")
    console.log("nextScreen", nextScreen)
    dispatch(selectScreens({next: nextScreenData}));
  }

  function transitionEndedActions() {
    const hasActiveScreens = currentScreen.isActive || nextScreen.isActive;

    if (isParallelType()) {
      if (!hasActiveScreens) stopTransition();
    } else {
      console.log("end?", transitionResolver.screen, nextScreen, transitionResolver.screen === nextScreen)
      dispatch(transitionResolver.screen === nextScreen ?
        stopTransition() :
        selectTransitionScreen({type: "next", isActive: true}))
    }
  }

  function isParallelType() {
    return stateChangeType === stateChangeTypes.PARALLEL.name;
  }

  function typesButtonClickAction() {
    const type = Object.values(stateChangeTypes)
      .map(data => data.name)
      .filter(type => type !== stateChangeType)[0];
    dispatch(changeStateChangeType(type))
  }

  return (
    <div className={"screen"}>
      <CommonScreen className={"screen"}
                    pageName={nextScreen?.isActive ? nextScreen.name : currentScreen.name}
                    onClick={clickAction}
                    transitionData={transitionData}
                    startScreen={startScreen}
                    endTransitionCallback={transitionEndedActions}/>
      <div>
        <button className={"screen__button button"} onClick={typesButtonClickAction}>
          {`текущий тип: ${getTranslation(stateChangeType)}`}
        </button>
      </div>
    </div>
  )
}

/*
1. выбирать посл-ть смены: параллельно или последовательно (по нажатию на кнопку может меняться, но не во время анимации)
2. компонент внутри себя переключает состояние +++
 */
