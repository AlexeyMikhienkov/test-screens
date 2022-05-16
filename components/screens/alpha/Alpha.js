import React, {useEffect, useState} from "react";
import {screens} from "../../../constants/settings";

export default function Alpha({className, pageName, onClick, transition}) {

  console.log("transition in ALPHA", transition)

  return (
    <div className={`${className}__${pageName} ${pageName} ${transition ? `${pageName}_${transition}` : ""}`}>
      <div className={`${pageName}__text`}>{pageName.toUpperCase()}</div>
      <div className={`${pageName}__buttons`}>{buttonsItems(pageName, onClick)}</div>
    </div>
  )
}

function buttonsItems(pageName, onClick) {
  return Object.values(screens).map(({name}) => {
    if (name === pageName) return;

    return <button
      key={`button_${name}`}
      className={`${pageName}__button ${pageName}__button_${name}`}
      onClick={() => onClick(name)}>
      {name}
    </button>
  })
}
