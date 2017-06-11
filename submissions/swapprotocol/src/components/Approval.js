import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Dialog from 'react-toolbox/lib/dialog/Dialog';
import Slider from 'react-toolbox/lib/slider/Slider'

class Approval extends Component {

  state = {
    value: 1
  }

  approve() {
    this.props.dispatch({
      type: 'APPROVE',
      tokenAddress: this.props.approving.address,
      amount: this.state.value
    });
  }

  handleChange = (value) => {
    this.setState({
      value
    })
  }

  closeModal() {
    this.props.dispatch({
      type: 'CLOSE_APPROVE'
    });
  }

  render() {
    let title = null
    let content = null
    let actions = []

    if (this.props.approving) {
      if (this.props.error) {
        content = <div>Error!</div>
      } else {
        title = `Approve an amount of ${this.props.approving.ticker} for trade`
        content = (
          <Slider
            min={0}
            max={100}
            editable
            step={1}
            value={this.state.value}
            onChange={this.handleChange}
          />
        )
        actions = [
          { label: 'Cancel', onClick: () => this.closeModal() },
          { label: 'Approve!', onClick: () => this.approve() }
        ];
      }
    }

    return (
      <Dialog
        actions={actions}
        active={!!this.props.approving}
        onEscKeyDown={() => this.closeModal()}
        onOverlayClick={() => this.closeModal()}
        title={title}
      >
        {content}
      </Dialog>
    )
  }
}

Approval.propTypes = {
  error: PropTypes.string,
  approving: PropTypes.shape({
    address: PropTypes.string,
    ticker: PropTypes.string,
    name: PropTypes.string,
    balance: PropTypes.number
  }),
  dispatch: PropTypes.func.isRequired
}

Approval.defaultProps = {
  error: null,
  approving: null
}

const mapStateToProps = state => ({
  error: state.tracking.error,
  approving: state.tracking.approving
});

export default connect(mapStateToProps)(Approval)
