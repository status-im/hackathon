import * as actionTypes from './actionTypes'
import firebase from 'firebase'
import * as querybase from 'querybase'

export function search(query) {
  return dispatch => {
    const databaseRef = firebase.database().ref().child('users')
    const querybaseRef = querybase.ref(databaseRef, [])
    const queriedDb1Ref = querybaseRef.where('email').startsWith(query)
    const queriedDb2Ref = querybaseRef.where('eth_address').startsWith(query)
    const queriedDb3Ref = querybaseRef.where('first_name').startsWith(query)
    const queriedDb4Ref = querybaseRef.where('last_name').startsWith(query)
    const pr1 = queriedDb1Ref.once('value')
    const pr2 = queriedDb2Ref.once('value')
    const pr3 = queriedDb3Ref.once('value')
    const pr4 = queriedDb4Ref.once('value')
    Promise.all([pr1, pr2, pr3, pr4]).then(([email, eth, first_name, last_name]) => {
      const results = Object.assign({}, email.val(), eth.val(), first_name.val(), last_name.val())
      dispatch({ type: actionTypes.SEARCH, payload: results })
    })
  }
}
