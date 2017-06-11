//Remove bogus website
//Contract verification

var RegistryABI = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"registrars","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_registrarType","type":"uint8"}],"name":"getDetail","outputs":[{"name":"detail","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_registrarType","type":"string"},{"name":"_registrarDetail","type":"string"},{"name":"_registrar","type":"address"}],"name":"createRegistrar","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_registrarType","type":"uint8"}],"name":"getCost","outputs":[{"name":"cost","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"registrarDetails","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"bytes32"},{"name":"_addr","type":"address"},{"name":"_result","type":"string"},{"name":"_message","type":"string"}],"name":"error","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"},{"name":"_registrarType","type":"uint8"}],"name":"lookupName","outputs":[{"name":"addr","type":"address"},{"name":"proof","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"registrarTypes","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"bytes32"},{"name":"_name","type":"string"},{"name":"_addr","type":"address"},{"name":"_proof","type":"string"}],"name":"update","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"},{"name":"_registrarType","type":"uint8"}],"name":"lookupAddr","outputs":[{"name":"name","type":"string"},{"name":"proof","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_proof","type":"string"},{"name":"_addr","type":"address"},{"name":"_registrarType","type":"uint8"}],"name":"register","outputs":[{"name":"oracleId","type":"bytes32"}],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_addr","type":"address"},{"indexed":false,"name":"_registrarName","type":"string"},{"indexed":false,"name":"_registrar","type":"address"},{"indexed":false,"name":"_registrarType","type":"uint8"}],"name":"RegistrarUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_addr","type":"address"},{"indexed":false,"name":"_proof","type":"string"},{"indexed":false,"name":"_id","type":"bytes32"},{"indexed":false,"name":"_registrarType","type":"uint8"}],"name":"RegistrationSent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_addr","type":"address"},{"indexed":false,"name":"_name","type":"string"},{"indexed":false,"name":"_proof","type":"string"},{"indexed":false,"name":"_id","type":"bytes32"},{"indexed":false,"name":"_registrarType","type":"uint8"}],"name":"NameAddressProofRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_addr","type":"address"},{"indexed":false,"name":"_id","type":"bytes32"},{"indexed":false,"name":"_result","type":"string"},{"indexed":false,"name":"_registrarType","type":"uint8"},{"indexed":false,"name":"_message","type":"string"}],"name":"RegistrarError","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_addr","type":"address"},{"indexed":false,"name":"_mismatchedAddr","type":"address"},{"indexed":false,"name":"_registrarType","type":"uint8"},{"indexed":false,"name":"_message","type":"string"}],"name":"AddressMismatch","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_addr","type":"address"},{"indexed":false,"name":"_funds","type":"uint256"},{"indexed":false,"name":"_cost","type":"uint256"},{"indexed":false,"name":"_registrarType","type":"uint8"},{"indexed":false,"name":"_message","type":"string"}],"name":"InsufficientFunds","type":"event"}];
var RegistryAddress = "0x195647cca7be636e03eee0af20b21745d06d7d12";
var RegistryContract = web3.eth.contract(RegistryABI);
var Registry = RegistryContract.at(RegistryAddress);

function suggestionsContainerStyle(suggestionsCount) {
    return {
        marginVertical: 1,
        marginHorizontal: 0,
        keyboardShouldPersistTaps: "always",
        height: Math.min(150, (56 * suggestionsCount)),
        backgroundColor: "white",
        borderRadius: 5,
        flexGrow: 1
    };
}

var suggestionContainerStyle = {
    paddingLeft: 16,
    backgroundColor: "white"
};

var suggestionSubContainerStyle = {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#0000001f"
};

var valueStyle = {
    marginTop: 9,
    fontSize: 14,
    fontFamily: "font",
    color: "#000000de"
};

var registrars = [
    {
        name: "Reddit",
        enum: "0"
    },
    {
        name: "Github",
        enum: "1"
    },
    {
        name: "Twitter",
        enum: "2"
    }
];

function registrarSuggestions(params) {
    var suggestions = registrars.map(function (entry) {
        return status.components.touchable(
            {onPress: status.components.dispatch([status.events.SET_COMMAND_ARGUMENT, [0, entry.name]])},
            status.components.view(
                suggestionContainerStyle,
                [status.components.view(
                    suggestionSubContainerStyle,
                    [
                        status.components.text(
                            {style: valueStyle},
                            entry.name
                        )
                    ]
                )]
            )
        );
    });

    var view = status.components.scrollView(
        suggestionsContainerStyle(registrars.length),
        suggestions
    );

    return {markup: view};
}

function registrarEnum(registrarName) {
  var noRegistrars = registrars.length;
  for (var i = 0; i <  noRegistrars; i++) {
    if (registrarName == registrars[i].name) {
      return registrars[i].enum;
    }
  }
  return -1;
}

function wrapStatusWithRequest(updateText, registrarType) {
  return {
    "text-message": {
      type: "request",
      content: {
          command: "latestUpdate",
          params: {registrar: registrarType, update: updateText},
          text: updateText
      }
    }
  };
}

function validateParams(params, context) {
  if (params.hasOwnProperty("registrar")) {
    if (registrarEnum(params.registrar) < 0) {
      return {
        markup: status.components.validationMessage(
          "Unrecognised Registrar",
          "Please select from suggestions"
        )
      };
    }
  }
  if (params.hasOwnProperty("addr")) {
    if (!web3.isAddress(params.addr)) {
      return {
        markup: status.components.validationMessage(
          "Unrecognised Address",
          "Please enter valid address"
        )
      };
    }
  }
}

function postProofUrl(registrarType) {
  if (registrarType == "Reddit") {
    return "https://www.reddit.com/r/ethereumproofs/submit?selftext=true&title=" + web3.eth.accounts[0];
  }
  if (registrarType == "Github") {
    return "https://gist.github.com/";
  }
  if (registrarType == "Twitter") {
    return "https://twitter.com/share?text=" + web3.eth.accounts[0];
  }
  return "Error";
}

function proofToUrl(proof, account, handle, registrarType) {
  if (registrarType == "Reddit") {
    return "https://www.reddit.com/r/ethereumproofs/comments/" + proof + "/0x92ba5a183563dfdce067492bd420057e43c37edb/";
  }
  if (registrarType == "Github") {
    return "https://gist.github.com/" + handle + "/" + proof;
  }
  if (registrarType == "Twitter") {
    return "https://twitter.com/search?l=&q=" + account + "%20from%3A" + proof;
  }
  return "Error";
}

status.addListener("init", function (params, context) {
  status.sendMessage("Hello - I'm your friendly neighbourhood RegisterEthBot!");
  status.sendMessage("You can use me to provably and trustlessly associate your Ethereum address with various social media handles.");
  status.sendMessage("Although I don't charge any fees, there is a charge from http://oraclize.it in order to verify your identity off-chain.");
  status.sendMessage("Use /details to see more details on how to register, or go to https://github.com/adamdossa/RegisterEthBot for even more detail!");
});

function nameToAddress(params) {
  try {
    var result = Registry.lookupName.call(params.name, registrarEnum(params.registrar));
    if (result[0] == 0) {
      return {"text-message": params.name + " is not registered"};
    }
  } catch (err) {
    return {"text-message": "Error: " + err.message};
  }
  return {"text-message": "Handle of " + params.name + " was registered in " + params.registrar + " as " + result[0] + " with proof-of-handle \"" + result[1] + "\".\n" + proofToUrl(result[1], result[0], params.name, params.registrar)};

}

var nameToAddress = {
  name: "nameToAddress",
  icon: "money_white",
  color: "#5fc48d",
  title: "Get Address from Name",
  description: "Find Ethereum address for social media handle",
  sequentialParams: true,
  params: [
    {
      name: "registrar",
      type: status.types.TEXT,
      suggestions: registrarSuggestions,
      placeholder: "Registrar"
    },{
      name: "name",
      type: status.types.TEXT,
      placeholder: "Handle"
    }
  ],
  preview: function (params) {
    return {
        markup: status.components.text(
            {},
            params.registrar + ": Who is " + params.name + "?"
        )
    };
  },
  handler: nameToAddress,
  validator: validateParams
};

status.command(nameToAddress);

function addressToName(params) {
  try {
    var result = Registry.lookupAddr.call(params.addr, registrarEnum(params.registrar));
    if (result[0] == '') {
      return {"text-message": params.addr + " is not registered"};
    }
  } catch (err) {
    return {"text-message": "Error: " + err.message};
  }
  return {"text-message": "Handle of " + params.addr + " was registered in " + params.registrar + " as " + result[0] + " with proof-of-handle \"" + result[1] + "\".\n" + proofToUrl(result[1], params.addr, result[0], params.registrar)};
}

var addressToName = {
  name: "addressToName",
  icon: "money_white",
  color: "#5fc48d",
  title: "Get Name from Address",
  description: "Find handle for Ethereum address",
  sequentialParams: true,
  params: [
    {
      name: "registrar",
      type: status.types.TEXT,
      suggestions: registrarSuggestions,
      placeholder: "Registrar"
    }, {
      name: "addr",
      type: status.types.NUMBER,
      placeholder: "Address"
    }
  ],
  preview: function (params) {
    return {
        markup: status.components.text(
            {},
            params.registrar + ": Who is " + params.addr + "?"
        )
    };
  },
  handler: addressToName,
  validator: validateParams
};

status.command(addressToName);

function register(params) {
  try {
    var gasCost = Registry.getCost.call(registrarEnum(params.registrar));
    var result = Registry.register.sendTransaction(params.proof, web3.eth.accounts[0], registrarEnum(params.registrar), {from: web3.eth.accounts[0], value: gasCost});
    return wrapStatusWithRequest("Proof-of-handle \"" + params.proof + "\" has been shipped to the " + params.registrar + " Oraclize contract for validation!\n\nPlease be patient, this may take several minutes!\n\nClick to see latest update.", params.registrar);
  } catch (err) {
    return {"text-message": "Error: " + err.message};
  }
}

var register = {
  name: "register",
  icon: "money_white",
  color: "#5fc48d",
  title: "Register Name",
  description: "Link Ethereum account to social media handle",
  sequentialParams: true,
  params: [
    {
      name: "registrar",
      type: status.types.TEXT,
      suggestions: registrarSuggestions,
      placeholder: "Registrar"
    },{
      name: "proof",
      type: status.types.TEXT,
      placeholder: "Proof-Of-Handle"
    }
  ],
  preview: function (params) {
    return {
        markup: status.components.text(
            {},
            "Register me at " + params.registrar + " with proof-of-handle \"" + params.proof + "\"."
        )
    };
  },
  handler: register,
  validator: validateParams
};
status.command(register);

function whoAmI(params) {
  try {
    var events = Registry.allEvents(function(error, event){
      if (!error) {
        console.log(event);
      } else {
        console.log(error);
      }
    });
    var result = Registry.lookupAddr.call(web3.eth.accounts[0], registrarEnum(params.registrar));
    if (result[0] == 0) {
      return {"text-message": "You're not registered!"};
    }
  } catch (err) {
    return {"text-message": "Error: " + err.message};
  }
  return {"text-message": "You are " + result[0] + "!"};
}

var whoAmI = {
  name: "whoAmI",
  icon: "money_white",
  color: "#5fc48d",
  title: "Who Am I",
  description: "Look in the mirror...",
  params: [
    {
      name: "registrar",
      type: status.types.TEXT,
      suggestions: registrarSuggestions,
      placeholder: "Registrar"
    }
  ],
  preview: function (params) {
    return {
        markup: status.components.text(
            {},
            "Who am I at " + params.registrar + "?"
        )
    };
  },
  validator: validateParams,
  handler: whoAmI
};

status.command(whoAmI);

function details(params) {
  try {
    var result = Registry.getDetail.call(registrarEnum(params.registrar));
  } catch (err) {
    return {"text-message": "Error: " + err.message};
  }
  // return {"text-message": "Details for " + params.registrar + " are\n\n" + result + "\nClick " + postProofUrl(params.registrar) + " to create your proof-of-handle, then come back and use */register* to register!"};
  return {"text-message": "Details for " + params.registrar + " are\n\n" + result + "\nClick " + postProofUrl(params.registrar) + " to create your proof-of-handle, then come back and use /register to register!"};
}

var details = {
  name: "details",
  icon: "money_white",
  color: "#5fc48d",
  title: "Registrar Details",
  description: "Get Registrar Details",
  params: [
    {
      name: "registrar",
      type: status.types.TEXT,
      suggestions: registrarSuggestions,
      placeholder: "Registrar"
    }
  ],
  preview: function (params) {
    return {
        markup: status.components.text(
            {},
            "How do I register at " + params.registrar + "?"
        )
    };
  },
  validator: validateParams,
  handler: details
};

status.command(details);

function latestUpdate(params) {
  try {
    var events = Registry.allEvents({fromBlock: web3.eth.blockNumber - 500});
    var allEvents = events.get();
    var noEvents = true;

    for (var i = 0; i < allEvents.length; i++) {
      if (allEvents[i].hasOwnProperty("args")) {
        if ((allEvents[i].args['_addr'] == web3.eth.accounts[0]) && (allEvents[i].args['_registrarType'] == registrarEnum(params.registrar))) {
          var latestEvent = allEvents[i];
          noEvents = false;
        }
      }
    }
    if (noEvents) {
      return wrapStatusWithRequest("You don't have any recent updates!\n\nClick to refresh!", params.registrar)
    }
    if ((latestEvent.event == "RegistrarError") || (latestEvent.event == "AddressMismatch") ||  (latestEvent.event == "InsufficientFunds")) {
      return {"text-message": "Oh dear - we failed to verify your proof-of-handle!\n\nThe error was " + latestEvent.event + " - " + latestEvent.args['_message'] + "."};
    }
    if (latestEvent.event == "NameAddressProofRegistered") {
      return {"text-message": "Your latest update from " + params.registrar + " is\n" + latestEvent.event + "."};
    }
    return wrapStatusWithRequest("Your latest update from " + params.registrar + " is\n" + latestEvent.event + ".\n\nClick to refresh!", params.registrar);
  } catch (err) {
    return {"text-message": "Error: " + err.message};
  }
}

var latestUpdate = {
  name: "latestUpdate",
  icon: "money_white",
  color: "#5fc48d",
  title: "Registration Update",
  description: "Get latest registration update",
  params: [
    {
      name: "registrar",
      type: status.types.TEXT,
      suggestions: registrarSuggestions,
      placeholder: "Registrar"
    }
  ],
  preview: function (params) {
    //The below is a workaround for the issue where if an action is intiialized using
    //both status.command & status.response, then it will always display using its preview
    //whether issued as command or request.
    //When issued as a request we want it to display the text that was set in the requst params by the
    //function that initiated the request (as happens when an action is only registered using status.response)
    if (params.hasOwnProperty("update")) {
      return {
          markup: status.components.text(
              {},
              params.update
          )
      };
    } else {
      return {
          markup: status.components.text(
              {},
              "What's the latest update on my registration at " + params.registrar + "?"
          )
      };
    }
  },
  handler: latestUpdate
};

status.command(latestUpdate);
status.response(latestUpdate);
