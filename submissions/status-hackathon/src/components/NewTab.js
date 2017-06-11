import React, { Component, PropTypes } from 'react'
import { Button, ButtonToolbar, Col, Form, FormGroup, ControlLabel, HelpBlock, InputGroup, Well } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form'
import { PaymentOptions} from '../actions'
import { FieldInput, FieldSelect } from './Form'

class NewTab extends Component {
  render() {
    let { onCreateTabClick, onCancelTabClick, handleSubmit } = this.props
    let payment_options = [
      {value: PaymentOptions.SPLIT_EVENLY, name: 'Split evenly'},
      {value: PaymentOptions.CREDIT_CARD_ROULETTE, name: 'Credit card roulette', disabled: true},
      {value: PaymentOptions.FREE_MEAL_ROULETTE, name: 'Free meal roulette', disabled: true}
    ]
    
    return (
      <Well>
        <Form horizontal onSubmit={handleSubmit(onCreateTabClick)}>
          <fieldset>
            <legend>Split a new tab</legend>
            <FormGroup
               controlId="inputName">
              <Col componentClass={ControlLabel} sm={2}>Tab Name</Col>
              <Col sm={10}>
                <Field
                   name="name"
                   component={FieldInput}
                   type="text"
                   placeholder="This is the name your friends see" />
              </Col>
            </FormGroup>
            <FormGroup
               controlId="inputTotal">
              <Col componentClass={ControlLabel} sm={2}>Total</Col>
              <Col sm={10}>
                <InputGroup>
                  <InputGroup.Addon>$</InputGroup.Addon>
                  <Field
                     name="total"
                     component={FieldInput}
                     type="number"
                     placeholder="Total on the bill"
                     min="0"
                     step="0.01"/>
                </InputGroup>
              </Col>
            </FormGroup>
            <FormGroup
               controlId="inputPeople">
              <Col componentClass={ControlLabel} sm={2}>Number of People</Col>
              <Col sm={10}>
                <Field
                   name="npeople"
                   component={FieldInput}
                   type="number"
                   placeholder="Number of people in your group"
                   min="2"/>
              </Col>
            </FormGroup>
            <FormGroup
               controlId="inputPaymentOption">
              <Col componentClass={ControlLabel} sm={2}>Payment Option</Col>
              <Col sm={10}>
                <Field
                   name="payment_option"
                   options={payment_options}
                   component={FieldSelect}/>
                <HelpBlock>In the future, you will have a few different options here. E.g. with Free Meal Roulette, one lucky person, chosen at random, will get their meal free! Right now, Split Evenly is the only choice.</HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={2} sm={10}>
                <ButtonToolbar>
                  <Button
                     bsSize="large"
                     bsStyle="primary"
                     type="submit">
                    Create
                  </Button>
                  <Button
                     bsSize="large"
                     bsStyle="default"
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

NewTab.propTypes = {
  onCreateTabClick: PropTypes.func.isRequired,
  onCancelTabClick: PropTypes.func.isRequired
}

NewTab = reduxForm({
  'form': 'new_tab',
  initialValues: {
    payment_option: PaymentOptions.SPLIT_EVENLY
  }
})(NewTab)

export default NewTab
