![Alt text](betbot.png?raw=true "Title")

# Status-Hackathon
## Betbot a bot for betting beer (and such) with friends!

Repo for the status hackathon

### Why we made this app

Bet bot is a decentralised betting app. Where users can create groups with friends and then use this in order to bet on 'trivial' things. The token system we are using is 0 sum, so some people have a negative balance of tokens and some have a positive. when all tokens in the system are added up the amount of tokens is 0. After a bet is settled I could have -5 tokens (the token type can be changed with each group by the user) and my friend could have 5. We could have decided to call our tokens beer tokens, and then someone with negative tokens can give someone with positive tokens -1 tokens and buy them a beer. thus I would have -4 tokens and my friend would have 4. This allows for a friendly way to manage your debts and all your previous bets. It also allows for additional functionallity, with the use case as if I go to a pub and forget my wallet. my friend could buy me some beers and I could give him 1 beer token for each beer he buys me. thus my balance would go to -2 and his would be 2. this would allow easy tracking of debts. All these use cases can be extended to any size group as long.

**Use case one**

(set later)

**Use Case two**

(set later)

### Who are we?

**Jason**
Honours student at UCT. pretty darn cool. (@JasoonS)

**Cary**
3rd year student at UCT. bad at coding (@yepster1)

**Brendan**
awesome venture capitalist guy who helped with design, and pushed the ideas forward.(@chateaux)

others: Victor, Jon Jon and Roy
### Instruction for use

#### notes for building yourself

1. navigate to the correct directory and clone the repo.
```javascript
   git clone https://github.com/JasoonS/Status-Hackathon.git
   cd Status-Hackathon
   ```
2. run npm-install to install dependencies
```javascript
npm install
```
3. run testrpc in a seperate tab
```javascript
testrpc --port 6546
```
4. This assumes that you have a device that you know the IP of as well as you have adb installed
```javascript
adb reverse tcp:8546 tcp:8546
   adb reverse tcp:3000 tcp:3000
   ```
5. switch node
```javascript
status-dev-cli switch-node http://localhost:8546 --ip <DEVICE IP
```  
6. run the commands to build to the device
```javascript
status-dev-cli add --ip <DEVICE IP>
```
7. run npm
```javascript
npm run start
```

#### troubleshooting

1. we noticed that you occasinally need to restart debug mode as well as restart the app.
2. you might need to watch the directory
'''status-dev-cli watch --ip <DEVICE IP>

### Our challenges
- We originally had a lot of trouble with getting status to update after making a change to the code.
  - a fix for our problem would have probably been more together troubleshooting docs (even though people like cryptowanderer did help a lot!)
- Once we got started using the API properly the development was not particularly bad considering it is still in its early stages.
- Solidity was an issue and getting it implemented inside of status. this was fixed after we were told of cool tools such as (browser tool)
- We had never done any large scale projects in ethereum or made an actual dapp more than just a simple token creator so learning all that was also a huge challenge!
