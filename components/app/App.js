import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {
  useApp,
  selectScreens,
  stopTransition,
  selectTransitionScreen
} from "../../redux/reducer/app";
import CommonScreen from "../screens/commonScreen/CommonScreen";
import {getTranslation, stateChangeTypes} from "../../constants/settings";

export default function App() {
  const dispatch = useDispatch();
  const {currentScreen, nextScreen, activityState, transitionData, startScreen, transitionScreen, transitionResolver} = useApp();
  const [stateChangeType, setStateChangeType] = useState(stateChangeTypes.IN_SERIES.name);

  useEffect(() => {
    if (activityState === "idle") return;

    dispatch(selectTransitionScreen(currentScreen));
  }, [activityState]);


  function clickAction(nextScreen) {
    dispatch(selectScreens({next: nextScreen, activityState}));
  }

  function transitionEndedActions() {
    if (transitionResolver.screen === nextScreen) {
      dispatch(stopTransition());
    } else {
      dispatch(selectTransitionScreen(nextScreen));
    }
  }

  return (
    <div className={"screen"}>
      <CommonScreen className={"screen"}
                    pageName={transitionScreen ?? currentScreen}
                    onClick={clickAction}
                    transitionData={transitionData}
                    startScreen={startScreen}
                    endTransitionCallback={transitionEndedActions}/>
      <div>
        <button className={"screen__button button"} onClick={() => {
          const type = Object.values(stateChangeTypes)
            .map(data => data.name)
            .filter(type => type !== stateChangeType)[0];
          setStateChangeType(type);
        }}>{`текущий тип: ${getTranslation(stateChangeType)}`}</button>
      </div>
    </div>
  )
}

/*
1. выбирать посл-ть смены: параллельно или последовательно (по нажатию на кнопку может меняться, но не во время анимации)
2. компонент внутри себя переключает состояние +++
 */
