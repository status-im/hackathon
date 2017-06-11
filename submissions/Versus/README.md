###Versus DApp and bot for Status-im

Submission: https://github.com/status-im/hackathon/issues/180

{"whisper-identity": "versus-bot",
 "name":             "#180 Versus DApp and bot",
 "dapp-url":         "http://versus.obedbk.ru",
 "bot-url":          "http://versus.obedbk.ru/js/bots/bot.js"}

##Description: The purpose of this app is to help people decide which one among two things is better. And let others earn ethereum tokens by making those decisions.

User can create a versus (poll) by uploading two pictures. Every new versus creates a blockchain transaction, therefore user needs to pay a fee, which depends on the amount of people he or she wants to participate in the poll. After a versus is submitted other users are able to participate in the poll.

When a user makes decision on one or more versuses he or she can submit them in order to create a transaction and save them to the blockchain. Every time a user submits several decisions a fee is paid.

After a submission user receives a refund which depends on the amount of decisions he or she has made. A refund amount may be greater than transaction so user can earn tokens from that.

The DApp is accessible via bot and webview.

#Supported bot commands:

/about - shows description
/loadfeed - load versus feed to bot (executed before /rate)
/rate - opens pair for rating (feed must be loaded before that command)
/claim - claim reward for rated pairs (must be executed after some pairs have been rated)
/dapp - opens DApp in webview

Webview functionality: in addition to all bot functionality DApp provides a feature for adding a new Versus (pair).

Bot files: /app/js/bots/
DApp files: /app/js/scripts/

Ropsten smart contract: 0x9684744c20734d370C9232f7E47B17E8Fcc11FFE