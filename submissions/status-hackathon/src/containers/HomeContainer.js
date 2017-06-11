import { connect } from 'react-redux'
import { newTab, joinTab } from '../actions'
import Home from '../components/Home'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onNewTabClick: () => {
      dispatch(newTab())
    },
    onJoinTabClick: () => {
      dispatch(joinTab())
    }
  }
}

const HomeContainer = connect(null, mapDispatchToProps)(Home)

export default HomeContainer
