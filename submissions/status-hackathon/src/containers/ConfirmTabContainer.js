import { connect } from 'react-redux'
import { cancelTab, payFriends, payInPerson } from '../actions'
import ConfirmTab from '../components/ConfirmTab'

const mapStatesToProps = (state) => {
  return {
    tab: state.tab
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (data) => {
      if (data.button === 'payFriends') {
        dispatch(payFriends(data.user_name))
      } else if (data.button === 'payInPerson') {
        dispatch(payInPerson(data.user_name))
      } else {
        console.warn(`Unexpected submit button: ${data.button}`)
      }
    },
    onCancelTabClick: () => {
      dispatch(cancelTab())
    }
  }
}

const ConfirmTabContainer = connect(mapStatesToProps, mapDispatchToProps)(ConfirmTab)

export default ConfirmTabContainer
