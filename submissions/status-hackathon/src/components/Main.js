import React, { PropTypes } from 'react'

import { WorkflowStates } from '../actions'

import HomeContainer from '../containers/HomeContainer'
import NewTabContainer from '../containers/NewTabContainer'
import JoinTabContainer from '../containers/JoinTabContainer'
import ConfirmTabContainer from '../containers/ConfirmTabContainer'
import WaitingContainer from '../containers/WaitingContainer'
import ResultsContainer from '../containers/ResultsContainer'

const Main = ({ workflow_state }) => {
  switch (workflow_state) {
  case WorkflowStates.NEW_TAB:
    return <NewTabContainer/>
  case WorkflowStates.JOIN_TAB:
    return <JoinTabContainer/>
  case WorkflowStates.CONFIRM_TAB:
    return <ConfirmTabContainer/>
  case WorkflowStates.WAITING:
    return <WaitingContainer/>
  case WorkflowStates.RESULTS:
    return <ResultsContainer/>
  case WorkflowStates.HOME:
  default:
    return <HomeContainer/>
  }
}

Main.propTypes = {
  workflow_state: PropTypes.string.isRequired
}

export default Main
