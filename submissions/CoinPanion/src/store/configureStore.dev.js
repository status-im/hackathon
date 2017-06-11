import { createStore, compose, applyMiddleware } from 'redux'
import { persistState } from 'redux-devtools'
import thunk from 'redux-thunk'
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase'
import rootReducer from '../reducers'
import { config as fbConfig } from '../../devConfig'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const config = {
  userProfile: 'users',
  enableLogging: false
}

function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
      applyMiddleware(thunk.withExtraArgument(getFirebase)),
      reactReduxFirebase(fbConfig, config)
    )
  )

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default
      store.replaceReducer(nextReducer)
    })
  }

  return store
}

export default configureStore
