import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import SearchBar from '../Search'
import AppBar from 'material-ui/AppBar'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import NavigationMenu from 'material-ui/svg-icons/navigation/menu'
import { white } from 'material-ui/styles/colors'

import { searchResultsForPopup } from '../../utils/selectors'
import * as searchActions from '../../actions/search'

const Menu = (props, context) =>
  <IconMenu
    iconButtonElement={<IconButton><NavigationMenu color={white} /></IconButton>}
    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
    onItemTouchTap={(e, c) => context.router.history.push(c.props.data)}
  >
    <MenuItem data="/explore" primaryText="Explore" />
    <MenuItem data="/dashboard" primaryText="Dashboard" />
    <MenuItem data="/editprofile" primaryText="Edit My Profile" />
    <MenuItem data="/about" primaryText="About" />
  </IconMenu>

Menu.muiName = 'IconMenu'
Menu.contextTypes = {
  router: PropTypes.any
}

class NavBar extends Component {
  handleSearch = query => {
    this.props.search(query)
  }

  render() {
    return (
      <AppBar title="CoinPanion" iconClassNameRight="muidocs-icon-navigation-expand-more" iconElementLeft={<Menu />}>
        <SearchBar
          onChange={this.handleSearch}
          onRequestSearch={({ value }) => {
            this.context.router.history.push(`/profile/${value.id}`)
          }}
          style={{ alignSelf: 'center', borderRadius: 50 }}
          dataSource={this.props.data}
          hintText="Type anything"
          maxSearchResults={10}
          dataSourceConfig={{
            text: 'text',
            value: 'value'
          }}
        />
      </AppBar>
    )
  }
}

function mapStateToProps(state) {
  return { data: searchResultsForPopup(state) }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...searchActions }, dispatch)
}

NavBar.contextTypes = {
  router: PropTypes.any
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
