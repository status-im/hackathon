var factoryABI = [
  {
    constant: true,
    inputs: [
      {
        name: "_name",
        type: "string"
      }
    ],
    name: "findUnConference",
    outputs: [
      {
        name: "",
        type: "address"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_name",
        type: "string"
      }
    ],
    name: "create",
    outputs: [
      {
        name: "",
        type: "address"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "listUnconferences",
    outputs: [
      {
        name: "list",
        type: "string"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "name",
        type: "string"
      },
      {
        indexed: false,
        name: "unconf_address",
        type: "address"
      }
    ],
    name: "NewUnConf",
    type: "event"
  }
];

var unConfABI = [
  {
    constant: false,
    inputs: [
      {
        name: "topicID",
        type: "uint256"
      }
    ],
    name: "vote",
    outputs: [
      {
        name: "voteID",
        type: "uint256"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getMembersCount",
    outputs: [
      {
        name: "count",
        type: "uint256"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getName",
    outputs: [
      {
        name: "",
        type: "string"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    name: "topics",
    outputs: [
      {
        name: "proposer",
        type: "address"
      },
      {
        name: "description",
        type: "string"
      },
      {
        name: "numberOfVotes",
        type: "uint256"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "address"
      }
    ],
    name: "memberId",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    name: "members",
    outputs: [
      {
        name: "member",
        type: "address"
      },
      {
        name: "name",
        type: "string"
      },
      {
        name: "memberSince",
        type: "uint256"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "listTopics",
    outputs: [
      {
        name: "list",
        type: "string"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [
      {
        name: "",
        type: "address"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getNumTopics",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "targetMember",
        type: "address"
      }
    ],
    name: "getMemberName",
    outputs: [
      {
        name: "name",
        type: "string"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "topicDescription",
        type: "string"
      }
    ],
    name: "newTopic",
    outputs: [
      {
        name: "topicID",
        type: "uint256"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "targetMember",
        type: "address"
      },
      {
        name: "memberName",
        type: "string"
      }
    ],
    name: "addMember",
    outputs: [
      {
        name: "success",
        type: "bool"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "targetMember",
        type: "address"
      }
    ],
    name: "getMemberSince",
    outputs: [
      {
        name: "since",
        type: "uint256"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "index",
        type: "uint256"
      }
    ],
    name: "getTopicNameAndVotesAt",
    outputs: [
      {
        name: "topicName",
        type: "string"
      },
      {
        name: "topicVotes",
        type: "uint256"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getVoteCount",
    outputs: [
      {
        name: "votes",
        type: "uint256[]"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    type: "function"
  },
  {
    inputs: [
      {
        name: "_name",
        type: "string"
      },
      {
        name: "_owner",
        type: "address"
      }
    ],
    payable: true,
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "topicID",
        type: "uint256"
      },
      {
        indexed: false,
        name: "proposer",
        type: "address"
      },
      {
        indexed: false,
        name: "description",
        type: "string"
      }
    ],
    name: "TopicAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "topicID",
        type: "uint256"
      },
      {
        indexed: false,
        name: "voter",
        type: "address"
      }
    ],
    name: "Voted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "member",
        type: "address"
      },
      {
        indexed: false,
        name: "isMember",
        type: "bool"
      }
    ],
    name: "MembershipChanged",
    type: "event"
  }
];

var factoryAddress = "0xC7141f3FE08c5028407e004cf9a7343A9e313625";
var FactoryContract = web3.eth.contract(factoryABI);

var UnConfContract = web3.eth.contract(unConfABI);

var CommandEnum = {
  CREATE_UNCONF: "createUnconf",
  REGISTER: "register",
  SHARE: "shareUnconf",
  ADD_TOPIC: "addTopic",
  LIST_TOPICS: "listTopics",
  VOTE_TOPIC: "voteForTopic"
};

/*
 Greet the user with some lovely messages
*/
status.addListener("init", function(params, context) {
  if (!isFirstUse(true)) {
    status.sendMessage("Welcome back - how may I help you today?");
    return;
  }

  status.sendMessage(
    "Hi - Unconf let's you create or participate in Unconferences!"
  );
  status.sendMessage(
    "Let's get started, try typing " +
      prettyPrintCommand(CommandEnum.CREATE_UNCONF) +
      " to create a new Unconference. " +
      "Alternatively you could register for an Unconference by using the " +
      prettyPrintCommand(CommandEnum.REGISTER) +
      " command"
  );
  setFirstUse(false);
});

/*
 Find/Join/Share Event
 */
status.command({
  name: CommandEnum.CREATE_UNCONF,
  title: "Create a new Unconference",
  description: "Helps you create a new Unconference",
  color: "#0000ff",
  params: [
    {
      name: "unconfName",
      type: status.types.TEXT,
      placeholder: "Unconference Name"
    }
  ],
  handler: function(params) {
    var unconfName = params.unconfName.trim();
    //Create Event and store address in local storage
    deployContract(unconfName);
  }
});

status.command({
  name: CommandEnum.REGISTER,
  title: "Register for an Unconference",
  description: "Helps register for an Unconference",
  color: "#0000ff",
  sequentialParams: true,
  preview: function(params) {
    var text = status.components.text(
      {},
      "Unconference Name: " +
        params.unconfName +
        "\n" +
        "Alias: " +
        params.alias
    );
    return {
      markup: status.components.view({}, [text])
    };
  },
  params: [
    {
      name: "unconfName",
      type: status.types.TEXT,
      placeholder: "Unconference Name",
      suggestions: unconfsSuggestions
    },
    {
      name: "alias",
      type: status.types.TEXT,
      placeholder: "Alias"
    }
  ],
  handler: function(params) {
    var unconfName = params.unconfName.trim();
    var alias = params.alias.trim();

    var address = getUnconfAddressFromFactory(unconfName);

    if (!web3.isAddress(address) || isNullAddress(address)) {
      status.sendMessage(
        "Sorry couldn't find any Unconferences called " +
          unconfName +
          ", please check your spelling and try again. " +
          "Alternatively you could create this Unconference by using the " +
          prettyPrintCommand(CommandEnum.CREATE_UNCONF) +
          " command"
      );
      return;
    }

    setEventName(unconfName);
    setEventAddress(address);
    var unConfContractInstance = UnConfContract.at(address);
    if (unConfContractInstance.memberId(getUsersAddress()) == 0) {
      addMemberToChain(alias);
    } else {
      status.sendMessage("Joined as " + alias + " for " + unconfName);
    }
  }
});

status.command({
  name: CommandEnum.SHARE,
  title: "Share this Unconference",
  description: "Helps share an Unconference",
  color: "#0000ff",
  preview: function(params) {
    var text = status.components.text({}, "");
    return {
      markup: status.components.view({}, [text])
    };
  },
  handler: function(params) {
    //Get Event Name and address from local storage
    if (!checkUserIsRegestered()) {
      return;
    }

    var unconfName = getUnconfName();
    var unconfAddress = getUnconfAddress();

    status.sendMessage(
      "Your attendees can register using " +
        prettyPrintCommand(CommandEnum.REGISTER) +
        " *" +
        unconfName +
        "*"
    );
  }
});

/*
 Once the user has selected an event here are the topic options
 */
status.command({
  name: CommandEnum.ADD_TOPIC,
  title: "Topic Creator",
  description: "Helps you create a new topic",
  color: "#0000ff",
  params: [
    {
      name: "topicName",
      type: status.types.TEXT,
      placeholder: "Topic Name"
    }
  ],
  handler: function(params) {
    if (!checkUserIsRegestered()) {
      return;
    }

    var topicName = params.topicName.trim();
    addTopicToChain(topicName);
  },
  validator: function(params, context) {
    if (params.topicName.indexOf("\\") > -1) {
      return {
        markup: status.components.validationMessage("Invalid character")
      };
    }
  }
});

status.command({
  name: CommandEnum.LIST_TOPICS,
  title: "Topic Lister",
  description: "Lists all added topic",
  color: "#0000ff",
  preview: function(params) {
    var text = status.components.text({}, "");
    return {
      markup: status.components.view({}, [text])
    };
  },
  handler: function(params) {
    if (!checkUserIsRegestered()) {
      return;
    }

    getAlltopics();
  }
});

status.command({
  name: CommandEnum.VOTE_TOPIC,
  title: "Topic Voter",
  description: "Helps you vote on an existing topic",
  color: "#0000ff",
  params: [
    {
      name: "topicName",
      type: status.types.TEXT,
      placeholder: "Topic Name",
      suggestions: topicsSuggestions
    }
  ],
  handler: function(params) {
    if (!checkUserIsRegestered()) {
      return;
    }

    var contractAddress = getUnconfAddress();

    // initiate contract for an address
    var unConfContractInstance = UnConfContract.at(contractAddress);

    // call constant function
    var topics = unConfContractInstance.listTopics();
    voteForTopicOnChain(topics.split("\n").indexOf(params.topicName));
  },
  validator: function(params, context) {
    var contractAddress = getUnconfAddress();

    // initiate contract for an address
    var unConfContractInstance = UnConfContract.at(contractAddress);

    // call constant function
    var topics = unConfContractInstance.listTopics();
    if (topics.indexOf(params.topicName) == -1) {
      return {
        markup: status.components.validationMessage(
          "Topic not found, please check your spelling and try again"
        )
      };
    }
  }
});

/*
 General factory functions
*/
function deployContract(eventName) {
  var usersAddress = getUsersAddress();

  var factoryContractInstance = FactoryContract.at(factoryAddress);

  // call constant function
  var hash = factoryContractInstance.create(eventName, { from: usersAddress });

  if (
    waitForMining(
      "Please wait while we set up your Unconference, this may take a second.",
      hash
    ).failed
  ) {
    return;
  }

  var contractAddress = getUnconfAddressFromFactory(eventName);

  if (!web3.isAddress(contractAddress)) {
    status.sendMessage("Sorry something went wrong, please try again");
    return;
  }

  // initiate contract for an address
  var unConfContractInstance = UnConfContract.at(contractAddress);

  // call constant function
  var owner = unConfContractInstance.owner();

  if (owner != getUsersAddress()) {
    status.sendMessage(
      "Sorry somebody has already created an Unconference using that name. " +
        "Please use a unique name and try again \n" +
        "*Hint:* You can use " +
        prettyPrintCommand(CommandEnum.FIND) +
        " to list all Unconferences"
    );
    return;
  }

  //Store these details for later
  setEventAddress(contractAddress);
  setEventName(eventName);

  status.sendMessage("Success *" + eventName + "* created!");
  status.sendMessage(
    "Your attendees can register using " +
      prettyPrintCommand(CommandEnum.REGISTER) +
      " *" +
      eventName +
      "*"
  );
}

function getUnconfAddressFromFactory(unconfName) {
  var factoryContractInstance = FactoryContract.at(factoryAddress);

  var address = factoryContractInstance.findUnConference(unconfName);

  if (!web3.isAddress(address)) {
    status.sendMessage(
      "Oh no something didn't quite work as it should have, please try again!"
    );
    return;
  }
  return address;
}

/*
 General Unconference functions
*/
function getAlltopics() {
  var usersAddress = getUsersAddress();

  var contractAddress = getUnconfAddress();

  // initiate contract for an address
  var unConfContractInstance = UnConfContract.at(contractAddress);

  // call constant function
  var numTopics = unConfContractInstance.getNumTopics();

  if (numTopics == 0) {
    status.sendMessage("No topics added yet");
    return;
  }

  var message = "";
  var count;
  for (count = 0; count < numTopics; count++) {
    // call constant function
    var topicNameAndVotes = unConfContractInstance.getTopicNameAndVotesAt(
      count
    );
    message +=
      "ID:" +
      count +
      "  Topic:" +
      topicNameAndVotes[0] +
      " Votes:" +
      topicNameAndVotes[1] +
      "\n";
  }

  status.sendMessage(message);
}

function addTopicToChain(topicName) {
  var usersAddress = getUsersAddress();

  var contractAddress = getUnconfAddress();

  // initiate contract for an address
  var unConfContractInstance = UnConfContract.at(contractAddress);

  // call constant function
  var hash = unConfContractInstance.newTopic(topicName, { from: usersAddress });

  if (
    waitForMining("Please wait we're creating your topic now!", hash).failed
  ) {
    status.sendMessage(
      "Oh no something didn't quite work as it should have, please try again!"
    );
    return;
  }

  status.sendMessage("Success! Topic: " + topicName + " created!");
}

function voteForTopicOnChain(topicID) {
  var usersAddress = getUsersAddress();

  var contractAddress = getUnconfAddress();

  // initiate contract for an address
  var unConfContractInstance = UnConfContract.at(contractAddress);

  var numberOfTopics = unConfContractInstance.getNumTopics();

  // call constant function
  unConfContractInstance.vote(
    topicID,
    {
      from: usersAddress
    },
    function(error, hash) {
      if (
        waitForMining("Please wait a second while we confirm your vote", hash)
          .failed
      ) {
        return;
      }

      status.sendMessage("Success! vote confirmed!");
    }
  );
}

function addMemberToChain(memberName) {
  var usersAddress = getUsersAddress();
  var unconfName = getUnconfName();
  var contractAddress = getUnconfAddress();

  // initiate contract for an address
  var unConfContractInstance = UnConfContract.at(contractAddress);

  // call constant function
  unConfContractInstance.addMember(
    usersAddress,
    memberName,
    {
      from: usersAddress
    },
    function(error, hash) {
      if (
        waitForMining("Please wait a second while we register you", hash).failed
      ) {
        return;
      }

      unConfContractInstance.getMemberName(usersAddress, function(
        error,
        result
      ) {
        if (result != memberName) {
          status.sendMessage(
            "Looks like you were already registered for " +
              unconfName +
              " as: " +
              result
          );
        } else {
          status.sendMessage(
            "Successfully registered for " + unconfName + " as: " + result
          );
        }
      });
    }
  );
}

//Thanks https://github.com/morelazers
function waitForMining(message, txHash) {
  //As this may take some time, we should probably let the user know we're working on it
  status.sendMessage(message);
  var mined = false;
  var receipt;
  while (!mined) {
    receipt = web3.eth.getTransactionReceipt(txHash);
    if (!receipt) continue;
    if (receipt.contractAddress || receipt.gasUsed) mined = true;
  }

  //Oh no something bad happened, best let the user know
  if (receipt.failed) {
    status.sendMessage(
      "Oh no something didn't quite work as it should have, please try again!"
    );
  }
  return receipt;
}

/*
  Local Storage getters
*/
function isFirstUse(defValue) {
  var result = localStorage.getItem("user_first_use");
  if (result == null) {
    return defValue;
  }
  return result;
}

function getUsersAlias() {
  return localStorage.getItem("users_alias");
}

function getUnconfName() {
  return localStorage.getItem("event_name");
}

function getUnconfAddress() {
  return localStorage.getItem("event_address");
}

/*
 Local Storage setters
*/
function setFirstUse(firstUse) {
  return localStorage.setItem("user_first_use", firstUse);
}

function setUsersAlias(alias) {
  return localStorage.setItem("users_alias", alias);
}

function setEventName(eventName) {
  return localStorage.setItem("event_name", eventName);
}

function setEventAddress(eventAddress) {
  return localStorage.setItem("event_address", eventAddress);
}

/*
 Convenience functions
*/
function getUsersAddress() {
  return web3.eth.accounts[0];
}

function isNullAddress(address) {
  var nullAddress = "0x0000000000000000000000000000000000000000";
  return address == nullAddress;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function prettyPrintCommand(command) {
  return "*/" + command + "*";
}

function checkUserIsRegestered() {
  if (getUnconfAddress() == null) {
    status.sendMessage(
      "Sorry but you'll need to register for an unconference before you can do that"
    );
    return false;
  }

  return true;
}

/*
  Suggestions!
*/
function suggestionsContainerStyle(suggestionsCount) {
  return {
    marginVertical: 1,
    marginHorizontal: 0,
    keyboardShouldPersistTaps: "always",
    height: Math.min(150, 56 * suggestionsCount),
    backgroundColor: "white",
    borderRadius: 5,
    flexGrow: 1
  };
}
var suggestionSubContainerStyle = {
  height: 56,
  justifyContent: "center",
  padding: 20,
  borderBottomWidth: 1,
  borderBottomColor: "#0000001f"
};

var valueStyle = {
  marginTop: 9,
  fontSize: 14,
  fontFamily: "font",
  color: "#000000de"
};

function topicsSuggestions() {
  var contractAddress = getUnconfAddress();

  // initiate contract for an address
  var unConfContractInstance = UnConfContract.at(contractAddress);

  // call constant function
  var topics = unConfContractInstance.listTopics();

  return showSuggestions(topics.split("\n"));
}

function unconfsSuggestions() {
  // initiate contract for an address
  var factoryContractInstance = FactoryContract.at(factoryAddress);

  var unconferences = factoryContractInstance.listUnconferences();

  return showSuggestions(unconferences.split("\n"));
}

function showSuggestions(array) {
  var suggestions = array.map(function(entry, index) {
    return status.components.touchable(
      {
        onPress: status.components.dispatch([
          status.events.SET_COMMAND_ARGUMENT,
          [index, entry]
        ])
      },
      status.components.view(suggestionsContainerStyle, [
        status.components.view(suggestionSubContainerStyle, [
          status.components.text({ style: valueStyle }, entry)
        ])
      ])
    );
  });

  // Let's wrap those two touchable buttons in a scrollView
  var view = status.components.scrollView(
    suggestionsContainerStyle(2),
    suggestions
  );

  // Give back the whole thing inside an object.
  return { markup: view };
}
