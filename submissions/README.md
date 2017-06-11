# MyTytor / DTS (Decentralized Tutoring System)

Settings:
```
{
    "whisper-identity": "35-dts",
    "name":             "#35 MyTutor",
    "dapp-url":         "http://130.211.50.165:8100"
}
 ```


## Description
DTS (Decentralized Tutoring System) or MyTutor is a decentralized app (dapp) that brings teachers/tutors and students closer without any intermediaries.

I built this app to help my girlfriend who works as a tutor and always find hard to get new students (she has to work with companies/intermediaries that take huge fees on each course), it's also hard communicate with students, manage the agenda, chase up for the payment, etc. That's why comes MyTutor

The dapp is sort of assistant that allows teacher to publish an ad, the student can look over the ads and start chatting with a teacher, after Q&A and agreeing a date, time and a price, the teacher can setup a course.
The student has to make a payment into the contract before the course starts.
Once the course is finished, the teacher can either release the payment to his account or refund (if cancelled for example).


## About me
Software engineer passionate into decentralization and especially Ethereum. I tried to manage a few hours every nights to achieve this hackaton. It is a very straightforward use case but the aim was to illustrate how to disrupt and modernize a business case such as private tutoring.


## Technologies & Architecture 
The dapp follows the following architecture:
<Diagram>

The backend contains three main contracts:
- AdsRegistry: Registry for all Ads 
- CourseRegistry: Registry for all courses. Contains a pointer to Course
- Course: each course are a stored as a separated contract 
The technologies and frameworks used are Solidity and Truffle 3.1


The frontend is a mobile webapp with:
- login page: sign-in as a student or a teacher (ability to create an ad and a course) 
- landing page: displays your Ethereum address and balance 
- ads: show the list of ads
- ads-view: view the details of an ad
- ads-add: Ad form to publish an ad
- course: view all my current courses (created or paid) 
- course-view: view the details of a course and pay (student) or release/refund (teacher) 
- course-add: form to register a course 
- course-history: view all my ended courses (ended, refunded or canceled) 

The technologies and frameworks are JavaScript/Typescript, Ionic2 and Angular2





## Requirements
The following tools has been use to develop this project:

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


## Installation
Procedure to run this project:

### Download the code & go to the folder
```
git clone https://github.com/gjeanmart/hackathon.git

cd hackathon/submissions/dts/
```


### Install
```
npm install
```


### Run Geth or testrpc

```
geth --fast --cache=1048 --testnet --unlock "0x................." --rpc --rpcapi "eth,net,web3" --rpccorsdomain '*' --rpcaddr 0.0.0.0 --rpcport 8545
```


### Deploy the contracts
```
truffle migrate --compile-all --reset --network ropsten ; cp -R ./build/contracts/ ./www/
```


### Configure your RPC URL endpoint
in environment.ts, change `rpcurl: "http://x.x.x.x:8545"` by your node RPC URL


### Deploy the Mobile app
```
ionic serve
```


### Deploy the app in Status
```
status-dev-cli add "{\"whisper-identity\": \"dts\", \"dapp-url\": \"http://x.x.x.x:8100\", \"name\": \"MyTutor\"}" --ip <DEVICE IP>
```


## Demo
You can test the dapp using Mist browser or GoogleChrome with Metamask : http://130.211.50.165:8100


## Video
The following demo illustrates a teacher and student using MyTutor system through the Status mobile app
https://www.youtube.com/watch?v=OC8UeMsWDKs (some parts has been cut)


## Improvements & Ideas
This projecr is a prototype so obviously many things can be improved and implemented. For example:

*Dapp*
- Start chatting with a teacher directly from the dapp 
- Store more relevant information 
- Specific design
- functions to cancel/update a course, unregister or update an ad
- form validation 

*Chatbot*
- Use a chatbot to remind the next course 
- Use a chatbot to propose interactive exercises/homework


## Feedback

### Dapp integration: 
Great, easy to use. A working Mobile Ethereum gateway. The main Mobile frameworks (Ionic & ReactNative) are compatible and can be  easily integrated with tools like Truffle and Web3. That's an important step forward for public adoption. 
I've noticed some recurrent error [http://imgur.com/a/OGZUD]

### Tools
Do the job. 
- status-dev-cli watch doesn't work [https://github.com/status-im/status-dev-cli/issues/11]

### Chatbot: 
The first intention was to build a dapp and a chat bit but unfortunately I run out of time. Even it's the idea of a chat API is really great, this particular API is currently hard to understand tand no really documented. 
I would like to see in this api:
- Ability to add a contact and start a chat with one or multiple person/robot 
- Use of promise, requirejs to facilitate the integration with dapp

### Status app
Except a few instabilities sometimes, the app is clear and easy to use. 


