import React from 'react'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'

import ThemeProvider from 'react-toolbox/lib/ThemeProvider';

import theme from '../assets/react-toolbox/theme'
import '../assets/react-toolbox/theme.css'

import shop from '../reducers/shop'
import orders from '../reducers/orders'
import tracking from '../reducers/tracking'
import sagas from '../sagas/index'

import App from './App'

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history)

// Create the middleware to run sagas
const sagaMiddleware = createSagaMiddleware()

// Create the store
const store = createStore(
  combineReducers({
    shop,
    tracking,
    orders,
    router: routerReducer
  }),
  applyMiddleware(middleware, sagaMiddleware)
)

sagaMiddleware.run(sagas)

export default function Main() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    </ThemeProvider>
  )
}

store.dispatch({
  type: 'INITIALIZE'
})
