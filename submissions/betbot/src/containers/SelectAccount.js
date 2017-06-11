//NOTE:: this is a hack, to enable our device to have multiple accounts
import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import { connect } from 'react-redux'
import {setAccountNum} from '../actions'
import {List, ListItem} from 'material-ui/List';

class CreateGroup extends Component {
  constructor(props) {
    super(props)

    this.setGroupName = this.selectAccountNum.bind(this)

  }

  selectAccountNum(num) {
    this.props.dispatch(
      setAccountNum(num)
    )
  }
  render() {
    const list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const listItems = list.map((i) =>

          <ListItem
            key={i}
            primaryText={"Account #" + i}
            onClick={() => this.selectAccountNum(i)}
          />
    )
    return (
      <div className='CreateGroup'>
        <List>
          {listItems}
        </List>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
   }
}

export default connect(mapStateToProps)(CreateGroup)
