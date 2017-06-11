import React, { Component } from 'react'
import { throttle } from 'throttle-debounce'
import styled from 'styled-components'
import { GridList } from 'material-ui/GridList'
import { Card, CardActions, CardHeader, CardTitle, CardText } from 'material-ui/Card'
import Chip from 'material-ui/Chip'
import Measure from 'react-measure'
import { firebaseConnect } from 'react-redux-firebase'
import FlatButton from 'material-ui/FlatButton'
import { blue300 } from 'material-ui/styles/colors'
import DropDown from './Dropdown'

const Main = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`

const Container = styled.div`
`

const StyledGridList = styled(GridList)`
`

const StyledCard = styled(Card)`
  margin: 20px;
  height: 300px;
`

const StyledCardText = styled(CardText)`
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`

const StyledCardActions = styled(CardActions)`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  padding-top: 15px;
`

@firebaseConnect()
class Explore extends Component {
  state = {
    dimensions: {
      width: -1,
      height: -1
    },
    offset: 0,
    users: [],
    isLoading: false
  }

  constructor(props) {
    super(props)
    this.handleLoadMore = throttle(300, this.handleLoadMore)
  }

  componentDidMount() {
    const usersRef = this.props.firebase.database().ref('users').limitToFirst(50)
    usersRef.on('value', snapshot => {
      this.setState({ users: snapshot.val() })
    })
    document.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = e => {
    const coefficient = 0.7
    const el = e.target.body
    if (!el) return
    if (el.scrollTop > el.scrollHeight * coefficient && !this.state.isLoading) {
      this.setState({ isLoading: true })
      this.handleLoadMore()
    }
  }

  handleLoadMore = () => {
    const { offset, users } = this.state
    const newOffset = offset + 50
    this.setState({ offset: newOffset })
    const usersRef = this.props.firebase.database().ref('users')
    usersRef.orderByChild('id').endAt(newOffset).once('value', snapshot => {
      this.setState({ users: Object.assign(users, snapshot.val()), isLoading: false })
    })
  }

  getColumnsNum = () => {
    const { width } = this.state.dimensions
    if (width <= 600) return 1
    if (width > 600 && width <= 900) return 2
    if (width > 900 && width <= 1300) return 3
    return 4
  }

  render() {
    const { users } = this.state
    return (
      <Main>
        <Container>
          <DropDown />
          <Measure
            margin
            bounds
            onResize={contentRect => {
              this.setState({ dimensions: contentRect.bounds })
            }}
          >
            {({ measureRef }) =>
              <div ref={measureRef}>
                <StyledGridList cellHeight="auto" cols={this.getColumnsNum()}>
                  {users &&
                    Object.keys(users).map(id =>
                      <StyledCard key={id}>
                        <CardHeader
                          title={
                            <Chip backgroundColor={blue300}>
                              {users[id].eth_address && users[id].eth_address.slice(0, 15)}
                            </Chip>
                          }
                          avatar={users[id].photo_url || 'https://api.adorable.io/avatars/285/abott@adorable.png'}
                        />
                        <CardTitle
                          title={`${users[id].first_name} ${users[id].last_name}`}
                          subtitle={`is creating ${users[id].content || users[id].category}`}
                        />
                        <StyledCardText>{users[id].biography}</StyledCardText>
                        <StyledCardActions>
                          <FlatButton primary={true} label="View more" href={`profile/${id}`} />
                          <Chip>{users[id].category}</Chip>
                        </StyledCardActions>
                      </StyledCard>
                    )}
                </StyledGridList>
              </div>}
          </Measure>
        </Container>
      </Main>
    )
  }
}

export default Explore
