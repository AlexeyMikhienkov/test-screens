import React, {useEffect} from "react";
import {screens, stopTransitionStates} from "../../../constants/settings";
import {
  removeTransitionData,
  selectTransitionScreen,
  setTransitionData,
  transitionResolved,
  useApp
} from "../../../redux/reducer/app";
import {useDispatch} from "react-redux";
import countSomeTime from "../../../utils/time";
import {getTransitionData} from "../../../utils/transitions/getData";

export default function CommonScreen({className, pageName, onClick, startScreen, endTransitionCallback}) {
  const dispatch = useDispatch();
  const {currentScreen, nextScreen, transitionStates, transitionData, transitionResolver} = useApp();

  useEffect(() => {
    if (!currentScreen || !currentScreen.isActive) return;

    console.log("currentScreen", currentScreen)
    //debugger
    setTransitionDataFunc(currentScreen);
  }, [currentScreen?.isActive]);

  useEffect(() => {
    if (!nextScreen || !nextScreen.isActive) return;

    console.log("nextScreen", nextScreen)
    //debugger
    setTransitionDataFunc(nextScreen);
  }, [nextScreen?.isActive]);

  useEffect(() => {
    if (!transitionData.length) return;

    const {screen, to, duration} = transitionData.at(-1);

    console.log("--transitionData--")

    console.log("last added data", screen, to, duration)

    countSomeTime(duration ?? 0).then(() => {
      dispatch(transitionResolved({screen, to}));
    });
  }, [transitionData.length]);

  useEffect(() => {
    if (!transitionResolver) return;

    const {screen, to} = transitionResolver;
    console.log(screen, to)

    dispatch(removeTransitionData({screen, to}))

    console.log("TRANSITION RESOLVED", screen.name, "->", to);
    //debugger

    if (stopTransitionStates.includes(to)) {
      console.log("end callback");
      console.log("states", transitionStates);
      if (screen !== currentScreen && screen !== nextScreen) {
        console.log("!!!!!!!")
        //debugger
      }

      const type = screen === currentScreen ? "current" : "next";

      dispatch(selectTransitionScreen({type, isActive: false}));
      //debugger
      endTransitionCallback();
    } else {
      console.log("new iteration: screen", screen);
      //debugger
      setTransitionDataFunc(screen);
    }

  }, [transitionResolver]);

  function setTransitionDataFunc(screen) {
    console.log("!!!", screen.name)
    const {to, duration} = getTransitionData(transitionStates, screen.name);

    console.log("dispatch COMMON", to, duration)
    //debugger

    dispatch(setTransitionData({screen, to, duration}))
    console.log("transitionData", transitionData)
    console.log("transitionStates", transitionStates)
    //debugger
  }

  return <Component className={className}
                    pageName={pageName}
                    onClick={onClick}
                    transition={transitionStates[pageName]}
                    startScreen={startScreen}/>
}

const Component = (props) => {
  const {pageName} = props;
  const Screen = screens[pageName].Component;

  return <Screen {...props}/>
};
