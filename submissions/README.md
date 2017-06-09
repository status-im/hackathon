# Description
DTS (Decentralized Tutoring System) or MyTutor is a decentralized app (dapp) that brings teachers/tutors and students closer without any intermediaries.

I built this app to help my girlfriend who works as a tutor and always find hard to get new students (she has to work with companies/intermediaries that take huge fees on each course), it's also hard communicate with students, manage the agenda, chase up for the payment, etc. That's why comes MyTutor

The dapp is sort of assistant that allows teacher to publish an ad, the student can look over the ads and start chatting with a teacher, after Q&A and agreeing a date, time and a price, the teacher can setup a course.
The student has to make a payment into the contract before the course starts.
Once the course is finished, the teacher can either release the payment to his account or refund (if cancelled for example).


# Technologies
This application is built with:
- Truffle 3.1
- Angular 2
- Ionic 2


# About me
Software enginneer passionated into decentralisation, I tried to manage a few hours every nights to achieve this hackaton. It is a very strainghtforward use case but the aim was to illustrate how to disrupt and modernize a business case such as private tutoring.



# Requirements
The following tools has been use to developp this project:

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
Procedure to run this project:

## Download the code & go to the folder
```
git clone https://github.com/gjeanmart/hackathon.git

cd hackathon/submissions/dts/
```


## Install
```
npm install
```


## Run Geth or testrpc

```
geth --fast --cache=1048 --testnet --unlock "0x................." --rpc --rpcapi "eth,net,web3" --rpccorsdomain '*' --rpcaddr 0.0.0.0 --rpcport 8545
```


## Deploy the contracts
```
truffle migrate --compile-all --reset --network ropsten ; cp -R ./build/contracts/ ./www/
```


## Configure your RPC URL endpoint
in environment.ts, change `rpcurl: "http://x.x.x.x:8545"` by your node RPC URL


## Deploy the Mobile app
```
ionic serve
```


## Deploy the app in Status
```
status-dev-cli add "{\"whisper-identity\": \"dts\", \"dapp-url\": \"http://x.x.x.x:8100\", \"name\": \"MyTutor\"}" --ip <DEVICE IP>
```


# Demo
You can test the dapp using Mist browser or GoogleChrome with Metamask : http://130.211.50.165:8100


# Video
The following demo illustrates a teacher and student using MyTutor system through the Status mobile app.
https://www.youtube.com/watch?v=OC8UeMsWDKs(some parts has been cut)


# Improvements & Ideas
*Dapp*
- Start chatting with a teacher directly from the dapp
- Specific design

*Chatbot*
- Use a chatbot to remind the next course 
- Use a chatbot to propose interractives exercices/homeworks


# Feedback

- Dapp integration: 
Great, easy to use. A working Mobile Ethereum gateway. The main Mobile frameworks (Ionic & ReactNative) are compatible and can be  easily integrated with tools like Truffle and Web3.
I noticed some recurrent error [http://imgur.com/a/OGZUD]

- status-dev-cli watch doesn't work [https://github.com/status-im/status-dev-cli/issues/11]

- Chatbot: hard to understand the API and to use with web3 without Promise
I tried to make a chabot linked to this dapp but it was too short time to make something working. My general impression is an outline 




