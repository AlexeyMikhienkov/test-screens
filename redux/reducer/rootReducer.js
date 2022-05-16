import { combineReducers } from '@reduxjs/toolkit'
import controllerReducer from "../../components/controller/reducer/controller";
import modalReducer from "./modals";
import app from "./app";

const rootReducer = combineReducers({
  controllerReducer,
  modalReducer,
  app
});

export default rootReducer;
