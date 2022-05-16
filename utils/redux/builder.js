import {createCustomReducer} from "./requestReducer";
import {createSlice} from "@reduxjs/toolkit";
import {useSelector} from "react-redux";
import {camelCase} from "lodash"

export default class Builder {

  name = "someSlice";

  initialState = {};

  extraReducers = {};

  thunks = {};

  reducers = {};

  selectors = {};

  constructor({name, initialState, reducers} = {}) {
    this.name = name ?? this.name;
    this.initialState = initialState ?? this.initialState;
    this.reducers = reducers ?? this.reducers;

    this.createSelector(this.name, state => state[this.name]);
  }

  createExtraReducer({
                       thunkName, thunkExtraName, func, onSubmit, saveData, saveError,
                       checkStatus = false, updateStatus = false
                     }) {
    const {name: sliceName} = this;

    const {reducer, thunk} = createCustomReducer({
      sliceName,
      thunkName: `${sliceName}/${thunkName}`,
      checkStatus,
      updateStatus,
      onSubmit,
      saveError,
      saveData,
      func
    });
    this.extraReducers = {...this.extraReducers, ...reducer};
    this.thunks[thunkExtraName ?? thunkName] = thunk;

    return this;
  }

  addExtraReducer(reducer){
    this.extraReducers = {...this.extraReducers, ...reducer};
    return this;
  }

  createSelector(name, selector) {
    this.selectors[camelCase(`use-${name}`)] = function useSomeSelector() {
      return useSelector((state) => selector.call(null, state, ...arguments))
    };
    return this;
  }

  create() {
    const {extraReducers, reducers, name, initialState} = this;

    const slice = createSlice({
      name,
      initialState,
      reducers,
      extraReducers
    });

    this.slice = slice;

    return this;
  }

  export() {
    const {name, selectors, slice: {reducer, actions}, thunks} = this;
    return {
      name,
      selectors,
      reducer,
      actions,
      thunks,
      ...selectors
    }
  }
}


