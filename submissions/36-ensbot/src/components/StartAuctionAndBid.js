import React from 'react'
import { parse } from 'qs'

const StartAuctionAndBid = ({ location, match }) => {
  const query = parse(location.search.substr(1))
  return <div>
    Started auction and bid for {query.domain} for {query.bidAmount} with the secret {query.secret}
  </div>
}

export default StartAuctionAndBid
