import * as actionTypes from './actionTypes'
import firebase from 'firebase'
import * as querybase from 'querybase'

export function getUser(user) {
  return async dispatch => {
    const databaseRefCoinings = firebase.database().ref().child('coinings')
    const coiningsRef = querybase.ref(databaseRefCoinings, [])
    const databaseRefUsers = firebase.database().ref().child('users')
    const usersRef = querybase.ref(databaseRefUsers, [])

    const coineeObject = {}
    const coineeIsMeSnap = await coiningsRef.where({ coinee: user.eth_address }).once('value')
    const coineeIsMePromise = Object.values(coineeIsMeSnap.val() || {}).map(coining => {
      coineeObject[coining.coiner.toLowerCase()] = coining
      return usersRef.where({ eth_address: coining.coiner.toLowerCase() }).once('value')
    })
    const responseCoineeIsMe = await Promise.all(coineeIsMePromise)
    user.coinedBy = responseCoineeIsMe.map(res => {
      const [user] = Object.values(res.val())
      console.log(user, coineeObject)
      console.log(coinerObject, user.eth_address)
      user.coining = coineeObject[user.eth_address]
      return user
    })

    const coinerObject = {}
    const coinerIsMeSnap = await coiningsRef.where({ coiner: user.eth_address }).once('value')
    const coinerIsMePromise = Object.values(coinerIsMeSnap.val() || {}).map(coining => {
      coinerObject[coining.coinee.toLowerCase()] = coining
      return usersRef.where({ eth_address: coining.coinee.toLowerCase() }).once('value')
    })
    const responseCoinerIsMe = await Promise.all(coinerIsMePromise)
    user.coinedByMe = responseCoinerIsMe.map(res => {
      const [user] = Object.values(res.val())
      user.coining = coinerObject[user.eth_address]
      return user
    })

    dispatch({ type: actionTypes.GET_USER, payload: user })
  }
}
