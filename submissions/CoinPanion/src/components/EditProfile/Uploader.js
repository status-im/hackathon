import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import FlatButton from 'material-ui/FlatButton'

export default class Uploader extends Component {
  render() {
    let dropzoneRef
    return (
      <div>
        <Dropzone
          ref={node => {
            dropzoneRef = node
          }}
          onDrop={this.props.onDrop}
          style={{ display: 'hidden' }}
        />
        <FlatButton
          label="Change Profile Picture"
          onTouchTap={() => {
            dropzoneRef.open()
          }}
        />
      </div>
    )
  }
}
