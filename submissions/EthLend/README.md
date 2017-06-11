# Status Hackathon Chatbot

* Install status-dev-cli
* Install Status app on phone
* Enable `debug` mode in app console
* Install and run npm module `http-server` in a separate tab of terminal
* Get Android phone IP using `status-dev-cli scan`
* Deploy to android using:
```console
status-dev-cli add '{"whisper-identity": "<appName - lower camel case>", "bot-url": "<MachineIP>:<PORT>/bots/<filename.js>", "name": "<AppName - upper camel case>"}' --ip <PhoneIP got from scan command>
```
* Watcher to auto deploy on file changes: `status-dev-cli watch $PWD "<appName - lower camel case>" --ip <PhoneIP got from scan command>`