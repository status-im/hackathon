import { connect } from 'react-redux'
import { findTab, cancelTab } from '../actions'
import JoinTab from '../components/JoinTab'

const mapStateToProps = (state) => {
  return {
    tab: state.tab
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onFindTabClick: (data) => {
      dispatch(findTab(data.shortid))
    },
    onCancelJoinTabClick: () => {
      dispatch(cancelTab())
    }
  }
}

const JoinTabContainer = connect(mapStateToProps, mapDispatchToProps)(JoinTab)

export default JoinTabContainer
