const INIT_STATE = {
  all: []
}

export default function orders(state = INIT_STATE, action) {
  switch (action.type) {
    case 'POPULATE_LOG':

    case 'ADD_LOG':
      return {
        ...state,
        all: state.all.concat({
          time: action.time,
          description: action.description,
          hash: action.hash
        })
      }
    default:
      return state
  }
}
