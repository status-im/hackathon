# Favor Network

*"Those who want respect, give respect."* ~Tony Soprano

The favor network is the ultimate *decentralized* and *trustless* ledger to keep track of personal favors you owe to others and those that others owe to you. Not only does it allow you to honour all the promises you've made, but it gradually builds up a stove of reputation data, giving you an idea how *respectable* someone is when it comes to returning a favor.

However, the favor network is not a simple one-to-one ledger of promises, but rather a *living* and *organic* network where favors and promises may flow freely between all participants. Instead of promising someone to return the favor, you might reward them with a pledge you received yourself, leaving it to them to redeem that favor.

The raison d'être of the favor network is to break the one sided relationships in human interactions and permit promises to find their way back to their origins, promoting a culture of generosity and preventing the formation of [givers and takers](https://www.ted.com/talks/adam_grant_are_you_a_giver_or_a_taker).

## Status Network + Favor Network = :heart:

When was the last time you opened your browser, loaded a website and logged in just to ask your friend something? Probably a long time ago! Most of our day-to-day interactions revolve around chat rooms through our mobile phones. To make tracking favors feasible, it must be invisible yet omnipresent in our discussions. *It must be as simple as plain asking.*

Enter the [Status Network](https://status.im/). On the surface Status seems little more than a mobile messenger application, however it is a fully decentralized end-to-end encrypted communication platform with access to both the Ethereum blockchain as well as the Swarm file system.

By integrating the [Favor Network](https://favor.network/) seamlessly into Status, users can ask, accept and honour favors as seamlessly as sending messages to one another. All of this while preserving privacy (Whisper), guaranteeing correctness (Ethereum) and minimizing consensus costs (Swarm).

[![Favor Network](https://img.youtube.com/vi/kelAI6MlICA/0.jpg)](https://www.youtube.com/watch?v=kelAI6MlICA)

## Try it out yourself

To try out the favor network yourself you'll need a few things. First up, the official Status release contains a bug which prevents command suggestions from accessing the chat context between two people (hint, we need that). This was [fixed by Roman](https://github.com/rasom/status-react/commit/0bee6439d6a6f8e67bff7c3a28650361d017b741) and an updated unofficial [Android `.apk`](https://www.dropbox.com/s/rghvb0n94zn28a8/status-0bee6439d6a6f8e67bff7c3a28650361d017b741.apk?dl=0) provided. **This bugfix is unavailable on iOS currently**.

With the above mentioned Android package installed on your device or emulator (you'll need at least two physical or virtual devices to test), you can use the `status-dev-cli` command to install the favor network chatbot onto your devices. The below script forwards the debug port of status to your local network adapter and hard-reinstalls the favor bot.

```bash
# List all devices attached to your machine
$ $ANDROID_HOME/platform-tools/adb devices

# To each of the above, deploy the chatbot one by one
$ $ANDROID_HOME/platform-tools/adb -s device-id-from-above forward tcp:5561 tcp:5561
$ status-dev-cli remove favor --ip localhost
$ status-dev-cli add '{"whisper-identity":"favor", "name":"Favor Network", "bot-url":"http://favor.network/statusbot.js", "photo-path":"http://favor.network/statusbot.png"}' --ip localhost
```

If everything went well, the favor network chatbot should be open on your Status messenger app, greeting you with a mobster quote and giving a few hints on how to start. Feel free to open a human-to-human chat and start running `@favor`s between your accounts. Whenever you're wondering what's happening, switch back to the bot and you'll find all the events there.

*The favor network on Ropsten is deployed at [`0xd1ee90c67ab3cedd911773b193617b6ecac6bf7a`](https://ropsten.etherscan.io/address/0xd1ee90c67ab3cedd911773b193617b6ecac6bf7a).*

## Missing features

The favor network is currently in a proof-of-concept state, glued together for the [Status hackathon](https://hackathon.status.im/). The core ideas behind it are there for experimentation, but the code is not so nice and a lot of features are still missing (some due to time limitations, others due to pending features and bugfixes on Status itself):

 * Favor requests are currently uploaded in full to the Ethereum blockchain. This of course entails paying for storage costs proportional to the length of the text. This can be replaced with a Swarm or IPFS based storage when such a feature lands in Status, reducing the storage requirements to 32 bytes (content hash).
 * Favors are currently pushed in plaintext form into the system. This isn't the best idea as it can leak unintended personal details out for all to see. This can however be solved by encrypting the content of the favor client side, and using Whisper built into Status to forward the decryption key to the intended recipient.
 * There is no reputation system in place currently. To support this we need an extra functionality of challenging favor requests instead of just being able to honour them. A challenge would entail both parties having a public discussion about the reason of failure. Others would then be able to evaluate on their own whether to trust someone or not.

The above 3 main features are a must have before the favor network could be considered ready for prime time, but I'm hoping the current reduced feature set is enough to demonstrate the viability of the idea, with the remainder mostly requiring work, work and some more work to implement.

## Status bugs and suggestions

The below list contains a randomly ordered braindump of the issues and shortcomings I've found while developing the favor network. It is a feedback towards the Status team to help make their platform more robust.

#### Allow chatbots to have event loops or chain callbacks

The chatbots can currently be directed to issue transactions on the users' behalf. The best solution I could come up with to notify the user about this is to have the bot send a message with the transaction details (app specific, not technical), and send a second message with a URL linking the transaction to etherscan. This live URL allows the user to track the progress of the transaction.

A much nicer solution would be to allow the bot to monitor the blockchain for transaction inclusion events and do something when it happens. One possibility is to extend Status with a new chatbot event, which gets triggered if a transaction is included that was sent by the bot. This would allow the bot to react when something it initiated has completed.

Another possibility is to permit chatbots to have their own life cycles, which would allow them to periodically query the chain for needed data and ping the user whenever it deems useful. The benefit of this second approach is that it covers both events initiated locally as well as remote contract updates.

#### Allow chatbots to post into human-to-human chats

Currently Status allows a chatbot to register a `global` command that is made available on human-to-human chat windows, permitting both participants to interact with the bot itself while chatting with each other. The bot however is not allowed to send a message back into this conversation.

To understand why such a feature would be really powerful, consider the following interaction:

 * Alice pings the favor bot to open a new request to Bob
 * A preview is shown, but the transaction is still pending
   * Bob cannot react until the transaction finishes
 * *Transaction executes successfully*
   * *Nobody knows about it, so it's trial and error*
 * **If the favor bot could notify both parties**
   * **Bob could properly react to the request**

An alternative could be that if a command from a human-to-human chat results in a transaction, Status could automatically inject a message sent via `Console` that could show a progression icon, changing to green/red when the transaction finishes/fails. This would help users notice that they can continue some interaction suspended by Ethereum's transaction processing.

Such a feature would also be beneficial for `/send` and `/receive` where users could be notified not just that the other party executed the command, but also of it's current execution status.

#### Message formatting breaks URL detection

If a chatbot sends a message to the user via `status.sendMessage` which contains a URL, that is automatically detected and converted into a `@browser URL` tappable command. However this functionality breaks if the message being sent contains any format modifiers (`*` or `~`).

Beside fixing the issue so that format modifiers don't break URL detection, I'd venture into suggesting support for a few more modifiers:

 * Explicitly mark a URL as such, perhaps supporting an alternate display string. You could make this feature only available for chat bots but not for users so users can't spoof links but chatbots can display short and sweet versions.
 * Explicitly mark an Ethereum address as such, shortening the display to `0x123456...000000` for example, and creating a tappable `@browse https://etherscan.io/address/0x...` link out of it. The hash could be extended with a contact's name if it's an address known to us.
 * Explicitly mark an Ethereum transaction and block hash as such, shortening and linking them to a block explorer. Perhaps a visual cue could also be used to differentiate between the two (note, differentiation cannot be done automatically, it needs a hint from the creator of the message).

#### Allow formatting modifiers in command previews

Currently a chatbot can send a message via `status.sendMessage`, where formatting is done via small modifiers (e.g. `*` for bold and `~` for italic). On the other hand a chatbot's command is displayed via `component.preview`, where formatting is done via full blown reactive components.

This is unfortunate because if I need to display the same information in both a sent message as well as a command preview, I need to make two formatters. Furthermore it breaks the style because I can't imagine an easy way to make them look the same.

My suggestion would be to provide a pre-built component from the status SDK that does the same formatting a used in `status.sendMessage`. Of course making something explicitly catered for each command is arguably better, having a nice default out of the box might help adoption by allowing faster prototyping.

#### Allow chatbots to send multiple command pills

Currently Status features a limited support for sending `requests`, which is basically a plea for the other side to call a pre-parametrized `command` (such are requesting the other side to send some Ether). This construct is useful for human-to-human interactions, but it's a bit limited for bot-to-human messages.

The limitation for chatbots is that a bot may suggest multiple executable commands in a single chat message to make the information more compact (opposed to sending many messages, each containing one suggestion). In this case it's not possible to make all of the commands actively clickable.

My suggestion would be to allow chatbots to send multiple commands like in the example below, where all of the commands get turned into pills (clickable inline buttons). This way we can preserve the "feel" of chatting with someone while at the same time providing seamless contextual aid. The pills should allow for hidden parameters expanded on click of course.

![ChatBot Pills](http://i.imgur.com/Gl5s4fM.png)

#### Allow deleting synchronized chain data

When setting up multiple emulators at once, usually some of them started syncing from zero. Not sure why this happened (possibly a bad peer?), but this results in a very slow startup and a lot of disk space. I know that ultimately Geth needs to be smarter here (would appreciate a bug report), but perhaps having some menu to "delete chain data" would help both fix this error as well as possibly clear out old data when a new version of Status is released with a new CHT.

#### Various failures around global commands

If a chatbot provides a global command, that can be called via `@botname` in human-to-human chat windows. When these are displayed as previews however, the command label shown is `/global` not `@botname`. This makes it impossible for the remote side to know which bot was invoked.

The formatting also almost always fails on the remote side. It may have something to do with `TEXT` parameters containing spaces. Very rarely I managed to have it properly formatted, but generally it just displays a JSON dump on the remote side.

Lastly global commands cannot be currently used as `response` requests. It would be nice to support this use case because then in the below example my speech bubble that asks the other side for a favor could at the same time provide the `@favor accept` button to have the remote party accept it.

![Global Commands](http://i.imgur.com/dqcA5o7.png)
