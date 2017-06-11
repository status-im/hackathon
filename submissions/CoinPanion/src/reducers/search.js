import * as actionTypes from '../actions/actionTypes'

const defaultState = {
  results: {}
}

export default function search(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.SEARCH:
      return { ...state, results: action.payload }
    default:
      return state
  }
}
