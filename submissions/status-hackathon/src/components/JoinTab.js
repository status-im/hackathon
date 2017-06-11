import React, { PropTypes, Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Alert, Button, ButtonToolbar, Col, Form, FormGroup, ControlLabel, HelpBlock, Well } from 'react-bootstrap';
import { FieldInput } from './Form'

class JoinTab extends Component {
  render() {
    const { tab, onFindTabClick, onCancelJoinTabClick, handleSubmit } = this.props
    var alert, validationState
    
    if (tab.error) {
      alert = (<Alert bsStyle="warning">{tab.error}</Alert>)
      validationState = 'warning'
    }
    return (
      <div>
        {alert}
      <Well>
        <Form horizontal onSubmit={handleSubmit(onFindTabClick)}>
          <fieldset>
            <legend>Join a friend's tab</legend>
            <FormGroup
               controlId="inputCode"
               validationState={validationState}>
              <Col componentClass={ControlLabel} sm={2}>Code</Col>
              <Col sm={10}>
                <Field
                   name="shortid"
                   component={FieldInput}
                   type="text"
                   placeholder="The unique tab code" />
                <HelpBlock>When a tab is created, a unique code is generated so that everyone can join. The person who created the tab will share this code with you.</HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={2} sm={10}>
                <ButtonToolbar>
                  <Button bsSize="large" bsStyle="primary" type="submit">
                    Find
                  </Button>
                  <Button bsSize="large" bsStyle="default" onClick={onCancelJoinTabClick}>
                    Cancel
                  </Button>
                </ButtonToolbar>
              </Col>
            </FormGroup>
          </fieldset>
        </Form>
      </Well>
      </div>
    )
  }
}

JoinTab.propTypes = {
  onFindTabClick: PropTypes.func.isRequired,
  onCancelJoinTabClick: PropTypes.func.isRequired  
}

JoinTab = reduxForm({
  form: 'join_tab'
})(JoinTab)

export default JoinTab
