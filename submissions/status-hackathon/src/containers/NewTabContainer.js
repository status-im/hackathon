import { connect } from 'react-redux'
import { createTab, cancelTab } from '../actions'
import NewTab from '../components/NewTab'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCreateTabClick: (data) => {
      dispatch(createTab(data.name, data.total, +data.npeople, data.payment_option))
    },
    onCancelTabClick: () => {
      dispatch(cancelTab())
    }
  }
}

const NewTabContainer = connect(null, mapDispatchToProps)(NewTab)

export default NewTabContainer
