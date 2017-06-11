import PeerCoinContract from '../../build/contracts/PeerCoin.json'
import Config from '../../truffle.js'
import Web3 from 'web3'
var math = require('mathjs')

export const actions = {
  CUSTOM_ACTION: 'CUSTOM_ACTION',
  SET_SCREEN: 'SET_SCREEN',
  SAVE_PEER_COIN: 'SAVE_PEER_COIN',
  SAVE_USER_GROUPS: 'SAVE_USER_GROUPS',
  START_GROUP_CREATE: 'START_GROUP_CREATE',
  SAVE_USER_ADDRESS: 'SAVE_USER_ADDRESS',
  LOAD_GROUP_INVITE: 'LOAD_GROUP_INVITE',
  SET_ACCOUNT_NUM: 'SET_ACCOUNT_NUM',
  START_INVITE: 'START_INVITE',
  FINISH_INVITE: 'FINISH_INVITE',
  VIEW_GROUP: 'VIEW_GROUP',
  CREATE_BET_PAGE: 'CREATE_BET_PAGE',
  LOAD_BETS_LIST: 'LOAD_BETS_LIST',
  LOAD_GBETS_LIST: 'LOAD_GBETS_LIST',
  LOAD_GROUP_INFO: 'LOAD_GROUP_INFO',
  LOAD_GINVITE_LIST: 'LOAD_GINVITE_LIST',
  GIVE_BET_POS: 'GIVE_BET_POS',
  GO_TO_PAYMENT_SCREEN: 'GO_TO_PAYMENT_SCREEN',
  CREATE_BET_DONE: 'CREATE_BET_DONE',
  CREATED_GROUP: 'CREATED_GROUP'
};

export const loadPeerCoinInstanceAndUserAddress = () => {
  var {host, port} = Config.networks[process.env.NODE_ENV]
  const provider = new Web3.providers.HttpProvider('http://' + host + ':' + port)
  // const provider = window.web3.currentProvider
  const contract = require('truffle-contract')
  const peerCoin = contract(PeerCoinContract)
  peerCoin.setProvider(provider)

  const web3RPC = new Web3(provider)

  return dispatch => {
    console.log('dispatched')
    web3RPC.eth.getAccounts(function(error, accounts) {
      console.log('addresses', accounts)
      dispatch(saveUserAddresses(accounts))
      peerCoin.deployed().then((peerCoinInstance) => {
        dispatch(savePeerCoinInstance(peerCoinInstance))
      })
    })
  }
}

export const loadUsersGroups = (peerCoinInstance, account) => {
  return dispatch => {
    peerCoinInstance.listGroups(account).then(function(result) {
      let groupData = {
        groupIDs: result[0].map(i => window.web3.toAscii(i).replace(/\u0000/g, '')),
        groupNames: result[1].map(i => window.web3.toAscii(i).replace(/\u0000/g, '')),
        groupBalance: String(result[2]).split(',')
      }
      dispatch(saveUsersGroups(groupData))
    })
  }
}

export const loadUsersInvites = (peerCoinInstance, account) => {
  return dispatch => {
    peerCoinInstance.listAllInvitiations(account).then(function(result) {
      console.log('invites<', result)
      let inviteData = {
        groupId:  result[0].map(i => window.web3.toAscii(i).replace(/\u0000/g, '')),
        invStatus: result[1]
      }
      dispatch(saveUsersInvites(inviteData))
    })
  }
}

export const loadUsersBets = (peerCoinInstance, account) => {
  return dispatch => {
    // function listBets(address uaddr) constant returns (bool[] stance ,uint[] amount ,bytes32[] groupIDs,bytes32[] gbetID, bytes32[] state)
    peerCoinInstance.listBets(account).then(function(result) {
      console.log(result)
      let betData = {
        positions: result[0],
        amount: result[1].map(i => math.divide(parseInt(String(i)),1000.0)),
        id: result[2].map(i => window.web3.toAscii(i).replace(/\u0000/g, '')),
        gbid: result[3].map(i => window.web3.toAscii(i).replace(/\u0000/g, '')),
        state: result[4].map(i => window.web3.toAscii(i).replace(/\u0000/g, '')),
      }
      console.log('THIS IS THE BET DATA', betData)
      dispatch(saveLoadBetsList(betData))
    })
  }
}

export const loadGroupsBets = (peerCoinInstance, gid) => {
  return dispatch => {
    peerCoinInstance.listBetsByGID(gid).then(function(result) {
      let betData = {
        id: result[0].map(i => window.web3.toAscii(i).replace(/\u0000/g, '')),
        for: result[1].map(i => math.divide(parseInt(String(i)),1000.0)),
        against: result[2].map(i => math.divide(parseInt(String(i)),1000.0))
      }
      console.log(betData)
      dispatch(saveGroupBetsList(betData))
    })
  }
}

export const loadGroupInfo = (peerCoinInstance, gid) => {
  return dispatch => {
    peerCoinInstance.getGroupInfo(gid).then(function(result) {
      let betData = {
        // id: result[0].map(i => window.web3.toAscii(i).replace(/\u0000/g, ''))
        address: result[1],
        balance: String(result[2]).split(',')
      }
      dispatch(saveGroupInfo(betData))
    })
  }
}

export const inviteUsers = (peerCoinInstance, gid, userAddresses, accountNum, usersIndexList) => {
  return dispatch => {
    startInviting()
    let totalLength = usersIndexList.length
    usersIndexList.map((i) =>
      {
        peerCoinInstance.inviteUser(gid, userAddresses[i], {from: userAddresses[accountNum], gas:3000000}).then(function(result) {
        if ((--totalLength) <= 0)
          dispatch(finishInviting(gid)) // TODO :: left out because no need to over complicate things.
      })}
    )
  }
}

export const accetpYourInvitation = (peerCoinInstance, gid, fromAddress) => {
  return dispatch => {
    peerCoinInstance.acceptInvite(gid, {from: fromAddress, gas:3000000}).then((result) => {
      // console.log(result)
      dispatch(
        loadUsersGroups(peerCoinInstance, fromAddress)
      )
      dispatch(
        loadUsersInvites(peerCoinInstance, fromAddress)
      )
    })
  }
}

export const loadOpenBets = (peerCoinInstance, gid) => {
  return dispatch => {
    // dispatch(viewGroup(gid))
    peerCoinInstance.getGroupInfo(gid).then(function(result) {
      console.log(result)
      // dispatch(saveLoadBetsList(groupData))
    })
  }
}
export const loadGroupDetails = (peerCoinInstance, gid) => {
  return dispatch => {
    dispatch(viewGroup(gid))
    peerCoinInstance.getGroupInfo(gid).then(function(result) {
      console.log(result)
      // let groupData = {
      //   groupIDs: result[0].map(i => window.web3.toAscii(i).replace(/\u0000/g, '')),
      //   groupNames: result[1].map(i => window.web3.toAscii(i).replace(/\u0000/g, '')),
      //   groupBalance: String(result[2]).split(',')
      // }
      // dispatch(saveUsersGroups(groupData))
    })
  }
}

export const createGroup = (peerCoinInstance, groupNameInput, groupId, tokenName, userAddresses, accountIndex) => {
  return dispatch => {
    dispatch(startingCreateNewGroup())
    peerCoinInstance.createGroup(groupNameInput, groupId/*, tokenName*/, {from: userAddresses[accountIndex], gas:3000000}).then(function(result) {
      dispatch(finishCreateGroup())
      dispatch(loadGroupInvites(groupId, 'createdGroup'))
    })
  }
}

export const createBet = (peerCoinInstance, betId, groupId, betDescription, userAddresses, accountIndex) => {
  return dispatch => {
    dispatch(startingCreateNewGroup())
    // function addBet(bytes32 bgid, bytes32 gid, bool bstance, uint bamount) {
    // addBetGroup (bytes32 bgname, bytes32 bgdescription, bytes32 gid)
    peerCoinInstance.addBetGroup(betId, betDescription, groupId, {from: userAddresses[accountIndex], gas:3000000}).then(function(result) {
      // dispatch(finishCreateGroup())
      dispatch(giveBetPossition(betId, betDescription))
      console.log('create bet', result)
    })
  }
}

export const createBetPos = (peerCoinInstance, betId, groupId, bstance, userAddresses, accountIndex) => {
  return dispatch => {
    dispatch(startingCreateNewGroup())
    // function addBet(bytes32 bgid, bytes32 gid, bool bstance, uint bamount) {
    peerCoinInstance.addBet(betId, groupId, bstance, 10000, {from: userAddresses[accountIndex], gas:3000000}).then(function(result) {
      dispatch(createBetPossition())
      console.log('create bet', result)
    })
  }
}
export const sendTokenPayment = (peerCoinInstance, toAdr, groupId, amount, userAddresses, accountIndex) => {
  return dispatch => {
    dispatch(startingCreateNewGroup())
    // function addBet(bytes32 bgid, bytes32 gid, bool bstance, uint bamount) {
    // sendToken(address toAdr, bytes32 gid, uint amount) returns (int balance){
    console.log(toAdr, groupId, parseInt(amount))
    console.log(parseInt(amount))
    peerCoinInstance.sendToken(toAdr, groupId, parseInt(amount), {from: userAddresses[accountIndex], gas:3000000}).then(function(result) {
      dispatch(createBetPossition())
      console.log('create bet', result)
    })
  }
}

export const goToPaymentScreen = (toAddr, fromAddr, curGroupId) => ({
  type: actions.GO_TO_PAYMENT_SCREEN,
  toAddr,
  fromAddr,
  curGroupId
})

export const giveBetPossition = (curBid, betDescription) => ({
  type: actions.GIVE_BET_POS,
  curBid,
  betDescription
})

export const setAccountNum = (accountNum) => ({
  type: actions.SET_ACCOUNT_NUM,
  accountNum
})

export const saveLoadBetsList = (openBetsInfo) => ({
  type: actions.LOAD_BETS_LIST,
  openBetsInfo
})

export const saveGroupInfo = (groupInfo) => ({
  type: actions.LOAD_GROUP_INFO,
  groupInfo
})

export const saveUsersInvites = (groupInvitesInfo) => ({
  type: actions.LOAD_GINVITE_LIST,
  groupInvitesInfo
})

export const saveGroupBetsList = (groupBetsInfo) => ({
  type: actions.LOAD_GBETS_LIST,
  groupBetsInfo
})

// currently inactive...
export const startInviting = () => ({ // TODO: using a counter to tell when inviting is done is very hacky... Fix
  type: actions.START_INVITE
})

export const finishInviting = (gid) => ({ // TODO: using a counter to tell when inviting is done is very hacky... Fix
  type: actions.FINISH_INVITE,
  gid
})

// export const inviteUser = (userAddresses) => ({
//   type: actions.START_INVITE,
//   userAddresses
// })

export const savePeerCoinInstance = (peerCoinInstance) => ({
  type: actions.SAVE_PEER_COIN,
  peerCoinInstance
})

export const saveUserAddresses = (userAddresses) => ({
  type: actions.SAVE_USER_ADDRESS,
  userAddresses
})

export const saveUsersGroups = (groupData) => ({
  type: actions.SAVE_USER_GROUPS,
  groupData: groupData
})

export const setScreen = windowNum => ({
  type: actions.SET_SCREEN,
  windowNum
})

export const startingCreateNewGroup = () => ({
  type: actions.START_GROUP_CREATE,
})

export const finishCreateGroup = () => ({
  type: actions.CREATED_GROUP
})

export const viewGroup = (curGroupId) => ({
  type: actions.VIEW_GROUP,
  curGroupId
})

export const goToCreateBet = (curGroupId) => ({
  type: actions.CREATE_BET_PAGE,
  curGroupId
})

export const createBetPossition = () => ({
  type: actions.CREATE_BET_DONE
})

export const loadGroupInvites = (groupID, screenContext) =>{
  console.log('test', screenContext)
  return ({
    type: actions.LOAD_GROUP_INVITE,
    groupID,
    screenContext
  })
}
