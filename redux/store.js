import {configureStore} from '@reduxjs/toolkit'
import rootReducer from "./reducer/rootReducer";
import {fetchData} from "./reducer/user";

const preloadedState = {};

const store = configureStore({
    reducer: rootReducer,
    preloadedState
});

store.dispatch(fetchData());

export default store;
