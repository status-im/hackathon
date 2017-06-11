# DApp and bot for Status.im

Hackathon GitHub Issue: https://github.com/status-im/hackathon/issues/38

```
{"whisper-identity": "38-doctor-wetrust",
 "name":             "#38 Dr. WeTrust",
 "bot-url":          "http://192.241.143.62/bot/bot.js",
 "photo-path":       "http://192.241.143.62/img/wetrust.png"}
```

# Dr. WeTrust!

This is our entry to the Status.im hackathon!

Dr. WeTrust is a bot, who helps you interact with WeTrust ROSCA-like Trusted Lending Circles. Start chatting to the doctor to create a Circle, then share the address with your friends to let them get involved :)

## Getting it running

Do the usual, enable debugging mode in the app.

Do `npm install`.

Serve the bot file with `truffle serve`.

Shoehorn the doctor into to your list of Status contacts with something like this:
```
status-dev-cli add '{"whisper-identity": "doctor-wetrust",  "name": "Dr. WeTrust", "bot-url": "http://<MY_LOCAL_IP>:8080/bot/bot.js"}'
```

Be sure to swap out `MY_LOCAL_IP` for your own ;)

## Considerations

Dr. WeTrust, whilst being a pretty clever chap, has a few gaps in his brain. Here are a couple of the things which would need to be fixed in a production system:

- Currently you can load anyone else's Circle into your own chat

- There are no restrictions on who can join the Circle. This is a fairly simple fix, we would just force the organiser to invite users manually. Adding this now wouldn't be great for UX, as we can't access the contact list from the chat API, so we have left it open as a PoC.

We would also love to make some improvements:

- Create a webview-based interface for checking the status of Lending Circles at a glance, without having to issue commands. This would require either a proxy-contract, to store mappings between users/circles, or it would require the sharing of LocalStorage variables between the webview and the bot (something which afaik doesn't exist in Status yet).

- Some more detailed instructions, currently there are some instructions within the `/create` command's suggestions, but there are no real detailed, right-to-the-core instructions which share what the project is about and how to chat with Dr. WeTrust successfully. It would benefit users to know about Lending Circles prior to chatting with the doctor.
