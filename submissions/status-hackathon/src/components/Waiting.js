import React, { Component, PropTypes } from 'react'
import { Button, ButtonToolbar, Col, Form, FormGroup, Well } from 'react-bootstrap'
import { Field, reduxForm } from 'redux-form'
import { FieldCheckbox } from './Form'

const WaitingButtons = ({ disabled, onFinalizeTabClick, onCancelTabClick, handleSubmit }) => (
  <FormGroup>
    <Col smOffset={2} sm={10}>
      <ButtonToolbar>
        <Button
           bsSize="large"
           bsStyle="default"
           onClick={handleSubmit(onFinalizeTabClick)}
           disabled={disabled}>
          Finalize
        </Button>
        <Button
           bsSize="large"
           bsStyle="warning"
           onClick={onCancelTabClick}>
          Cancel
        </Button>
      </ButtonToolbar>
    </Col>
  </FormGroup>
)

const FriendsList = ({ tab }) => {
  if (tab.created_by_user) {
    return (
      <FormGroup>
        <ul>
          <li key="me">
            Me
          </li>
          {/* FIXME: this should use address */}
          {tab.friends.filter((u) => u.user_name !== tab.user_name).map(function(friend, index) {
            return (
              <li key={index}>

                <Field name={`selected_users[${friend.address}]`} component={FieldCheckbox}>
                  {friend.user_name} ({friend.sender ? 'PAY' : 'RECEIVE'}) {friend.creator ? '(CREATOR)' : ''}
                </Field>

              </li>
            )
          })}
      </ul>
        </FormGroup>
    )
  } else {
    return (
      <ul>
        <li key="me">Me</li>
        {/* FIXME: this should use address */}
        {tab.friends.filter((u) => u.user_name !== tab.user_name).map(function(friend, index) {
          return <li key={index}>{friend.user_name} ({friend.sender ? 'PAY' : 'RECEIVE'}) {friend.creator ? '(CREATOR)' : ''}</li>
        })}
      </ul>
    )
  }
}

class Waiting extends Component {

  render() {
    const { tab, onCancelTabClick, onFinalizeTabClick, handleSubmit } = this.props
    const nwaiting = tab.npeople - tab.friends.length
    const share = tab.total / tab.npeople
    const nselect = tab.npeople - 1
    var disabled = true
    var people = 'people'
    var other_people = 'people'
    let buttons = null
    let my_share = null
    let friends_text = null

    if (nwaiting === 1) {
      people = 'person'
    } else if (nwaiting === 0) {
      // FIXME: this will depend on user selection
      disabled = false
    }
    if (nselect === 1) {
      other_people = 'person'
    }
    if (tab.user_is_sender) {
      my_share = <p>Your share is ${share}</p>
    }
    if (tab.created_by_user) {
      friends_text = `As your friends join, you'll see them below. Wait for the ${nselect} other ${other_people} and click "Finalize" to make it happen.`
      buttons = (
        <WaitingButtons
           disabled={disabled}
           onFinalizeTabClick={onFinalizeTabClick}
           onCancelTabClick={onCancelTabClick}
           handleSubmit={handleSubmit} />
      )
    } else {
      friends_text = `As your friends join, you'll see them below. The balances will be settled once the creator finalizes the tab.`
    }
    
    const friends_list = <FriendsList tab={tab}/>

    return (
      <Well>
        <Form horizontal>
          <fieldset>
            <legend>Waiting for friends</legend>
            <FormGroup>
              <Col smOffset={2} sm={10}>
                <p>Hey {tab.user_name}! We're just waiting for your friends. Give them this code so they can join:</p>
                <h2>{tab.shortid}</h2>
                <p>Total: ${tab.total}</p>
                {my_share}
                <p>Waiting for {nwaiting} {people}.</p>
                <p>{friends_text}</p>
                {friends_list}
              </Col>
            </FormGroup>
            {buttons}
          </fieldset>
        </Form>
      </Well>
    )
  }
}

Waiting = reduxForm({
  'form': 'waiting'
})(Waiting)

Waiting.propTypes = {
  onCancelTabClick: PropTypes.func.isRequired,
  onFinalizeTabClick: PropTypes.func.isRequired
}

export default Waiting
