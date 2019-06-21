import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from 'redux-thunk';
import rootReducer from './reducers/index';

//Initial state
const initialState = {}; 

//Initializing middlewares for redux
const middlewares = [thunk];

//Create a store;
const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middlewares))
);

export default store;
 











