import { apply, put, take, takeEvery, select, fork, all } from 'redux-saga/effects'

import Swap from '../swap'

const ROPSTEN_NETWORK = '3'
let swap = null

export function* initialize() {
  yield take('INITIALIZE')

  if (window.web3) {
    swap = new Swap(
      window.web3,
      window.fetch.bind(window),
      window.localStorage
    )

    yield put({ type: 'GET_NETWORK' })
    yield put({ type: 'GET_ADDRESS' })

    const { address } = yield take('GOT_ADDRESS')
    console.info('Web3 provided account', address)

    if (address) {
      yield put({ type: 'GET_ETHER_BALANCE', address })

      const tokens = yield select(
        state => (state.tracking.available.map(token => (token.address))))
      yield put({ type: 'GET_BALANCES', tokens, address })
      yield put({ type: 'GET_ALLOWANCES', tokens })
      yield put({ type: 'INITIALIZED' })
    } else {
      yield put({ type: 'INITIALIZE_ERROR',
        message: 'Unable to access your account from web3.' })
    }
  } else {
    yield put({ type: 'INITIALIZE_ERROR',
      message: 'Unable to access a web3 instance.' })
  }
}

/*
 * Ethereum calls
 */

function* getNetwork() {
  const result = yield apply(swap, swap.getNetwork)

  if (result !== ROPSTEN_NETWORK) {
    yield put({ type: 'INITIALIZE_ERROR',
      message: 'The Swap Shop is only configured to work on Ropsten.' })
  } else {
    yield put({ type: 'GOT_NETWORK', result })
  }
}

function* everyGetNetwork() {
  yield takeEvery('GET_NETWORK', getNetwork)
}

function* getAddress() {
  const address = yield apply(swap, swap.getAddress)
  yield put({ type: 'GOT_ADDRESS', address })
}

function* everyGetAddress() {
  yield takeEvery('GET_ADDRESS', getAddress)
}

function* getEtherBalance({ address }) {
  const balance = yield apply(swap, swap.getEtherBalance, [address])
  yield put({ type: 'GOT_ETHER_BALANCE', balance })
}

function* everyGetEtherBalance() {
  yield takeEvery('GET_ETHER_BALANCE', getEtherBalance)
}

function* getBalances({ tokens, address }) {
  for (const token of tokens) {
    const balance = yield apply(swap, swap.getBalance, [token, address])
    yield put({ type: 'GOT_BALANCE', token, address, balance })
  }
}

function* everyGetBalances() {
  yield takeEvery('GET_BALANCES', getBalances)
}

function* getAllowances({ tokens }) {
  for (const token of tokens) {
    const allowance = yield apply(swap, swap.getAllowance, [token])
    yield put({ type: 'GOT_ALLOWANCE', token, allowance })
  }
}

function* everyGetAllowances() {
  yield takeEvery('GET_ALLOWANCES', getAllowances)
}

function* approve({ tokenAddress, amount }) {
  try {
    const hash = yield apply(swap, swap.approve, [tokenAddress, amount])
    yield put({ type: 'APPROVE_PENDING', hash, tokenAddress, amount })

    const approvedToken = yield select(state => state.tracking.available.find(token => (
      token.address === tokenAddress
    )))

    const time = new Date().getTime()
    const description = `Approved ${amount} ${approvedToken.ticker} for trading`
    yield put({ type: 'ADD_LOG', time, description, hash })
  } catch ({ message }) {
    yield put({ type: 'APPROVE_FAILED', message })
  }
}

function* everyApprove() {
  yield takeEvery('APPROVE', approve)
}

function* fill({ order }) {
  try {
    const hash = yield apply(swap, swap.fill, [
      order.makerAddress,
      order.makerAmount,
      order.makerToken,
      order.takerAddress,
      order.takerAmount,
      order.takerToken,
      order.expiration,
      order.signature])
    yield put({ type: 'FILL_PENDING', hash, order })

    const time = new Date().getTime()
    const description = 'Filled an order'
    yield put({ type: 'ADD_LOG', time, description, hash })
  } catch ({ message }) {
    yield put({ type: 'FILL_FAILED', message })
  }
}

function* everyFill() {
  yield takeEvery('FILL', fill)
}

/*
 * Peer calls
 */

function* getIntent() {
  const result = yield apply(swap, swap.getIntent)
  yield put({ type: 'GOT_INTENT', result })
}

function* everyGetIntent() {
  yield takeEvery('GET_INTENT', getIntent)
}

function* getQuotes(action) {
  const result = yield apply(swap, swap.getQuotes,
    [action.makerAmount, action.makerToken, action.takerTokens])
  yield put({ type: 'GOT_QUOTES', result })
}

function* everyGetQuotes() {
  yield takeEvery('GET_QUOTES', getQuotes)
}

function* getOrder(action) {
  const result = yield apply(swap, swap.getOrder,
    [action.makerAmount, action.makerToken, action.takerAddress, action.takerToken])

  yield put({ type: 'GOT_ORDER', result })
}

function* everyGetOrder() {
  yield takeEvery('GET_ORDER', getOrder)
}

export default function* root() {
  yield all([
    fork(initialize),
    fork(everyGetNetwork),
    fork(everyGetAddress),
    fork(everyGetEtherBalance),
    fork(everyGetBalances),
    fork(everyGetAllowances),
    fork(everyApprove),
    fork(everyGetIntent),
    fork(everyGetQuotes),
    fork(everyGetOrder),
    fork(everyFill)
  ])
}
