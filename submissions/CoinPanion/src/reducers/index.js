import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import profile from './profile'
import search from './search'
import { firebaseStateReducer as firebase } from 'react-redux-firebase'
import web3 from './web3'

const rootReducer = combineReducers({
  form: formReducer,
  profile,
  firebase,
  search,
  web3
})

export default rootReducer
