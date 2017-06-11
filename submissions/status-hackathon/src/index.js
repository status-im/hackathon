import 'babel-polyfill' // Just needed for firebase-saga

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { Provider } from 'react-redux'
import { applyMiddleware, createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'

import tab from './reducers'
import helloSaga from './sagas'

import * as firebase from 'firebase'
import firebaseConfig from '../firebase_config.js'

import './css/bootstrap.css';


const sagaMiddleware = createSagaMiddleware()
const reducer = combineReducers({
  tab,
  form: formReducer
})
const store = createStore(reducer, applyMiddleware(sagaMiddleware, logger))

sagaMiddleware.run(helloSaga)
window.firebase = firebase.initializeApp(firebaseConfig)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
