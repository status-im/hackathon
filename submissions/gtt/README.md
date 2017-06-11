# Genesis Token Tracker (GTT)

Hackathon Github Issues https://github.com/status-im/hackathon/issues/31

{"whisper-identity": "31-genesis-token-tracker",
 "name":             "#31 Genesis Token Tracker (GTT)",
 "dapp-url":         "http://bit.ly/genesistokentracker",
 "bot-url":          "http://genesis-token-tracker.s3-website-us-west-2.amazonaws.com/bots/welcome.js"}

<img width="50%" src="./gtc.png"></img>

Genesis token tracker(GTT) allows you to keep track of the token allocation of Status Genesis Token (symbol: SGT), an ERC20 token, which will be redeemable for Status Network Tokens (‘SNT’ — also an ERC20 token) when the Network is fully launched.


## Why GTT?

From [Encoding the Status ‘Genesis Block’](https://blog.status.im/encoding-the-status-genesis-block-d73d287a750)


> The value that lies within this Network isn’t money, but in thought and actions of the wonderful people of the Ethereum community, those who have shaped not only Status but who I am as well. They are the ones who truly believe in trustless, permissionless and decentralized systems, and what gives web3 meaning. They’ve done so with lengthy discussions, feedback and critiques, contributing to our development and the development of Ethereum, and even by doing community outreach — all these actions have value. But quantifying it is hard, so we intend to do this with our own subjectivity, and establish a web-of-trust.


SGT tokens are awarded to community members and all its transaction history are recorded into Ethereum  [mainnet](https://etherscan.io/token/0xd248b0d48e44aaf9c49aea0312be7e13a6dc1468)  

The immutable contribution history gives a fair and open competition among would be community members. I really like the idea of Genesis token and hope this sets a great standard which other ICO will follow the same path.

What's missing is a handy app to make their activities more visual and transparent, this is where GTT comes in.

With GTT, users can

- see the leaderboard of high token earning people.
- see where user stands in terms of token balance relative to other people via histogram.
- peek through the transaction history of token earnings as well as how they spend/earn eth.

GTT is probably the only dapp&bott which gives you the real value despite the fact that status.im is currently running under testnet. This is thanks to Status.im team keeping track the same transaction history on [testnet](https://ropsten.etherscan.io/token/0x4bda828f1fe628973c39366263b78b7cd9d6d8fe).

## Demo

- [Video](https://youtu.be/biDJBA1UOUc) = Via status.im bot
- [Site][http://bit.ly/genesistokentracker]

## Supported Environment

- Mist
- Metamask
- Status.im (did only work from my local machine connecting to device)

## Available commands (all of them require an eth address as an argument)

| command     | usage |
|--- | --- |
| leaderboard | list top 10 token earning accounts |
| token_distribution | shows token distribution histogram |
| your_eth | shows your eth balance as a line chart |
| your_tokens | shows your token balance as a line chart |

## FAQ

### Why rendering is so slow?

Because it goes through the contract event every time each user hits. I could add caching layer easily but won't do it during this competition.

### Why rendering eth transaction history is so much quicker than token history

Because I am cheating by hitting etherscan api. Going through block transaction was too slow to be useful.

### Will your dapp work without bot?

It probably work. May not work on Infura/Metamask env because I wrote everything with synchronous call to web3.

### Why Bot and Dapp approach?

I initially tried to do everything via bot but quickly figured many of the features (access to contract events, the avility to write messages asnync using `sendEvent`, persist local variables, etc) were not available by the time I was implementing the feature (some of them were fixed during the competition). Rather than trying to spend the whole week debugging, I decided to take the pragmatic approach of building the core feature (charting functions) via Dapp and use Bot to help users navigate the Dapp.

## Dev guide

### Startup server

```
git clone REPO_URL
cd gtt
npm install
// builds dapps
npm run build
// Make sure you use rospen testnet as some token addresses are hard coded.
geth --testnet ...
// start server
cd docs; python -m SimpleHTTPServer 8003; cd ..
```

### Connect local devices

Only tested on Android device against mac.


```
$ status-dev-cli scan
Searching for connected devices...
Status Android (192.168.xxx.xxx)
$ export DEVICE_IP=192.168.xxx.xxx

$ adb forward tcp:5561 tcp:5561
$ adb reverse tcp:8003 tcp:8003
$ adb reverse tcp:8546 tcp:8546
```

###  add app to status.im

```
$ status-dev-cli add '{"whisper-identity": "GTC",  "name": "Genesis Token Tracker", "bot-url": "http://localhost:8003/bots/welcome.js"}' --ip $DEVICE_IP
```

"
I would really really like to make a dynamic chat bot
but every single feature that would allow some dynamic content seems to be missing, crippled, doesnt work, etc
what's the point of the hackathon this way?
"

## Pull Request

I am ready! This project is made from scratch for the https://hackathon.status.im .
Please take full code in this repo as a judging consideration.

As mentioned on the readme, I wasn't able to connect to the deployed dapp from status.im.
However, I tested in the following environment, and took [the video](https://youtu.be/biDJBA1UOUc) on the device.
Hope this is good enough proof that the dapp and bot is working.
