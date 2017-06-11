import shortid from 'shortid'
import { getEthAddress } from '../eth'

export const NEW_TAB = 'NEW_TAB'
export const JOIN_TAB = 'JOIN_TAB'

export const CREATE_TAB = 'CREATE_TAB'
export const CREATE_TAB_SUCCEEDED = 'CREATE_TAB_SUCCEEDED'
export const CREATE_TAB_FAILED = 'CREATE_TAB_FAILED'

export const FIND_TAB = 'FIND_TAB'
export const FIND_TAB_SUCCEEDED = 'FIND_TAB_SUCCEEDED'
export const FIND_TAB_NOT_FOUND = 'FIND_TAB_NOT_FOUND'
export const FIND_TAB_FAILED = 'FIND_TAB_FAILED'

export const CANCEL_TAB = 'CANCEL_TAB'
export const SEND_MONEY = 'SEND_MONEY'
export const PAY_IN_PERSON = 'PAY_IN_PERSON'
export const PAY_FRIENDS = 'PAY_FRIENDS'

export const UPDATE_JOINED_COUNT = 'UPDATE_JOINED_COUNT'
export const INCREASE_JOIN_COUNT_FAILED = 'INCREASE_JOIN_COUNT_FAILED'
export const WAITING_FOR_EVERYONE_FAILED = 'WAITING_FOR_EVERYONE_FAILED'

export const FINALIZE_TAB = 'FINALIZE_TAB'
export const FINALIZE_TAB_FAILED = 'FINALIZE_TAB_FAILED'

export const WorkflowStates = {
  HOME: 'HOME',
  NEW_TAB: 'NEW_TAB',
  CONFIRM_TAB: 'CONFIRM_TAB',
  JOIN_TAB: 'JOIN_TAB',
  WAITING: 'WAITING',
  RESULTS: 'RESULTS'
}

export const PaymentOptions = {
  SPLIT_EVENLY: 'SPLIT_EVENLY',
  CREDIT_CARD_ROULETTE: 'CREDIT_CARD_ROULETTE',
  FREE_MEAL_ROULETTE: 'FREE_MEAL_ROULETTE'
}

export const newTab = () => {
  return {
    type: NEW_TAB,
    workflow_state: WorkflowStates.NEW_TAB
  }
}

export const joinTab = () => {
  return {
    type: JOIN_TAB,
    workflow_state: WorkflowStates.JOIN_TAB
  }
}

export const createTab = (name, total, npeople, payment_option) => {
  return {
    type: CREATE_TAB,
    name,
    total,
    npeople,
    npeople_joined: 0,
    friends: [],
    selected_users: [],
    payment_option,
    created_by_user: true,
    finalized: false,
    shortid: shortid.generate()
  }
}

export const createTabSucceeded = () => {
  return {
    type: CREATE_TAB_SUCCEEDED,
    workflow_state: WorkflowStates.CONFIRM_TAB
  }
}

export const createTabFailed = (error) => {
  return {
    type: CREATE_TAB_FAILED,
    error: error
  }
}

export const findTab = (shortid) => {
  return {
    type: FIND_TAB,
    shortid: shortid
  }
}

export const findTabSucceeded = (data) => {
  return {
    type: FIND_TAB_SUCCEEDED,
    name: data.name,
    shortid: data.shortid,
    total: data.total,
    npeople: data.npeople,
    payment_option: data.payment_option,
    created_by_user: false,
    workflow_state: WorkflowStates.CONFIRM_TAB
  }
}

export const findTabNotFound = () => {
  return {
    type: FIND_TAB_NOT_FOUND,
    shortid: null,
    workflow_state: WorkflowStates.JOIN_TAB,
    error: 'Unable to find a tab with that code.'
  }
}

export const findTabFailed = (error) => {
  return {
    type: FIND_TAB_FAILED
  }
}

export const cancelTab = () => {
  return {
    type: CANCEL_TAB,
    workflow_state: WorkflowStates.HOME // TODO: look at current state
  }
}

export const sendMoney = () => {
  return {
    type: SEND_MONEY
  }
}

export const payFriends = (user_name) => {
  return  {
    type: PAY_FRIENDS,
    user_is_sender: true,
    user_name: user_name,
    address: getEthAddress(),
    workflow_state: WorkflowStates.WAITING
  }
}

export const payInPerson = (user_name) => {
  return {
    type: PAY_IN_PERSON,
    user_is_sender: false,
    user_name,
    address: getEthAddress(),
    workflow_state: WorkflowStates.WAITING
  }
}

export const updateJoined = (friends) => {
  return {
    type: UPDATE_JOINED_COUNT,
    friends: friends
  }
}

export const increaseJoinCountFailed = (error) => {
  return {
    type: INCREASE_JOIN_COUNT_FAILED
  }
}

export const waitingForEveryoneFailed = (error) => {
  return {
    type: WAITING_FOR_EVERYONE_FAILED
  }
}

export const finalizeTab = (selected_users) => {
  return {
    type: FINALIZE_TAB,
    finalized: true,
    selected_users: selected_users,
    workflow_state: WorkflowStates.RESULTS
  }
}

export const finalizeTabFailed = () => {
  return {
    type: FINALIZE_TAB_FAILED
  }
}
