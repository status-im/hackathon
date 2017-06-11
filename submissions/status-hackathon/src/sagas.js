import { delay } from 'redux-saga'
import { call, cancel, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { create, get, update } from 'firebase-saga'
import fetch from 'isomorphic-fetch'
import * as actions from './actions'
import * as selectors from './selectors'
import { sendEth } from './eth'

const createTabAsync = (data) => {
  return create('tabs', () => ({
    [`tabs/${data.shortid}`]: data
  }))
}

const findTabAsync = (shortid) => {
  return get('tabs', shortid)
}

const updateTabAsync = (shortid, data) => {
  return update('tabs', shortid, data)
}

const convertUSDToEthAsync = (usd_amount) => {
  const url = 'https://api.coinmarketcap.com/v1/ticker/ethereum/'

  return fetch(url).then(function(response) {
    return response.json()
  }).then(function(results) {
    return usd_amount / results[0].price_usd
  })
}

function* createTabSaga(action) {
  try {
    const data = {
      name: action.name,
      total: action.total,
      npeople: action.npeople,
      npeople_joined: action.npeople_joined,
      payment_option: action.payment_option,
      shortid: action.shortid
    }
    yield call(createTabAsync, data)
    yield put(actions.createTabSucceeded())
  } catch (error) {
    console.warn(error)
    yield put(actions.createTabFailed(error))
  }
}

function* findTabSaga(action) {
  try {
    const data = yield call(findTabAsync, action.shortid)

    if (data === null) {
      yield put(actions.findTabNotFound())
    } else {
      yield put(actions.findTabSucceeded(data))
    }
  } catch (error) {
    console.warn(error)
    yield put(actions.findTabFailed(error))
  } 
}

function* waitForEveryoneSaga(action) {
  const shortid = yield select(selectors.shortid)
  const created_by_user = yield select(selectors.created_by_user)
  const user_is_sender = yield select(selectors.user_is_sender)
  const address = yield select(selectors.address)
  const new_friend = {
    user_name: action.user_name,
    address: address,
    creator: created_by_user,
    sender: user_is_sender
  }
  let waiting = true

  try {
    const data = yield call(findTabAsync, shortid)
    
    if (typeof data.friends === 'undefined') {
      data.friends = [new_friend]
    } else {
      // TODO: cycle through first and verify the user is not already joined
      data.friends.push(new_friend)
    }
    // FIXME: not atomic - this will be fixed when we migrate to a contract
    yield call(updateTabAsync, shortid, data)
  } catch (error) {
    console.warn(error)
    yield put(actions.increaseJoinCountFailed(error))
  }
  try {
    while (waiting) {
      const data = yield call(findTabAsync, shortid)
      console.log('waiting...')
      yield put(actions.updateJoined(data.friends))
      if (!created_by_user && data.finalized) {
        yield put(actions.finalizeTab())
      }
      yield call(delay, 2000)
    }
  } catch (error) {
    console.warn(error)
    yield put(actions.waitingForEveryoneFailed(error))
  }
}

function* waitForFinalizeTabSaga(action) {
  const shortid = yield select(selectors.shortid)
  const created_by_user = yield select(selectors.created_by_user)
  const user_is_sender = yield select(selectors.user_is_sender)
  const address = yield select(selectors.address)

  try {
    if (created_by_user) {
      // Let friends know that the tab has been finalized
      const updated_data = {
        finalized: action.finalized,
        selected_users: action.selected_users
      }
      yield call(updateTabAsync, shortid, updated_data)
    }
    if (!user_is_sender) {
      return
    }
    // Settle accounts
    const data = yield call(findTabAsync, shortid)
    const valid_users = data.friends.filter((u) => data.selected_users.includes(u.address))
    const senders = valid_users.filter((u) => u.sender)
    const receivers = valid_users.filter((u) => !u.sender)
    const nsenders = senders.length
    const nreceivers = receivers.length

    if (nsenders + nreceivers !== data.npeople) {
      const error = `Number of selected users (${nsenders + nreceivers}) does not match original number of people (${data.npeople})`
      console.warn(error)
      yield put(actions.finalizeTabFailed(error))
      return
    }
    
    const sender_share = data.total / data.npeople
    const receiver_share = sender_share * nsenders / nreceivers
    const send_each_receiver = sender_share / nreceivers
    const send_eth = yield call(convertUSDToEthAsync, send_each_receiver)

    // Inefficient in terms of the number of transactions, but we don't have time
    // to add centralized coordination - so, send an equal amount to each receiver
    console.log(`sender share ${sender_share}`)
    console.log(`receiver share ${receiver_share}`)
    console.log(`${send_eth} ETH`)
    receivers.forEach(function (friend) {
      sendEth(address, friend.address, send_eth)
    })
  } catch (error) {
    console.warn(error)
    yield put(actions.finalizeTabFailed(error))
  }
}

function* cancelWaitingSaga(task) {
  yield cancel(task)
}

function* watchCreateTab() {
  yield takeEvery(actions.CREATE_TAB, createTabSaga)
}

function* watchFindTab() {
  yield takeEvery(actions.FIND_TAB, findTabSaga)
}

function* watchWaiting() {
  yield takeEvery(actions.PAY_FRIENDS, waitForEveryoneSaga)
  yield takeEvery(actions.PAY_IN_PERSON, waitForEveryoneSaga)
}

function* watchFinalizeTab(waitingTask) {
  yield fork(takeLatest, actions.FINALIZE_TAB, cancelWaitingSaga, waitingTask)
  yield takeLatest(actions.FINALIZE_TAB, waitForFinalizeTabSaga)
}

function* rootSaga() {
  yield fork(watchCreateTab)
  yield fork(watchFindTab)
  const waitingTask = yield fork(watchWaiting)
  yield fork(watchFinalizeTab, waitingTask)
}

export default rootSaga
