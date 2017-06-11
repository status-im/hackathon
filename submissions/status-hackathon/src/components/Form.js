import React, { Component } from 'react'
import { Checkbox, FormControl, Radio } from 'react-bootstrap';

export const FieldInput = ({ input, meta, type, placeholder, min, max, step }) => {
  return (
    <FormControl
       type={type}
       placeholder={placeholder}
       min={min}
       max={max}
       value={input.value}
       step={step}
       onChange={input.onChange} />
  )
}

export const FieldRadio = ({ input, meta, inline, children }) => {
  return (
    <Radio
       name={input.name}
       checked={input.checked}
       value={input.value}
       onChange={input.onChange}
       onBlur={input.onBlur}>
      {children}
    </Radio>
  )
}

export const FieldCheckbox = ({ input, meta, inline, children }) => {
  return (
    <Checkbox
       name={input.name}
       checked={input.checked}
       value={input.value}
       onChange={input.onChange}
       onBlur={input.onBlur}>
      {children}
    </Checkbox>
  )
}

export class FieldSelect extends Component {
  renderSelectOptions = (option) => (
    <option key={option.value} value={option.value} disabled={option.disabled}>{option.name}</option>
  )
  
  render() {
    let { input, options } = this.props

    // TODO: onChange, onBlur do not work
    // FIXME: need to set a default value
    return (
      <FormControl
         componentClass="select"
         value={input.value}
         onChange={input.onChange}
         onBlur={input.onBlur}>
        {options.map(this.renderSelectOptions)}
      </FormControl>
    )
  }
}
