import React, { PropTypes } from 'react'
import { Button } from 'react-bootstrap';

const Home = ({ onNewTabClick, onJoinTabClick }) => (
  <div>
    <h1>Split The Tab!</h1>
    <p>You can use this app to split your meal or drink tab with friends.</p>
    <h2>Get Started</h2>
    <Button bsSize="large" bsStyle="primary" block onClick={onNewTabClick}>
      New Tab
    </Button>
    <Button bsSize="large" bsStyle="default" block onClick={onJoinTabClick}>
      Join Tab
    </Button>
  </div>
)

Home.propTypes = {
  onNewTabClick: PropTypes.func.isRequired,
  onJoinTabClick: PropTypes.func.isRequired  
}

export default Home
