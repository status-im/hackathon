import React from 'react'
import { List, ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import { grey400, darkBlack } from 'material-ui/styles/colors'

const iconButtonElement = (
  <IconButton touch={true}>
    <MoreVertIcon color={grey400} />
  </IconButton>
)

const rightIconMenu = (
  <IconMenu iconButtonElement={iconButtonElement}>
    <MenuItem>Send Mail</MenuItem>
    <MenuItem>Tweet</MenuItem>
    <MenuItem>Remove Coiner</MenuItem>
  </IconMenu>
)

export default class CoinedList extends React.Component {
  state = {
    open: false
  }

  handleToggle = () => {
    this.setState({
      open: !this.state.open
    })
  }

  handleNestedListToggle = item => {
    this.setState({
      open: item.state.open
    })
  }

  render() {
    const { coinedBy, coinedByMe } = this.props
    return (
      <div>
        <List style={{ minWidth: 250 }}>
          <ListItem
            primaryText={`Coined by ${coinedBy.length} People`}
            initiallyOpen={false}
            primaryTogglesNestedList={true}
            nestedItems={coinedBy.map((coining, index) =>
              <ListItem key={`div1${index}`} disabled={true} style={{ marginLeft: -18, padding: -16 }}>
                <ListItem
                  key={`${coining.id}-1`}
                  leftAvatar={<Avatar src={coining.photo_url} />}
                  rightIconButton={rightIconMenu}
                  primaryText={`${coining.first_name} ${coining.last_name}`}
                  secondaryText={
                    <p>
                      <span style={{ color: darkBlack }}>{coining.email}</span><br />
                      Supports you for {coining.coining.eth_amount} WEI per month.
                    </p>
                  }
                  secondaryTextLines={2}
                />
                <Divider key={`Divider1${index}`} inset={true} />
              </ListItem>
            )}
          />
          <ListItem
            primaryText={`Coined ${coinedByMe.length} People`}
            initiallyOpen={false}
            primaryTogglesNestedList={true}
            nestedItems={coinedByMe.map((coining, index) =>
              <ListItem key={`div2${index}`} disabled={true} style={{ marginLeft: -18, padding: -16 }}>
                <ListItem
                  key={`${coining.id}-2`}
                  leftAvatar={<Avatar src={coining.photo_url} />}
                  rightIconButton={rightIconMenu}
                  primaryText={`${coining.first_name} ${coining.last_name}`}
                  secondaryText={
                    <p>
                      <span style={{ color: darkBlack }}>{coining.email}</span><br />
                      You are supporting for {coining.coining.eth_amount} ETH per month.
                    </p>
                  }
                  secondaryTextLines={2}
                />
                <Divider key={`Divider2${index}`} inset={true} />
              </ListItem>
            )}
          />
        </List>
      </div>
    )
  }
}
