# Description
DTS (Decentralized Tutoring System) or MyTutor is a decentralized app (dapp) that brings teachers/tutors and students closer witjout any intermediaries.

I built this app to help my wife who works as a tutor and always find hard to get new students (she has to work with companies/intermediaries that take huge fees on each course), it's also hard communicate with students, manage the agenda, chase up for the payment, etc.
That's why comes MyTutor

The dapp is sort of assistant that allows teacher to publish an announce, the student can go through the ads and start chatting with a teacher (feature not available), after Q&A and agreeing a date, time and a price, the teacher can setup a course.
The student has to make a payment into the contract before the course.
Once the course is finished, the teacher ca either release the payment to his account or refund (if cancelled for example).
A chabot


# Technologies
This application is built with:
- Truffle 3.1
- Angular 2
- Ionic 2


# Requirements

**nodeJS**

**geth**

**testrpc** 
`npm install -g ethereumjs-testrpc`

**truffle** 
`npm install -g truffle`

**status-dev-cli** 
`npm install -g status-dev-cli`

**status-dev-cli** 
`npm install -g ionic`


# Installation

## Download the code & go to the folder
```
git clone https://github.com/gjeanmart/hackathon.git

cd hackathon/submissions/dts/
```


## Install
`npm install`


## Run Geth or testrpc
`geth --fast --cache=1048 --testnet --unlock "0x................." --rpc --rpcapi "eth,net,web3" --rpccorsdomain '*' --rpcaddr 0.0.0.0 --rpcport 8545`


## Deploy the contracts
`truffle migrate --compile-all --reset --network ropsten ; cp -R ./build/contracts/ ./www/`


## Configure your RPC URL endpoint
in environment.ts, change `rpcurl: "http://x.x.x.x:8545"` by your node RPC URL


## Deploy the Mobile app
`ionic serve`


## Deploy the app in Status
`status-dev-cli add "{\"whisper-identity\": \"dts\", \"dapp-url\": \"http://x.x.x.x:8100\", \"name\": \"MyTutor\"}" --ip <DEVICE IP>`


# Demo
You can test the dapp using Mist browser or GoogleChrome with Metamask : http://130.211.50.165:8100


# Video
The following demo demonstrates a teacher and student using MyTutor system through the Status mobile app.
<link>


# Improvments & Ideas
*Dapp*
- Start chatting with a teacher directly from the dapp

*Chatbot*
- Use a chatbot to remind the next course and access quickly to your course page in order to pay for example
- Use a chatbot to propose interractives exercices/homework


# Feedback
- Dapp integration: Great, easy to use,
- status-dev-cli watch doesn't work [link]
- Chatbot: hard to understand the API and to use with web3 without Promise




