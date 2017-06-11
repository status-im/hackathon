import { connect } from 'react-redux'
import { cancelTab } from '../actions'
import Results from '../components/Results'

const mapStatesToProps = (state) => {
  return {
    tab: state.tab
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCancelTabClick: () => {
      dispatch(cancelTab())
    }
  }
}

const ResultsContainer = connect(mapStatesToProps, mapDispatchToProps)(Results)

export default ResultsContainer
