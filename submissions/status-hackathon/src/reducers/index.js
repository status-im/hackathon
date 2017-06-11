import * as actions from '../actions'

const initialState = {
  workflow_state: actions.WorkflowStates.HOME,
  name: '',
  total: null,
  npeople: null,
  npeople_joined: 0,
  payment_option: null,
  created_by_user: false,
  shortid: null,
  winner_user_name: null,
  user_name: null,
  address: null,
  user_is_sender: false,
  friends: [],
  selected_users: [],
  finalized: false,
  share: null,
  error: null
}

const tab = (state, action) => {
  if (typeof state === 'undefined') {
    return initialState
  }
  switch (action.type) {
  case actions.NEW_TAB:
  case actions.JOIN_TAB:
  case actions.CANCEL_TAB:
  case actions.CREATE_TAB_SUCCEEDED:
  case actions.EVERYONE_JOINED:
    return Object.assign({}, state, {
      workflow_state: action.workflow_state
    })    
  case actions.CREATE_TAB:
    return Object.assign({}, state, {
      name: action.name,
      total: action.total,
      npeople: action.npeople,
      friends: action.friends,
      selected_users: action.selected_users,
      payment_option: action.payment_option,
      shortid: action.shortid,
      created_by_user: action.created_by_user,
      npeople_joined: action.npeople_joined,
      finalized: action.finalized
    })
  case actions.FIND_TAB_SUCCEEDED:
    return Object.assign({}, state, {
      name: action.name,
      total: action.total,
      npeople: action.npeople,
      payment_option: action.payment_option,
      shortid: action.shortid,
      created_by_user: action.created_by_user,
      workflow_state: action.workflow_state
    })
  case actions.FIND_TAB:
    return Object.assign({}, state, {
      shortid: action.shortid
    })
  case actions.FIND_TAB_NOT_FOUND:
    return Object.assign({}, state, {
      shortid: action.shortid,
      workflow_state: action.workflow_state,
      error: action.error
    })
  case actions.SEND_MONEY:
    return state
  case actions.PAY_IN_PERSON:
  case actions.PAY_FRIENDS:
    return Object.assign({}, state, {
      user_is_sender: action.user_is_sender,
      user_name: action.user_name,
      address: action.address,
      workflow_state: action.workflow_state,
      npeople_joined: state.npeople_joined + 1
    })
  case actions.UPDATE_JOINED_COUNT:
    return Object.assign({}, state, {
      friends: action.friends
    })
  case actions.FINALIZE_TAB:
    return Object.assign({}, state, {
      workflow_state: action.workflow_state,
      selected_users: action.selected_users,
      finalized: action.finalized
    })    
  default:
    return state
  }
}

export default tab
