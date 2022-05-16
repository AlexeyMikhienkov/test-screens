import React, {useEffect} from "react";
import {screens, stopTransitionStates} from "../../../constants/settings";
import {setTransitionData, transitionResolved, useApp} from "../../../redux/reducer/app";
import {useDispatch} from "react-redux";

export default function CommonScreen({className, pageName, onClick, startScreen, endTransitionCallback}) {
  const dispatch = useDispatch();
  const {transitionScreen, transitionStates, transitionData, transitionResolver} = useApp();

  useEffect(() => {
    if (!transitionScreen) return;

    setTransitionDataFunc();
  }, [transitionScreen]);

  useEffect(() => {
    if (!transitionData) return;

    const {screen, to, duration} = transitionData;

    countTransitionTime(duration ?? 0).then(() => {
      dispatch(transitionResolved({screen, to}));
    });
  }, [transitionData]);

  useEffect(() => {
    if (!transitionResolver) return;

    const {to} = transitionData;

    if (stopTransitionStates.includes(to)) {
      endTransitionCallback();
    } else {
      setTransitionDataFunc();
    }

  }, [transitionResolver]);

  function setTransitionDataFunc() {
    const screenTransitionData = screens[transitionScreen].transitions;
    const currentScreenState = transitionStates[transitionScreen];
    const {to, duration} = screenTransitionData[currentScreenState];

    dispatch(setTransitionData({screen: transitionScreen, to, duration}))
  }

  function countTransitionTime(time) {
    let promiseResolver;
    console.log("countTransitionTime", time)
    const promise = new Promise((resolve) => promiseResolver = resolve);
    setTimeout(() => promiseResolver(), time);

    return promise;
  }

  return <Component className={className}
                    pageName={pageName}
                    onClick={onClick}
                    transition={transitionStates[transitionScreen]}
                    startScreen={startScreen}/>
}

const Component = (props) => {
  const {pageName} = props;
  const Screen = screens[pageName].Component;

  return <Screen {...props}/>
};
