# Status CLI

Additional tools for DApps developers. These tools allows to speed up the process of developing DApps for Status.

## Requirements

1. Node.js;
2. NPM;
3. Watchman (https://facebook.github.io/watchman/docs/install.html).

## Installing

```
npm i -g status-dev-cli
```

## Command Line

**Common parameters:**

* `--ip <device-ip>` to specify your device's IP address. If you don't know your device's IP address, just run `status-dev-cli scan`. The IP should be provided for every command you try to execute (except `scan`, of course)

Device IP can also be provided using the `STATUS_DEVICE_IP` environment variable (e.g. `STATUS_DEVICE_IP=192.168.0.2 status-dev-cli list`)

#### 1. Scanning the network

***status-dev-cli 3.2.0+, Status 0.9.8+***

Scans for available Status debug servers and returns IP addresses of them.

`status-dev-cli scan`

#### 2. Adding a contact (DApp or bot)

`status-dev-cli add [contact] --ip [device ip]`

* `contact` — JSON containing contact information. It is not required if you develop a DApp and this DApp contains `package.json` file. Otherwise, this map should contain `whisper-identity`, `name` and `dapp-url` or `bot-url` fields (see the example in **Scenario** section)

#### 3. Removing a contact (DApp or bot)

`status-dev-cli remove [whisper-identity] --ip [device ip]`

* `whisper-identity` — the identity of your DApp/bot. It is not required if you develop a DApp and this DApp contains `package.json` file. 

#### 4. Refreshing a DApp automatically

`status-dev-cli watch [dir] [whisper-identity] --ip [device ip]`

* `dir` — dir that should be observed. Not required;
* `whisper-identity` — the identity of your DApp/bot. It is not required if you develop a DApp and this DApp contains `package.json` file. 

#### 5. Refreshing a DApp manually

***status-dev-cli 2.2.1+***

This command simply reloads the DApp

`status-dev-cli refresh [whisper-identity] --ip [device ip]`

* `whisper-identity` — the identity of your DApp/bot. It is not required if your DApp contains `package.json` file.

#### 6. Switching network

***status-dev-cli 2.2.0+, Status 0.9.4+***

Typically when developing DApps, a developer uses his own private chain or a simulator.
Status inserts its own web3 object into the DApp, however, this web3 object is connected to a different network than the development one.
This command allows to switch a network. Next time you login the network will be switched back.

`status-dev-cli switch-node <url> --ip [device ip]`

* `url` (required) — the network that will be used instead of `http://localhost:8545`

#### 7. Listing all debuggable DApps and bots

***status-dev-cli 3.2.0+, Status 0.9.8+***

Displays all debuggable DApps and bots. Can be useful if you don't remember identities of your applications.

`status-dev-cli list --ip [device ip]`

#### 8. Extracting logs

***status-dev-cli 3.2.0+, Status 0.9.8+***

Displays the last 100 log messages for the specified bot or DApp.

`status-dev-cli log <whisper-identity> --ip [device ip]`

* `whisper-identity` — identity of your DApp or bot.

## Using status-dev-cli as a library

```
  var StatusDev = require('status-dev-cli');
  var statusDev = new StatusDev({ip: 'you-device-ip'});

  dataData = {
    "whisper-identity": "dapp-MyAppName",
    "dapp-url": "http://your-server-ip:port",
    "name": "My App Name"
  }

  statusDev.addContact(dappData, function(error, result) {});

  statusDev.refreshContact(dappData, function(error, result) {});

  statusDev.removeContact(dappData, function(error, result) {});

  statusDev.switchNode(rpcUrl, function(error, result) {});
  
  statusDev.listDApps(function(error, result) {});
  
  statusDev.getLog(identity, function(error, result) {});
```

## DApp development

To make debugging work we run a web server on your device. It runs on port 5561 on both iOS and Android, but only if you need it.

To start a server you need to:
1. Connect your device to computer;
2. Open Status application and log in;
3. Open `Console` chat and execute `/debug` command providing "On" as the argument.

You can also easily turn the server off from here.

**Note:** if you turn the server on, it will start automatically the next time you log in.

### Scenario

Imagine you are developing a DApp on your computer. You have a directory where all DApp files are placed, 
and there is a server running on your computer. Let's say it is running on port 8080, so you can access 
your DApp by typing http://localhost:8080 in your browser.

1. Find the IP address of your device by running `status-dev-cli scan`;
2. Add a DApp to Status by executing `status-dev-cli add '{"whisper-identity": "dapp-test", "dapp-url": "http://localhost:8080/", "name": "My Dapp"}' --ip <DEVICE IP>`;
3. Open the "My Dapp" on your device;
4. Optional: Execute `status-dev-cli watch-dapp . '{"whisper-identity": "dapp-test"}' --ip <DEVICE IP>` to start automatically refreshing your DApp in Status browser when you change the DApp's code.
