import React, { Component } from 'react'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'

export default class DropDown extends Component {
  constructor(props) {
    super(props)
    this.state = { value: 1 }
  }

  handleChange = (event, index, value) => this.setState({ value })

  render() {
    return (
      <DropDownMenu value={this.state.value} onChange={this.handleChange}>
        <MenuItem value={1} primaryText="Newest" />
        <MenuItem value={2} primaryText="Trending" />
        <MenuItem value={3} primaryText="Top" />
        <MenuItem value={4} primaryText="Search by Interest" />
      </DropDownMenu>
    )
  }
}
