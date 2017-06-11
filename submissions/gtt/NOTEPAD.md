# Balances

## What is this?

Balances allow you to track and chart balances of  multiple ethereum accounts.

- [mainnet](https://etherscan.io/token/0xd248b0d48e44aaf9c49aea0312be7e13a6dc1468)
- [testnet](https://ropsten.etherscan.io/token/0x4bda828f1fe628973c39366263b78b7cd9d6d8fe)
- [metamask][0x5A384227B65FA093DEC03Ec34e111Db80A040615]

## Commands

/add_account account : adds ethereum account
/add_token : adds ERC20 token contract
/list_accounts : list all ethereum addresses
/list_tokens: list all available tokens
/delete_account:
/delete_token:
/reset:
/balances (unit): shows combined balances of all accounts
/chart (duration|unit) -> link to https://image-charts.com/ with params.

## What kind of chart?

- line graph of transaction histories
- histogram of your ownership of token relative to everybody else.


## Additional features

- ens integration
- persist data
- cache data aggregation
- /scan_account
- Be able add name to each account
- Generate dynamic charting via D3 which can transform duration and display unit
- Grouping accounts


https://image-charts.com/chart?chs=500x190&chd=t:20833,41666,416666&cht=lc&chtt=hello&chds=a



## For Status hackathon (Genesis Token Companion Dapp&Bot)

- Show top 5 contributor and compare against one account.
- Bot just asks you to add a one account.
- (Can we tell the progress since last time you checked?)

## Commands

- welcome
- leader_board   (list)
- histogram      (histogram)
- recent         (list) if I can tap into events.
- promote -> randomly generate praise of status.
- cheer ->
https://www.happier.com/blog/25-ways-to-make-someones-day
https://letterpile.com/correspondence/23-funny-ways-to-say-hello

-  @ethstatus ico is coming soon!
-  @ethstatus is the next (big thing|wechat|twitter|facebook|dispora)!
-  @ethstatus is the best things since the (sliced bread|kittens|blockchain|internet)!
-  I am so (excited|)


## For Token hackathon

- Allow user to track x number of eth accounts.
- Dynamically change against USD/GBP/BTC

### Commands

- add_account
- add_token
- remove_token
- list_accounts
- remove_account
- chart_transactions
- chart_balances
