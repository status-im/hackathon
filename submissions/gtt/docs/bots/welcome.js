status.addListener("init", function () {
  return {"text-message": "Welcome to Genesis Token Tracker. ʕ•͡ᴥ•ʔ"};
});

function browse(command, params){
  // var host = 'http://localhost:8003/'
  var host = 'http://genesis-token-tracker.s3-website-us-west-2.amazonaws.com/'
  var url = host + command + '.html?account=' + params.account
  return {
          title: "Browser",
          dynamicTitle: true,
          singleLineInput: true,
          actions: [ { type: status.actions.FULLSCREEN } ],
          markup: status.components.bridgedWebView(url)
  };
}

status.command({
    name: "leaderboard",
    title: 'SGT token holder leaderboard',
    description: 'Browse SGT token holder leaderboard',
    fullscreen: true,
    params: [
      {
          name: "account",
          type: status.types.TEXT,
          placeholder: "SGT holding account address"
      }
    ],
    onSend: function(params){
      return browse('leaderboard', params)
    }
});

status.command({
    name: "token_distribution",
    title: 'SGT token holder distribution',
    description: 'Browse SGT token holder distribution histogram',
    fullscreen: true,
    params: [
      {
          name: "account",
          type: status.types.TEXT,
          placeholder: "SGT holding account address"
      }
    ],
    onSend: function(params){
      return browse('token_distribution', params)
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
