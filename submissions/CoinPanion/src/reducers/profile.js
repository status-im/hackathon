import * as actionTypes from '../actions/actionTypes'

const defaultState = {
  user: {
    first_name: '',
    last_name: ''
  }
}

export default function profile(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.GET_USER:
      return { ...state, user: action.payload }
    default:
      return state
  }
}
