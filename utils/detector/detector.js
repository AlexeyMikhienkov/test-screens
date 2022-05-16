import * as Bowser from "bowser";

function getBrowserData() {
    return global.navigator ? Bowser.getParser(global.navigator.userAgent) : null;
}

export const browserData = getBrowserData();
