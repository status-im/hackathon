import React, { PropTypes, Component } from 'react'
import { Button, ButtonToolbar, Col, ControlLabel, Form, FormGroup, Well } from 'react-bootstrap'
import { Field, reduxForm } from 'redux-form'
import { FieldInput } from './Form'
import { generate as generateName } from 'project-name-generator'

// TODO: add cancel

class ConfirmTab extends Component {
  render() {
    const { tab, onSubmit, onCancelTabClick, handleSubmit } = this.props
    const share = tab.total / tab.npeople
    var title

    if (tab.created_by_user) {
      title = 'Continue creating tab'
    } else {
      title = "Join a friend's tab"
    }
    return (
    <Well>
      <Form horizontal>
        <fieldset>
          <legend>{title}</legend>
          <FormGroup>
            <Col smOffset={2} sm={10}>
              <p>Almost there! We just need to know whether you are paying your share of the tab here or in person. If you are paying here, we'll ask you to confirm a transaction. Otherwise, you'll receive the balance.</p>
              <p>Total: ${tab.total}</p>
              <p>If you are paying, your share is ${share}</p>
              <p>Give your friends this code so they can join:</p>
              <h2>{tab.shortid}</h2>
            </Col>
          </FormGroup>
          <FormGroup
             controlId="inputName">
            <Col componentClass={ControlLabel} sm={2}>Your Name</Col>
            <Col sm={10}>
              <Field
                 name="user_name"
                 component={FieldInput}
                 defaultValue={tab.user_name}
                 type="text"
                 placeholder="This is the name your friends see" />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col smOffset={2} sm={10}>
              <ButtonToolbar>
                <Button
                   bsSize="large"
                   block
                   bsStyle="primary"
                   onClick={handleSubmit(values => onSubmit({
                     ...values,
                     button: 'payFriends'
                   }))}>
                  Pay Friends
                </Button>
                <Button
                   bsSize="large"
                   block
                   bsStyle="default"
                   onClick={handleSubmit(values => onSubmit({
                     ...values,
                     button: 'payInPerson'
                   }))}>
                  I'm Paying In Person
                </Button>
                <Button
                   bsSize="large"
                   block
                   bsStyle="warning"
                   onClick={onCancelTabClick}>
                  Cancel
                </Button>
              </ButtonToolbar>
            </Col>
          </FormGroup>
        </fieldset>
      </Form>
    </Well>
    )
  }
}

ConfirmTab = reduxForm({
  'form': 'confirm_tab',
  initialValues: {
    user_name: generateName({alliterative: true}).spaced
  }
})(ConfirmTab)

// TODO: tab proptype
ConfirmTab.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancelTabClick: PropTypes.func.isRequired
}

export default ConfirmTab
