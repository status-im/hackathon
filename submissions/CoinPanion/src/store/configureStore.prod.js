import { createStore, compose, applyMiddleware } from 'redux'
import { persistState } from 'redux-devtools'
import thunk from 'redux-thunk'
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase'
import rootReducer from '../reducers'
import { config as fbConfig } from '../../devConfig'

const config = {
  userProfile: 'users',
  enableLogging: false
}

function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
      applyMiddleware(thunk.withExtraArgument(getFirebase)),
      reactReduxFirebase(fbConfig, config)
    )
  )

  return store
}

export default configureStore
