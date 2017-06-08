# Description
DTS (Decentralized Tutoring System) or MyTutor is a decentralized app (dapp) that bring teachers/tutors and students closer.

I built this app to help my wife who works as a tutor and always find hard to get new students (she has to work with companies that take huge fees on each course), it's also hard communicate with students, manage the agenda, chase up for the payment, etc.
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

**testrpc** `npm install -g ethereumjs-testrpc`

**truffle** `npm install -g truffle`

**status-dev-cli** `npm install -g status-dev-cli`

**status-dev-cli** `npm install -g ionic`


# Installation

## Download the code & go to the folder
`git clone https://github.com/gjeanmart/hackathon.git`

cd hackathon/submissions/dts/


## Install
npm install



## Run testrpc
testrpc --account="0x0f9c44961bba06b146bd6a652ecbf944dcb6c06b74b7e3997b0cc38d25e53ae5,10000000000000000000000" --account="0x0dfbc1dab22266e31be842632448179cf7ebce1b97a989c23545c4c16488971f,10000000000000000000000" --secure -u 0 -u 1 --hostname 0.0.0.0 --port 8546 &


## Deploy the contracts
truffle migrate --compile-all --reset --network development ; cp -R ./build/contracts/ ./www/contracts/


## Configure your RPC URL endpoint
in environment.ts, change `rpcurl: "http://130.211.50.165:8545"`


## Deplot the Mobile app
ionic serve


## Deploy the app in Statis
status-dev-cli add "{\"whisper-identity\": \"dts-app\", \"dapp-url\": \"http://130.211.50.165:8100\", \"name\": \"MyTutor\"}" --ip <DEVICE IP>