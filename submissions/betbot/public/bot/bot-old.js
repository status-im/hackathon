

status.addListener("init", function () {
  return {"text-message": "Welcome to Genesis Token Tracker. ʕ•͡ᴥ•ʔ"};
});

var usersIndex = 0

function browse(screenNum, params){
  var host = 'http://localhost:3000/'
  // var host = 'http://genesis-token-tracker.s3-website-us-west-2.amazonaws.com/'
  var url = host + '#junk&' + usersIndex + '&' + screenNum
  // var url = host + '#junk&' + usersIndex + '&'
  console.log('this is the brows log...')
  return {
          title: "Browser",
          dynamicTitle: true,
          singleLineInput: true,
          actions: [ { type: status.actions.FULLSCREEN } ],
          markup: status.components.bridgedWebView(url)
  };
}

//TODO return to the chat bot. STRETCH
status.command({
      name: "myGroups",
      title: 'list all groups that you are part of',
      description: 'List all groups that you are part of',
      fullscreen: true,
      onSend: function(params){
        return browse(2, params)
      }
});

//TODO: create group through chat bot using sequential parameters
status.command({
    name: "createGroup",
    title: 'create a betting group',
    description: 'create new group',
    fullscreen: true,
    onSend: function(params){
      return browse(4, params)
    }
});

status.command({
    name: "your_tokens",
    title: 'Your token',
    description: 'Check if you have received new tokens',
    fullscreen: true,
    params: [
      {
          name: "account",
          type: status.types.TEXT,
          placeholder: "SGT holding account address"
      }
    ],
    onSend: function(params){
      return browse('token_line', params)
    }
});

status.command({
    name: "your_eth",
    title: 'Your Ether',
    description: 'Check how much you spent/earnt ether',
    fullscreen: true,
    params: [
      {
          name: "account",
          type: status.types.TEXT,
          placeholder: "SGT holding account address"
      }
    ],
    onSend: function(params){
      return browse('eth_line', params)
    }
});

function accounts(params, context) {
  var circleNameSuggestions = status.components.view({}, [
    status.components.text({style: STYLES.SUGGESTIONS_HEADING}, 'Contract Address'),
    status.components.text({style: {margin: 10}}, 'This is the public contract address of the Lending Circle.')
    // status.components.text({style: {margin: 10}}, 'It should have been given to you by the creator, maybe give them a nudge if you don\'t have it.')
  ])
    return {markup: circleNameSuggestions}
};

status.command({
    name: "setUser",
    title: 'Set User',
    description: 'Change the user that is acting on the dapp.',
    fullscreen: true,
    sequentialParams: true,
    params: [
      {
        // TODO: select user from a list here.
          name: "account",
          type: status.types.NUMBER,
          placeholder: "type in the account address you want to use.",
          suggestions: accounts
      }
    ],
    preview: function (params) {
        var text = status.components.text(
            {
                style: {
                    marginTop: -10,
                    fontSize: 15,
                    fontFamily: "font",
                    color: "black"
                }
            }, "You have successfully selected user " + usersIndex);
        return {markup: status.components.view({}, [text])};
    }
    onSend: function(params){
      usersIndex = params.account
    }
});
// // Sources/references: https://github.com/makoto/gtt/blob/master/docs/bots/welcome.js
//
// var usersIndex = 0
//
// status.addListener("init", function () {
//   return {"text-message": "Welcome to Genesis Token Tracker. ʕ•͡ᴥ•ʔ"};
// });
//
// function browse(command, params){
//   var host = 'http://localhost:3000/'
//   var url = host + '#junk&' + usersIndex + '&' + page
//   return {
//     title: "Browser",
//     dynamicTitle: true,
//     singleLineInput: true,
//     actions: [ { type: status.actions.FULLSCREEN } ],
//     markup: status.components.bridgedWebView(url)
//   };
// }
//
// status.command({
//     name: "create",
//     title: 'SGT token holder leaderboard',
//     description: 'Browse SGT token holder leaderboard',
//     fullscreen: true,
//     params: [
//       {
//           name: "account",
//           type: status.types.TEXT,
//           placeholder: "SGT holding account address"
//       }
//     ],
//     onSend: function(params){
//       return browse('leaderboard', params)
//     }
// });
//
// status.command({
//   // TODO: make this go straight to the page
//     name: "myGroups",
//     title: 'SGT token holder distribution',
//     description: 'Browse SGT token holder distribution histogram',
//     fullscreen: true,
//     params: [
//       {
//           name: "account",
//           type: status.types.TEXT,
//           placeholder: "Ss"
//       }
//     ],
//     onSend: function(params){
//       return browse(2, params)
//     }
// });
//
// status.command({
//     name: "setUser",
//     title: 'Set User',
//     description: 'Change the user that is acting on the dapp.',
//     fullscreen: true,
//     params: [
//       {
//         // TODO: select user from a list here.
//           name: "userNum",
//           type: status.types.NUMBER,
//           placeholder: "type in the account address you want to use."
//       }
//     ]
//     onSend: function(params){
//       setAccountNum = params.userNum
//       console.log('user number changed' + setAccountNum)
//       return browse(0, params) // TODO: Cary add reply...
//     }
// });
