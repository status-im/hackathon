import { connect } from 'react-redux'

import Main from '../components/Main'

const mapStateToProps = (state, ownProps) => {
  return {
    workflow_state: state.tab.workflow_state
  }
}

const MainContainer = connect(mapStateToProps)(Main)

export default MainContainer
