import { connect } from 'react-redux'
import { cancelTab, finalizeTab } from '../actions'
import Waiting from '../components/Waiting'

const mapStatesToProps = (state) => {
  return {
    tab: state.tab
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { tab } = stateProps
  const { dispatch } = dispatchProps
  
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    onCancelTabClick: () => {
      dispatch(cancelTab())
    },
    onFinalizeTabClick: (data) => {
      if (typeof data.selected_users === 'undefined') {
        return
      }
      let selected_users = Object.keys(data.selected_users)

      selected_users.push(tab.address)
      // TODO: disable form submission unless the right number of people are selected
      if (selected_users.length === tab.npeople) {
        dispatch(finalizeTab(selected_users))
      }
    }
  }
}

const WaitingContainer = connect(mapStatesToProps, null, mergeProps)(Waiting)

export default WaitingContainer
