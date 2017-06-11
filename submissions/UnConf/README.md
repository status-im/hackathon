# DApp and bot for Status.im

Hackathon GitHub Issue: https://github.com/status-im/hackathon/issues/17

```
{
  "whisper-identity": "17-unconf-decentralized-unconference-planner",
  "name":             "#17 Unconf - Decentralized Unconference Planner",
  "dapp-url":         "https://blockchainlabsnz.github.io/Unconf-DApp/index.html",
  "bot-url":          "https://blockchainlabsnz.github.io/Unconf-DApp/bot/bot.js"
}
```

## Unconf-DApp
Decentralized Unconference Planner

### Description:
A way to gather a community to plan an Unconference with a few smart contracts providing a lightweight governance model.

**Why:**
1. Because the Unconference format aligns very well with the decentralized Blockchain philosophy.
2. Because Status.im enables the group chat collaboration and location discovery to bring this DApp to life
3. Because BlockchainLabs.nz and Blockchain.org.nz are planning a Blockchain Unconference later this year ;)

_This DApp is being submitted to the Status.im Hackathon_ https://hackathon.status.im/

**What:**
At a minimum someone should be able to create an Unconference event with a location & date for it to be discoverable in Status.im. People should be able to register (free or paid) and be added to a group chat for collaboration. People should be able to suggest topics they would like to share, and then let others upvote the suggestions.

It would be nice to have the ability for suggestions to be merged and allotted to days/times once the unconference has started. People who upvoted a particular suggestion could be messaged by the bot when the session is starting.

### What we built
In the 7 days of the hackathon, we were pleased to be pushing the limits of what was possible with Status. Some of the features that could be implemented in Status are:
* Creation of unconference events (using a factory) to be a placeholder for people to register and get involved
* Registrations were essential, however we didn't implement any registration fees just yet, so the user only pays gas
* People that are registered can propose topics for the event
* And last but not least, voting is implemented so the topics with the most upvotes can be the focus of the unconference on the day

### What we couldn't build
As can be expected with the Status APIs being in alpha, there were a bunch of things we couldn't do _yet_, including:

* UnConf bot can't create group chats nor add people to group chats to collaborate on an unconference, so we are missing the core social element of this project
* The only way we could find to make something appear in the 'Discover' tab was to post a status including hashtags, so we planned to post a status for each unconference event to make them discoverable, however the Status API doesn't allow bots to set their status. In the future we would hope that a specific API function would exist to make events/places discoverable.
* QR codes are a great way to bridge the physical world (posters, stickers, etc) with the blockchain world, so we would love to generate QR codes for the user when they create an unconference.
