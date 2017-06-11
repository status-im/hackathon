import React, { Component } from 'react'
import styled from 'styled-components'
import TextField from 'material-ui/TextField'
import Avatar from 'material-ui/Avatar'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'
import { connect } from 'react-redux'
import { firebase, helpers } from 'react-redux-firebase'
import Paper from 'material-ui/Paper'
import Uploader from './Uploader'
import CategoryDropdown from './CategoryDropdown'

const { dataToJS } = helpers

// Path within Database for metadata (also used for file Storage path)
const filesPath = 'uploadedFiles'

const Main = styled.div`
  display: flex;
  flexWrap: wrap;
  justify-content: space-around;
`

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 10px 10px 10px 10px;
`

const StyledPaper = styled(Paper)`
  margin: 25px 0;
`

const StyledRaisedButton = styled(RaisedButton)`
  margin: 10px;
`

class EditProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      category: 'None',
      content: '',
      biography: '',
      eth_address: '',
      photo_url: '',
      id: '',
      openSnackbar: false,
      snackbarMessage: '',
      pristine: true
    }
  }

  handleSave = event => {
    const myAddress = this.state.eth_address
    const userProfile = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      category: this.state.category,
      eth_address: myAddress // get address from app state so there is no danger of being manipulated from front-end
    }
    if (this.state.id) {
      userProfile.id = this.state.id
    }
    if (this.state.photo_url) {
      userProfile.photo_url = this.state.photo_url
    }
    if (this.state.biography) {
      userProfile.biography = this.state.biography
    }
    if (this.state.content) {
      userProfile.content = this.state.content
    }
    // required fields
    if (this.state.first_name && this.state.last_name && this.state.email && myAddress) {
      if (this.state.id) {
        // update profile
        this.props.firebase.set(`/users/${this.state.id}`, userProfile).then((success, error) => {
          if (error) {
            console.error(error)
            this.setState({ openSnackbar: true, snackbarMessage: 'Error: Profile not created' })
          } else {
            this.setState({ openSnackbar: true, snackbarMessage: 'Profile updated' })
          }
        })
      } else {
        // create new profile
        this.props.firebase
          .push('users', userProfile)
          .then((snap, error) => {
            console.log(snap)
            // add id as key
            this.props.firebase.update(`users/${snap.key}`, { id: snap.key })
          })
          .then((success, error) => {
            if (error) {
              console.error(error)
              this.setState({ openSnackbar: true, snackbarMessage: 'Error: Profile not updated' })
            } else {
              this.setState({ openSnackbar: true, snackbarMessage: 'Profile updated' })
            }
          })
      }
    }
  }

  handleCategoryChange = (event, index, value) => {
    this.setState({ category: value })
  }

  handleFieldChange = (stateKey, event, newValue) => {
    const obj = {}
    obj[stateKey] = newValue // so key can be programatically assigned
    obj.pristine = false
    this.setState(obj)
  }

  onFilesDrop = files => {
    // Uploads files and push's objects containing metadata to database at dbPath
    // uploadFiles(storagePath, files, dbPath)
    this.props.firebase.uploadFiles(filesPath, files, filesPath).then((resolve, reject) => {
      if (reject) {
        console.error(reject)
        this.setState({ openSnackbar: true, snackbarMessage: 'Error: Photo not uploaded' })
      } else {
        console.log(resolve)
        const photoURL = resolve[0].File.downloadURL
        this.setState({ photo_url: photoURL })
        console.log(this.state)
      }
    })
  }

  handleRequestClose = event => {
    this.setState({ openSnackbar: false })
  }

  componentWillReceiveProps(nextProps) {
    const { user, userAddress } = nextProps
    this.setState({ ...user, eth_address: userAddress })
  }

  render() {
    const {
      first_name,
      photo_url,
      last_name,
      category,
      content,
      email,
      biography,
      openSnackbar,
      snackbarMessage,
      pristine,
      eth_address
    } = this.state

    return (
      <Main>
        <StyledPaper>
          <FormContainer>
            <Avatar src={photo_url} size={150} />
            <Uploader onDrop={this.onFilesDrop} />
            <TextField disabled={true} value={eth_address} floatingLabelText="ETH address" />
            <TextField
              floatingLabelText="First Name"
              onChange={(event, newValue) => this.handleFieldChange('first_name', event, newValue)}
              errorText={!first_name && !pristine ? 'First Name is Required' : null}
              value={first_name || ''}
            />
            <TextField
              floatingLabelText="Last Name"
              onChange={(event, newValue) => this.handleFieldChange('last_name', event, newValue)}
              errorText={!last_name && !pristine ? 'Last Name is Required' : null}
              value={last_name || ''}
            />
            <TextField
              floatingLabelText="Email Address"
              onChange={(event, newValue) => this.handleFieldChange('email', event, newValue)}
              errorText={!email && !pristine ? 'Email Address is Required' : null}
              value={email || ''}
            />
            <CategoryDropdown onChange={this.handleCategoryChange} value={category} />
            <TextField
              floatingLabelText="Biography"
              onChange={(event, newValue) => this.handleFieldChange('biography', event, newValue)}
              value={biography || ''}
            />
            <TextField
              floatingLabelText="Content I'm Creating"
              onChange={(event, newValue) => this.handleFieldChange('content', event, newValue)}
              value={content || ''}
            />
            <StyledRaisedButton label="Save Profile" primary={true} onTouchTap={this.handleSave} />
            <Snackbar
              open={openSnackbar}
              message={snackbarMessage}
              autoHideDuration={4000}
              onRequestClose={this.handleRequestClose}
            />
          </FormContainer>
        </StyledPaper>
      </Main>
    )
  }
}

EditProfile.defaultProps = {
  userProfile: {}
}

const fbWrappedComponent = firebase(['uploadedFiles'])(EditProfile)
export default connect(({ firebase }) => ({
  uploadedFiles: dataToJS(firebase, 'uploadedFiles')
}))(fbWrappedComponent)
