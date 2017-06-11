import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { parse } from 'qs'
import web3 from '../web3'
import { ethRegistrar, deedContract } from '../ensutils'
import moment from 'moment'
import BidForm from './BidForm'

class Check extends Component {
  constructor(){
    super()
    this.state = {
    }
  }
  render() {
    const { location, match } = this.props;
    const query = parse(location.search.substr(1))
    const name = query.domain.split('.')[0]
    const availability = parseInt(ethRegistrar.entries(web3.sha3(name))[0].toString(), 10)
    console.log(ethRegistrar.entries(web3.sha3(query.domain))[0])
    let content = null
    console.log(availability)
    switch (availability) {
      case 0:
        content = <div>
          <div><strong>{name}</strong> is available!</div>
          <Link className="btn btn-primary" to={'/startauction?domain=' + name}>Start auction</Link>
        </div>
        break;
      case 1:
      case 4:
        let owner = deedContract.at(ethRegistrar.entries(web3.sha3(name))[1]).owner();
        let amount = web3.fromWei(ethRegistrar.entries(web3.sha3(name))[4], 'ether');
        let dateEnds = new Date(ethRegistrar.entries(web3.sha3(name))[2].toNumber() * 1000)
        let auctionEnd = moment(dateEnds)
        let revealBegins = moment(dateEnds).subtract(2, 'days')
        let stage
        let revealInfo = null
        let timeLeft
        if(moment().isBefore(revealBegins)){
          stage = 'bid'
          let hours = revealBegins.diff(moment(), 'hours')
          timeLeft = <div><strong>{hours} hours</strong> left until reveal stage starts</div>
        } else if(moment().isAfter(revealBegins)){
          stage = 'reveal'
          let hours = auctionEnd.diff(moment(), 'hours')
          timeLeft = <div><strong>{hours} hours</strong> left unttil auction end</div>
          revealInfo = <div>
            Current winner is: {JSON.stringify(owner)}
            Current winning bid is: {JSON.stringify(amount)}
          </div>
        }

        content = <div>
          <div className="stage section"><strong>{name}</strong> is currently up for auction in the <strong>{stage}</strong> stage</div>
          <div className="timeleft section">{timeLeft}</div>
          <div className="reveal-period section">Reveal begins: {revealBegins.format("dddd, MMMM Do YYYY, h:mm:ss a")}</div>
          <div className="auction-period section">Auction begins: {auctionEnd.format("dddd, MMMM Do YYYY, h:mm:ss a")}</div>
          {revealInfo}
          <BidForm name={name} />
        </div>
        break;
      case 5:
        content = <div>{name} is not available to bid yet!</div>
        break;
      default:
        content = <div>{name} is taken!</div>
        break;
    }
    return <div>
      <div>{content}</div>
    </div>
  }
}

export default Check
