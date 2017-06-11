const INIT_STATE = {
  available: [],
  error: false,
  purchasing: null,
  quotes: []
}

export default function shop(state = INIT_STATE, action) {
  switch (action.type) {
    case 'GOT_INTENT':
      return {
        ...state,
        available: action.result[0]
      }
    case 'START_CHECKOUT':
      return {
        ...state,
        purchasing: action.intent
      }
    case 'FILL_PENDING':
      return {
        ...state,
        purchasing: null
      }
    case 'CLOSE_CHECKOUT':
      return {
        ...state,
        purchasing: null
      }
    case 'GET_QUOTES':
      return {
        ...state,
        quotes: null
      }
    case 'GOT_QUOTES':
      return {
        ...state,
        quotes: action.result
      }
    case 'GOT_ORDER':
      return {
        ...state,
        order: action.result
      }
    default:
      return state
  }
}
