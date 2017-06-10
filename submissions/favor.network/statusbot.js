// Copyright (C) 2017 Péter Szilágyi - All Rights Reserved.
//
// This file is part of the `favor.network` Status IM hackathon entry. Source code
// is provided solely for judging purposes, without any explicit or implied waiver
// of rights or allowance of reuse in whole or in part.

// favornetAddress is the Favor Network's contract address deployed on the Ropsten
// test network.
var favornetAddress = "0xd1ee90c67ab3cedd911773b193617b6ecac6bf7a";

// favornetABI is the Favor Network's contract ABI to allow user interaction and
// data queries.
var favornetABI = [{"constant":false,"inputs":[{"name":"index","type":"uint256"},{"name":"id","type":"uint256"}],"name":"dropRequest","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getRequestCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"reqIdx","type":"uint256"},{"name":"reqId","type":"uint256"},{"name":"promIdx","type":"uint256"}],"name":"honourRequest","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"index","type":"uint256"},{"name":"id","type":"uint256"}],"name":"dropPromise","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"getRequest","outputs":[{"name":"from","type":"address"},{"name":"favor","type":"string"},{"name":"bound","type":"bool"},{"name":"reward","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"},{"name":"index","type":"uint256"}],"name":"getPromiseAt","outputs":[{"name":"id","type":"uint256"},{"name":"owner","type":"address"},{"name":"from","type":"address"},{"name":"favor","type":"string"},{"name":"offered","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"},{"name":"index","type":"uint256"}],"name":"getRequestAt","outputs":[{"name":"id","type":"uint256"},{"name":"from","type":"address"},{"name":"favor","type":"string"},{"name":"bound","type":"bool"},{"name":"reward","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"favor","type":"string"},{"name":"reward","type":"uint256"}],"name":"makeRequest","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getPromiseCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"getPromise","outputs":[{"name":"owner","type":"address"},{"name":"from","type":"address"},{"name":"favor","type":"string"},{"name":"offered","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"index","type":"uint256"},{"name":"id","type":"uint256"}],"name":"acceptRequest","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}];

// favornet is a live contract interface into the Favor Network.
var favornet = web3.eth.contract(favornetABI).at(favornetAddress);

// suggestionsContainerStyle is a simple style to make displaying suggestions
// nicer.
function suggestionsContainerStyle(count) {
  return {
    marginVertical: 1,
    marginHorizontal: 0,
    keyboardShouldPersistTaps: "always",
    height: Math.min(150, (56 * count)),
    backgroundColor: "white",
    borderRadius: 5,
    flexGrow: 1
  };
}

// prettyRequest formats a favor request so it's displayed in a pleasant way
// when the chatbot sends it to the user.
var prettyRequest = function(request, accept) {
  // Format the favor reward (either a new promise or an existing pledge)
  var reward = " a *new promise* to return the favor";
  if (request[4] != 0) {
    // An existing pledge was offered as a reward, gather its details
    var promise = favornet.getPromise(request[4]);
    reward = "\n\n~" + promise[2] + "~\n\nfrom *" + promise[1].substring(0, 8) + "…" + promise[1].substring(36, 42) + "*";
  }
  // Format the request along with the above reward
  var meta = " for";
  if (accept) {
    meta = "";
  }
  return "*" + request[1].substring(0, 8) + "…" + request[1].substring(36, 42) + "*" + meta + "\n\n~" + request[2] + "~\n\nin exchange for" + reward + ".";
}

// The init listener simply pushes some nice messages to the user to make the
// whole experience a bit friendlier.
status.addListener("init", function (params, context) {
  status.sendMessage("~\"Those who want respect, give respect\"~ ~Tony Soprano");
  status.sendMessage("Never forget a favor; and never break a promise. Reputation is above all. We'll make sure of it!");
  status.sendMessage("I can list the favors you */asked* from others and those */owed* to you by others.");
});

// The asking command lists all currently open favor requests asked by the user
// from others. They may already be accepted, or just under consideration.
status.command({
  name: "asked",
  title: "Favors Asked",
  description: "Lists the favors asked from others",
  color: "#2c3e50",
  preview: function (params, context) {
    var text = status.components.text({}, "Am I asking anyone favors?");
    return {markup: status.components.view({}, [text])};
  },
  handler: function (params, context) {
    // Get the number of requests and bail if none can be found
    var requests = favornet.getRequestCount("0x" + context.from);
    if (requests == 0) {
      status.sendMessage("You are not asking anyone favors. Good for you!");
      return;
    }
    // Yup, favors everywhere
    for (var i = 0; i < requests; i++) {
      var request = favornet.getRequestAt("0x" + context.from, i);
      var state = "They have *not accepted* the favor request yet so you may still */drop* it."
      if (request[3]) {
        state = "They have *accepted* the favor request, please */honour* it."
      }
      status.sendMessage("Asked " + prettyRequest(request, false) + "\n\n" + state);
    }
  }
});

// The owed command lists all favors currently promised by others to the user.
// The favor promises may already be offered as a reward to some user request.
status.command({
  name: "owed",
  title: "Favors Owed",
  description: "Lists the favors owed by others",
  color: "#2c3e50",
  preview: function (params, context) {
    var text = status.components.text({}, "Is anyone owing me favors?");
    return {markup: status.components.view({}, [text])};
  },
  handler: function (params, context) {
    // Get the number of requests and bail if none can be found
    var promises = favornet.getPromiseCount("0x" + context.from);
    if (promises == 0) {
      status.sendMessage("Nope! Perhaps you should help people a bit and earn some?");
      return;
    }
    // Yup, favors everywhere
    for (var i = 0; i < promises; i++) {
      var promise = favornet.getPromiseAt("0x" + context.from, i);
      var state = "You have *not offered* this favor to anyone, so you may */drop* it."
      if (promise[4]) {
        state = "You have *offered* this favor to someone in a request, so you cannot touch it."
      }
      status.sendMessage("Owed by *" + promise[2].substring(0, 8) + "…" + promise[2].substring(36, 42) + "*: \n\n~" + promise[3] + "~\n\n" + state);
    }
  }
});

// The requests command list all of my currently open favor requests.
status.command({
  name: "drop",
  title: "Drop Item",
  description: "Drops a request or a promise",
  fullscreen: true,
  color: "#2c3e50",
  params: [{
    name: "id",
    type: status.types.TEXT,
    placeholder: "Request or promise ID to drop"
    suggestions: dropSuggestions,
  }]
  preview: function (params, context) {
    var text = status.components.text({}, "Please drop favor #" + params.id);
    return {markup: status.components.view({}, [text])};
  },
  handler: function (params, context) {
    // Find the request of the given ID and issue a transaction to drop it
    var requests = favornet.getRequestCount("0x" + context.from);
    for (var i = 0; i < requests; i++) {
      var request = favornet.getRequestAt("0x" + context.from, i);
      if (request[0] == params.id) {
        favornet.dropRequest.sendTransaction(i, params.id, {from: context.from}, function (error, hash) {
          if (error) {
            status.sendMessage("Favor request drop denied due to ~" + error + "~.");
          } else {
            status.sendMessage("Dropping favor request asked of " + prettyRequest(request, false));
            status.sendMessage("https://ropsten.etherscan.io/tx/" + hash)
          }
        });
        return;
      }
    }
    // Find the promise of the given ID and issue a transaction to drop it
    var promises = favornet.getPromiseCount("0x" + context.from);
    for (var i = 0; i < promises; i++) {
      var promise = favornet.getPromiseAt("0x" + context.from, i);
      if (promise[0] == params.id) {
        favornet.dropPromise.sendTransaction(i, params.id, {from: context.from}, function (error, hash) {
          if (error) {
            status.sendMessage("Favor promise drop denied due to ~" + error + "~.");
          } else {
            status.sendMessage("Dropping favor promise owed by *" + promise[2].substring(0, 8) + "…" + promise[2].substring(36, 42) + "* for: \n\n~" + promise[3] + "~")
            status.sendMessage("https://ropsten.etherscan.io/tx/" + hash)
          }
        });
        return;
      }
    }
    // Something went wrong, notify the user
    status.sendMessage("Could not find a favor request or promise with that id number.");
  }
});

// dropSuggestions pre-fills the suggestion box with unaccepted favor requests
// that the user may drop out of the block-chain.
function dropSuggestions(params, context) {
  // Find all the droppable favor requests
  var requests = favornet.getRequestCount("0x" + context.from);

  var droppable = [];
  for (var i = 0; i < requests; i++) {
    var request = favornet.getRequestAt("0x" + context.from, i);
    if (!request[3]) {
      droppable.push(request);
    }
  }
  // Flatten the droppable favor requests into suggestions
  var suggestions = [];

  for (var i = 0; i < droppable.length; i++) {
    var entry = [
      status.components.text({style: {marginBottom: 4, color: "#000", textDecorationLine: "underline"}}, "Drop favor request asked of " + droppable[i][1].substring(0, 8) + "…" + droppable[i][1].substring(36, 42)),
      status.components.text({style: {marginBottom: 4, color: "#000", fontStyle: "italic"}}, droppable[i][2]),
    ];
    if (droppable[i][4] == 0) {
      entry.push(status.components.text({style: {color: "#000"}}, "In exchange for a new promise to return the favor."));
    } else {
      var promise = favornet.getPromise(droppable[i][4]);
      entry.push(status.components.text({style: {marginBottom: 4, color: "#000"}}, "In exchange for a promise from " + promise[1].substring(0, 8) + "…" + promise[1].substring(36, 42)));
      entry.push(status.components.text({style: {color: "#000", fontStyle: "italic"}}, promise[2]));
    }
    suggestions.push(status.components.touchable(
      {onPress: status.components.dispatch([status.events.SET_COMMAND_ARGUMENT, [0, droppable[i][0]]])},
      status.components.view(
        suggestionsContainerStyle,
        [status.components.view(
          {borderWidth: 1, borderColor: "#0000001f", borderRadius: 4, margin: 4, padding: 4}, entry
        )]
      )
    ));
  }
  // Find all the droppable favor promises
  var promises = favornet.getPromiseCount("0x" + context.from);

  droppable = [];
  for (var i = 0; i < promises; i++) {
    var promise = favornet.getPromiseAt("0x" + context.from, i);
    if (!promise[4]) {
      droppable.push(promise);
    }
  }
  // Flatten the droppable favor promises into suggestions
  for (var i = 0; i < droppable.length; i++) {
    suggestions.push(status.components.touchable(
      {onPress: status.components.dispatch([status.events.SET_COMMAND_ARGUMENT, [0, droppable[i][0]]])},
      status.components.view(
        suggestionsContainerStyle,
        [status.components.view(
          {borderWidth: 1, borderColor: "#0000001f", borderRadius: 4, margin: 4, padding: 4},
          [
            status.components.text({style: {marginBottom: 4, color: "#000", textDecorationLine: "underline"}}, "Drop favor promise from " + droppable[i][2].substring(0, 8) + "…" + droppable[i][2].substring(36, 42)),
            status.components.text({style: {color: "#000", fontStyle: "italic"}}, droppable[i][3]),
          ]
        )]
      )
    ));
  }
  // Give back the whole thing inside an object.
  return {markup: status.components.scrollView(suggestionsContainerStyle(suggestions.length), suggestions)};
}

// The requests command list all of my currently open favor requests.
status.command({
  name: "honour",
  title: "Honour",
  description: "Honours an accepted favor request",
  color: "#2c3e50",
  params: [{
    name: "id",
    type: status.types.TEXT,
    placeholder: "Request-reward ID to honour"
    suggestions: honourSuggestions,
  }]
  preview: function (params, context) {
    var text = status.components.text({}, "Please honour request #" + params.id);
    return {markup: status.components.view({}, [text])};
  },
  handler: function (params, context) {
    // Find the request of the given ID to allow honouring it
    var requests = favornet.getRequestCount("0x" + context.from);
    for (var i = 0; i < requests; i++) {
      var request = favornet.getRequestAt("0x" + context.from, i);
      if (request[0] == params.id) {
        // Request found, find the reward index if existing one
        var index = 0;
        if (request[4] != 0) {
          var promises = favornet.getPromiseCount("0x" + context.from);
          for (var j = 0; j < promises; j++) {
            var promise = favornet.getPromiseAt("0x" + context.from, j);
            if (promise[0] == request[4]) {
              index = j;
              break;
            }
          }
        }
        favornet.honourRequest.sendTransaction(i, params.id, index, {from: context.from}, function (error, hash) {
          if (error) {
            status.sendMessage("Favor request honour denied due to ~" + error + "~.");
          } else {
            status.sendMessage("Honouring favor requested from " + prettyRequest(request, false));
            status.sendMessage("https://ropsten.etherscan.io/tx/" + hash);
          }
        });
        break;
      }
    }
  }
});

// honourSuggestions pre-fills the suggestion box with accepted favor requests
// that the user may honour with a promise.
function honourSuggestions(params, context) {
  // Find all the honourable favor requests
  var requests = favornet.getRequestCount("0x" + context.from);

  var honourable = [];
  for (var i = 0; i < requests; i++) {
    var request = favornet.getRequestAt("0x" + context.from, i);
    if (request[3]) {
      honourable.push(request);
    }
  }
  // Render all the requests into a tapable list
  var suggestions = [];
  for (var i = 0; i < honourable.length; i++) {
    var entry = [
      status.components.text({style: {marginBottom: 4, color: "#000", textDecorationLine: "underline"}}, "Honour favor requested from " + honourable[i][1].substring(0, 8) + "…" + honourable[i][1].substring(36, 42)),
      status.components.text({style: {marginBottom: 4, color: "#000", fontStyle: "italic"}}, honourable[i][2]),
    ];
    if (honourable[i][4] == 0) {
      entry.push(status.components.text({style: {color: "#000"}}, "In exchange for a new promise to return the favor."));
    } else {
      var promise = favornet.getPromise(honourable[i][4]);
      entry.push(status.components.text({style: {marginBottom: 4, color: "#000"}}, "In exchange for a promise from " + promise[1].substring(0, 8) + "…" + promise[1].substring(36, 42)));
      entry.push(status.components.text({style: {color: "#000", fontStyle: "italic"}}, promise[2]));
    }
    suggestions.push(status.components.touchable(
      {onPress: status.components.dispatch([status.events.SET_COMMAND_ARGUMENT, [0, honourable[i][0]]])},
      status.components.view(
        suggestionsContainerStyle,
        [status.components.view(
          {borderWidth: 1, borderColor: "#0000001f", borderRadius: 4, margin: 4, padding: 4}, entry
        )]
      )
    ));
  }
  // Give back the whole thing inside an object.
  return {markup: status.components.scrollView(suggestionsContainerStyle(suggestions.length), suggestions)};
}

// The global command contains the all the different transactional interactions.
status.command({
  name: "global",
  title: "Favor Network",
  description: "Request, accept and fulfill favors",
  color: "#2c3e50",
  params: [
    {
      name: "action",
      type: status.types.TEXT,
      suggestions: globalSuggestions,
    },
    {
      name: "favor",
      type: status.types.TEXT,
      placeholder: "Favor you would like to ask"
    }
  ]
  sequentialParams: true,
  preview: function (params, context) {
    // If we're asking for a favor, display it and return
    if (params.action == "ask" || params.action.indexOf("offer-") === 0) {
      return {markup: status.components.view({}, [status.components.text({}, "Requesting favor: " + params.favor)])};
    }
    // Apparently we're accepting a favor request, find it's index and bind
    var id = params.action.substring(7);

    return {markup: status.components.view({}, [status.components.text({}, "Accepting favor request: " + favornet.getRequest(id)[1])])};
  },
  handler: function (params, context) {
    // If we're asking for a favor, inject and return
    if (params.action == "ask" || params.action.indexOf("offer-") === 0) {
      var reward = 0;
      if (params.action.indexOf("offer-") === 0) {
        reward = params.action.substring(6);
      }
      favornet.makeRequest.sendTransaction("0x" + context.to, params.favor, reward, {from: context.from}, function (error, hash) {
        if (error) {
          status.sendMessage("Favor request denied due to ~" + error + "~.");
        } else {
          var request = [0, "0x" + context.to, params.favor, false, reward];
          status.sendMessage("Asked " + prettyRequest(request, false));
          status.sendMessage("https://ropsten.etherscan.io/tx/" + hash)
        }
      });
      return;
    }
    // Apparently we're accepting a favor request, find it's index and bind
    var id = params.action.substring(7);

    var requests = favornet.getRequestCount("0x" + context.to);
    for (var i = 0; i < requests; i++) {
      var request = favornet.getRequestAt("0x" + context.to, i);
      if (request[0] == id) {
        favornet.acceptRequest.sendTransaction("0x" + context.to, i, id, {from: context.from}, function (error, hash) {
          if (error) {
            status.sendMessage("Favor request acceptance denied due to ~" + error + "~.");
          } else {
            request[1] = "0x" + context.to;
            status.sendMessage("Accepted " + prettyRequest(request, true));
            status.sendMessage("https://ropsten.etherscan.io/tx/" + hash);
          }
        });
        return;
      }
    }
  }
});

// globalSuggestions pre-fills the suggestion box with a few global actions that
// the user can do with the chat box, namely asking for a new favor or accepting
// a favor request.
function globalSuggestions(params, context) {
  // Find all the acceptable favor requests
  var requests = favornet.getRequestCount("0x" + context.to);

  var acceptable = [];
  for (var i = 0; i < requests; i++) {
    var request = favornet.getRequestAt("0x" + context.to, i);
    if (!request[3] && request[1] == "0x" + context.from) {
      acceptable.push(request);
    }
  }
  // Flatten the acceptable favor requests into suggestions
  var suggestions = [];

  for (var i = 0; i < acceptable.length; i++) {
    var entry = [
      status.components.text({style: {marginBottom: 4, color: "#000", textDecorationLine: "underline"}}, "Accept favor request"),
      status.components.text({style: {marginBottom: 4, color: "#000", fontStyle: "italic"}}, acceptable[i][2]),
    ];
    if (acceptable[i][4] == 0) {
      entry.push(status.components.text({style: {color: "#000"}}, "In exchange for a new promise to return the favor."));
    } else {
      var promise = favornet.getPromise(acceptable[i][4]);
      entry.push(status.components.text({style: {marginBottom: 4, color: "#000"}}, "In exchange for a promise from " + promise[1].substring(0, 8) + "…" + promise[1].substring(36, 42)));
      entry.push(status.components.text({style: {color: "#000", fontStyle: "italic"}}, promise[2]));
    }
    suggestions.push(status.components.touchable(
      {onPress: status.components.dispatch([status.events.SET_COMMAND_ARGUMENT, [0, "accept-" + acceptable[i][0]]])},
      status.components.view(
        suggestionsContainerStyle,
        [status.components.view(
          {borderWidth: 1, borderColor: "#0000001f", borderRadius: 4, margin: 4, padding: 4}, entry
        )]
      )
    ));
  }
  // Suggest asking for a favor, making a new promise to repay
  suggestions.push(status.components.touchable(
    {onPress: status.components.dispatch([status.events.SET_COMMAND_ARGUMENT, [0, "ask"]])},
    status.components.view(
      suggestionsContainerStyle,
      [status.components.view(
        {borderWidth: 1, borderColor: "#0000001f", borderRadius: 4, margin: 4, padding: 4},
        [status.components.text({style: {color: "#000"}}, "Request favor and promise to return it yourself")]
      )]
    )
  ));
  // Find all the giftable favor promises
  var promises = favornet.getPromiseCount("0x" + context.from);

  var giftable = [];
  for (var i = 0; i < promises; i++) {
    var promise = favornet.getPromiseAt("0x" + context.from, i);
    if (!promise[4]) {
      giftable.push(promise);
    }
  }
  // Flatten the giftable favor promises into suggestions
  for (var i = 0; i < giftable.length; i++) {
    suggestions.push(status.components.touchable(
      {onPress: status.components.dispatch([status.events.SET_COMMAND_ARGUMENT, [0, "offer-" + giftable[i][0]]])},
      status.components.view(
        suggestionsContainerStyle,
        [status.components.view(
          {borderWidth: 1, borderColor: "#0000001f", borderRadius: 4, margin: 4, padding: 4},
          [
            status.components.text({style: {marginBottom: 4, color: "#000", textDecorationLine: "underline"}}, "Request favor and reward promise from " + giftable[i][2].substring(0, 8) + "…" + giftable[i][2].substring(36, 42)),
            status.components.text({style: {color: "#000", fontStyle: "italic"}}, giftable[i][3]),
          ]
        )]
      )
    ));
  }
  // Give back the whole thing inside an object.
  return {markup: status.components.scrollView(suggestionsContainerStyle(suggestions.length), suggestions)};
}
