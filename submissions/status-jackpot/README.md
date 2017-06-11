### Status Jackpot
**Type:** DApp
**Github Repo:** https://github.com/yoshikazzz/status-jackpot

**Overview:** 
Decentralized Jackpot machine.  Put any amount into the Jackpot as you want, after certain period of time (certain number of blocks mined), the contract will draw a winner.  The winner will be paid all the amount in the Jackpot.

Youtube: https://youtu.be/D_yPxYByC6E

**Technical Description:**
It uses weighted probability to decide a winner.  More to bet, more chance to get win.

```
blockhash = uint(block.blockhash(block.number-1));
pointer = uint(block.blockhash(block.number-1)) % totalFinney;
uint hwm = 0;
for(uint i=0; i<numStakeholders; i++){
    hwm = hwm + uint(bets[stakeHolders[i]] / 1000000000000000);
    if(hwm > pointer){
        winner = stakeHolders[i];
        break;
    }
}
winner.transfer(this.balance);
```
We used a blockhash of the previous block as a random number seed.  I know it's controversial to use a blockhash for randomness, we probably had better use the "next" block's blockhash, but for the limited time of this challenge, I simply chose this way.  Recently, Oraclize announced the "Random" datasource, and it can be used for more reliability.

**Issues:**
At first, I purely started from DApp alone, based on "truffle-webpack-demo" (https://github.com/ConsenSys/truffle-webpack-demo) which uses truffle and React.  I confirmed the DApp perfectly worked with Chrome + MetaMask environment.

Next, I migrate it to be Status-compatible.  It was kind of a rough road...  Couldn't migrate simply add or rewrite some package.json.  I finally re-write codes from scratch, based on "truffle-box-status", with some copy-n-paste from the previous code.

It finally works, but had some difficulty during debugging it, due to unstable connection between my Genymotion emulator to the testrpc network.  It often reset the connection, and I don't know why the deployed contract is randomly destroyed sometimes 🤕 

**Quickstart:**
1. run testrpc (https://github.com/ethereumjs/testrpc)
2. npm install
2. truffle compile
3. truffle migrate
4. npm run start

**Team Members:**
Preferred Name: Yoshi
Github Handle: @yoshikazzz
Slack Username: @yoshikazzz

