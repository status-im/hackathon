# CoinPanion - DApp for Status.im

Submission: https://github.com/status-im/hackathon/issues/20

```
{
    "whisper-identity": "20-coinpanion",
    "name": "#20 CoinPanion",
    "dapp-url": "http://coinpanion.surge.sh/"
}
```



# Description

CoinPanion is the ultimate blockchain subscription solution. The idea is that any user can go to CoinPanion, then they can choose to subscribe to any other CoinPanion user's Ethereum Address with a payment of X ETH per Y days/weeks/months.

CoinPanion users will have rich profiles which will tell potential coiners about themselves and what they create, work on, or are interested in. Coiners can "coin" friends, family members, or content creators whose work they want to support. With category-based discovery features, search, and a user dashboard CoinPanion is the best and easiest to use blockchain subscription service.

# Forward
This project was started as a submission to the Status.IM Hackathon.
https://github.com/status-im/hackathon/issues/20

# How it works

Simple put: Any `CoinPanion` can subscribe to any other `CoinPanion`.
## Use Case 1 - Creators

Rahul is a program. He creates Open Source DApps for free for a better blockchain tomorrow.
Rahul however has a family to feed and a home to pay for. He needs a monthly income to be able to continue writing great DApps.
He goes to CoinPanion, for the first time, and is presented with his dashboard.
His Ethereum Address is already filled in as Rahul is using Status to browse the DApp.
He decides to personalize his profile by uploading a profile picture and setting his name, email and profile description.
He writes a meaningful description and mentions some of his current projects.
This will later be used when his supporters go to visit his profile.

Alon loves DApps and the whole crypto community.
He recently started using one of the Open Source DApps that Rahul made.
He decides that he wants to support Rahul with 1 ETH a month.

Alon visits CoinVault . His CoinVault is currently empty.
He clicks on Add to CoinVault and sends 2.1 ETH to the CoinVault, a smart contract which handles subscriptions for Alon.
The reason for the extra .1 ETH is for Gas fees.
This funding will allow Alon to support Rahul for two months.

The he clicks on the button Coin Someone.
A modal pops up where Alon enters the ETH address of Rahul.
He enters 1 ETH per month and clicks Send.
1 ETH is instantly sent from the CoinVault to Rahul.
The CoinVault also schedules to send another 1 ETH in a month.
Every time the CoinVault sends a subscription payment, it also schedules the next one.

When the CoinVault starts to get low on currency, will be empty before next payment, it sends an email notification to Alon.

When a CoinVault is empty it stops sending out coins until it is replenished.

Rahul gets an email that he has a new CoinPanion!
He visits his CoinPanion Dashboard and sees his new subscriber Alon.

For more Use Cases look at USECASES.md

# Getting up and running instructions
1. Clone this repo
2. Run TestRPC local node or similar.
3. Download and install truffle and its dependencies
5. Compile CoinPanion with `truffle compile`
6. Install CoinPanion on the blockchain with `truffle migrate`
7. Run `Yarn start` or `npm run start`
8. Visit: `http://localhost:3000` to checkout the Dapp

# How To Coin Someone
1. Visit CoinPanion in Status.IM or similar
2. Search for the person you want to Coin
3. Visit their Profile Page
4. Click `Coin User`
3. Select an amount and a time interval
4. Press Send

# How to accept payments
1. Visit CoinPanion in Status.IM or similar
2. Visit your dashboard to view your available payments
3. If the time interval has passed for a specific payment an Accept Payment button will appear.
3. Accept Payments by pressing Accept

# Technical Description:
### First Time + Loading Vault
1. Alon visits his Dashboard
2. Firebase returns that Alon doesn't have a Vault Contract Saved in DB
3. Alon has a button: `Initialize Vault`
4. This fires off `vault..deployed(userAddress, userAddress, 0, 0, userAddress, 0)`
5. The vaultAddress is saved into the DB so that next time that Alon visits his Dashboard his vault is loaded again.
6. Now Alon can Load his Vault, Coin Someone etc

### Coining Someone:
1. Alon visits the Profile Page of Tim
2. Alon Clicks Coin Tim
3. Alon inputs 5 ETH per Month
4. Alons VaultInstance is called using `vaultInstance.authorizePayment`
```
vaultInstance.authorizePayment( 'alon', coinSomeoneAddress, Number(coinSomeoneValue), Number(subscriptionDelay), { from: userAddress,gas: 500000 })
```
5. This function returns a `paymentId`. This needs to be saved into the DB of *Tim* along with the vaultAddress of *Alon*, payoutTimestamp (Timestamp when Tim can get Payment)

### Receiving Payment:
1. Tim enters his dashboard
2. He sees that he has a payment with paymentId `xyz`. 
3. If the payoutTimestamp has passed. Tim can click on Accept to receive his Ether.
3. If the payoutTimestamp hasn't passed. Tim can see how long until he can receive his Ether.

Receiving Ether is done with: `alonVaultInstance.collectAuthorizedPayment(xyz, {from: timAddress})`

# Dependencies
* Truffle
* React
* WebPack
* Blockchain - TestRPC or Ropsten

# File Structure
* Src - contains the front-end's source code 
* Config - configuration and install scripts 
* The rest of the folders connect us to the Ethereum universe via
* Web3 with Truffle through the Status.Im platform

# Contact Us
Join us on the Status.IM Slack channel to chat with us!

## Team Members:
### Alon
* Github Handle: @Alonski
* Slack Username: @alon

### Rahul
* Github Handle: @rhlsthrm
* Slack Username: @rahul

### Tim
* Github Handle: @imbaniac
* Slack Username: @treznich

### Joseph
* Github Handle: @Josephrp
* Slack Username: @JosephP
