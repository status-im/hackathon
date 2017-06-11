
import { bubble as Menu } from 'react-burger-menu'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setScreen } from '../actions'

import './sidebarstyle.css'

class SideBar extends Component {
  static propTypes = {

  }

  render() {
    // TODO:: set up font awesome (fa) icons. Make these menu items visible.
    // Look at https://github.com/negomi/react-burger-menu for instructions
    return (
      <Menu right>
        <a id="about" onClick={() => this.props.setScreen(0)} className="menu-item" ><i className="fa fa-fw fa-star-o" /><span>Home</span></a>
        <a id="home" onClick={() => this.props.setScreen(1)} className="menu-item" ><i className="fa fa-fw fa-star-o" /><span>How It Works</span></a>
        <a id="contact" onClick={() => this.props.setScreen(2)} className="menu-item" ><i className="fa fa-fw fa-star-o" /><span>My Groups</span></a>
        <a id="ntnth" onClick={() => this.props.setScreen(3)} className="menu-item" ><i className="fa fa-fw fa-star-o" /><span>My Bets</span></a>
        <a id="nth" onClick={() => this.props.setScreen(4)} className="menu-item" ><i className="fa fa-fw fa-star-o" /><span>Create Group</span></a>
        <a id="ntnth" onClick={() => this.props.setScreen(5)} className="menu-item" ><i className="fa fa-fw fa-star-o" /><span>Token Info</span></a>
        <a id="ntnth" onClick={() => this.props.setScreen(6)} className="menu-item" ><i className="fa fa-fw fa-star-o" /><span>Bot Instructions</span></a>
      </Menu>
    )
  }
}

const mapStateToProps = state => {
  return {
  }
}

export default connect(
  mapStateToProps,
  {setScreen}
)(SideBar)
