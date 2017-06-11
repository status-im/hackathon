import {
  actions
} from '../actions'

const initialState = {
  peerCoinLoaded: false,
  groupDataLoaded: false,
  screen: 3,
  openBets: [],
  openGroupBets: [],
  groupMembers: [],
  yourInvites: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_SCREEN:
      return {
        ...state,
        screen: action.windowNum
      }
    case actions.SET_ACCOUNT_NUM:
      return {
        ...state,
        accountNum: action.accountNum,
        accountIsSelected: true
      }
    case actions.SAVE_USER_ADDRESS:
      return {
        ...state,
        userAddresses: action.userAddresses
      }
    case actions.SAVE_PEER_COIN:
      return {
        ...state,
        peerCoinLoaded: true,
        peerCoinInstance: action.peerCoinInstance
      }
    case actions.SAVE_USER_GROUPS:
      return {
        ...state,
        groupData: action.groupData,
        groupDataLoaded: true
      }
    case actions.START_GROUP_CREATE:
      return {
        ...state,
        busyCreatingGroup: true
      }
    case actions.CREATED_GROUP:
      return {
        ...state,
        busyCreatingGroup: false
      }
    case actions.LOAD_GROUP_INVITE:
      return {
        ...state,
        screen: 7,
        curGroupId: action.groupID,
        screenContext: action.screenContext
      }
    case actions.GO_TO_PAYMENT_SCREEN:
      return {
        ...state,
        screen: 11,
        curGroupId: action.curGroupId,
        toAddr: action.toAddr,
        fromAddr: action.fromAddr,
      }
    case actions.LOAD_BETS_LIST:
      return {
        ...state,
        openBets: action.openBetsInfo.id,
        openBetsInfo: action.openBetsInfo
      }
    case actions.LOAD_GINVITE_LIST:
      return {
        ...state,
        yourInvites: action.groupInvitesInfo.groupId,
        groupInvitesInfo: action.groupInvitesInfo
      }
    case actions.LOAD_GBETS_LIST:
      console.log('LOAD_GBETS_LIST', action)
      return {
        ...state,
        openGroupBets: action.groupBetsInfo.id,
        groupBetsInfo: action.groupBetsInfo
      }
    case actions.LOAD_GROUP_INFO:
      return {
        ...state,
        groupMembers: action.groupInfo.address,
        groupInfo: action.groupInfo
      }
    case actions.VIEW_GROUP:
      return {
        ...state,
        screen: 9,
        curGroupId: action.curGroupId,
      }
    case actions.GIVE_BET_POS:
      return {
        ...state,
        screen: 10,
        curBid: action.curBid,
        betDescription: action.betDescription,
      }
    case actions.CREATE_BET_DONE:
      return {
        ...state,
        screen: 3,
      }
    case actions.FINISH_INVITE:
      return {
        ...state,
        screen: 9,
        curGroupId: action.gid
      }
    case actions.CREATE_BET_PAGE:
      return {
        ...state,
        screen: 8,
        curGroupId: action.curGroupId
      }
    default:
      return state
  }
}

export default reducer
