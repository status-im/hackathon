
ERCTOKEN = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"minter","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"},{"name":"amount","type":"uint256"}],"name":"create","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"supply","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"},{"name":"amount","type":"uint256"}],"name":"destroy","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]

var Token = web3.eth.contract(ERCTOKEN)
var mapTokens= {"REP":"0xF9A3a3d45185981D918d3FaD91af3e161E47352E",
                "ETH":"0xaCfc16bbD73F5DA63dB0571B22E78dc40d5D6f70",
                "GNT":"0xe40feb39fcb941a633dec965abc9921b3fe962b2", 
                "GNO": "0x64888583e676368390d6eb573bc2ac3bce9002b3", 
                "ICN":"0xdb6d5d3d074bfcb03ca5b7ffb9efac9192b99be6",
                "MLN":"0x1b789619d23cb67755d61691e8a9ddbd60b7bf8f"};


status.on("init", function(params, context) {
 status.sendMessage("Welcome to swap. Feel free to browse");
});


function getBalance(contractAddress) {
        return Token.at(contractAddress).balanceOf.call('0x6f7cd4c66e46755dA803c635654910A43a02BaA5')
  }

status.command({
    name: "swapbalances",
    title: 'TITLE',
    description: 'get your balances for tradeable tokens',
    fullscreen: true,
    params: [{
        name: "option",
        type: status.types.TEXT,
        placeholder: "either type REP, GNT, GNO, ICO, or all"
    }],
    preview: function (params) {
      console.log('***', params);
      var amount = params.option
      if (params.option == "all"){
             var returnString = ""
             amount = "All the tokens "
            for (var varTok in mapTokens) {
              returnString = returnString + varTok + ": " + getBalance(mapTokens[varTok]) + ", "
            }
            amount = amount +  returnString
      }else {
        if (params.option in mapTokens) {
             address = mapTokens[params.option]
             amount = params.option + ": " + getBalance(address);
      }
      }

      var text = status.components.text(
           {
               style: {
                   marginTop: 5,
                   marginHorizontal: 0,
                   fontSize: 14,
                   fontFamily: "font",
                   color: "black"
               }
           }, amount);

       return {markup: status.components.view({}, [text])};
    }
  });

function intentListSuggestions(params) {
    var suggestions = ["REP 10", "GNT 10", "MLN 5"].map(function (entry) {
        return status.components.touchable(
            {onPress: status.components.dispatch([status.events.SET_COMMAND_ARGUMENT, [0, entry]])},
            status.components.view(
                suggestionContainerStyle,
                [status.components.view(
                    suggestionSubContainerStyle,
                    [
                        status.components.text(
                            {style: valueStyle},
                            entry
                        )
                    ]
                )]
            )
        );
});

status.command({
    name: "Available tokens to trade",
    title: "intentList",
    description: "List available tokens to trade",
    color: "#7099e6",
    registeredOnly: true,
    params: [{
        name: "mode",
        suggestions: intentListSuggestions,
        type: status.types.TEXT
    }],
    preview: function (params) {
        return {
            markup: status.components.text(
                {},
                "Requesting to trade: " + params.mode
            )
        };
    }
});    


status.addListener("on-message-send", function (params, context) {
     var result = {
             err: null,
             data: null,
             messages: []
         };

     try {
         result["text-message"] = "Hey there! Please input /swapbalances or /intentList to get more info.";
     } catch (e) {
         result.err = e;
     }
     return result;
 });


