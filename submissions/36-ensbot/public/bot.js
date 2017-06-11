function getNameSuggestions() {
    // TODO: Get previously started or bidded auctions
    return [];
}
// Kudos to @makoto
function browse(command, params){
  var host = 'http://ensbot.legogris.se/'
  // var host = 'http://192.168.0.156:3000/'
  // var host = 'http://genesis-token-tracker.s3-website-us-west-2.amazonaws.com/'
  var url = host + command + '?';
  for(var key in params) {
      url += key + '=' + params[key] + '&';
  }
  return {
    title: 'Browser',
    dynamicTitle: true,
    singleLineInput: true,
    actions: [ { type: status.actions.FULLSCREEN } ],
    markup: status.components.bridgedWebView(url),
    // markup: status.components.webView(url),
    fullscreen: true
  };
}

status.addListener('on-message-send', function (params, context) {
    // status.sendMessage('onmessagesend');
    var result = {
        err: null,
        data: null,
        messages: []
    };

    try {
        result['text-message'] = 'Hello there! Try using of of my commands.';
    } catch (e) {
        result.err = e;
    }

    return result;
});


status.command({
     name: 'check',
     title: 'check',
     description: 'Check the status of a domain',
     color: 'black',
     params: [{
        name: 'domain',
        type: status.types.TEXT,
        placeholder: 'vitalik.eth'

      }],
     preview: function (params) {
       // status.sendMessage('Searching for your domain ' + params.domain + '...');
       return(browse('check', { domain: params.domain }));
     }
 });

status.command({
     name: 'startAuction',
     title: 'Start auction',
     description: 'Start auction for name',
     color: 'black',
     params: [{
        name: 'domain',
        type: status.types.TEXT,
        placeholder: 'vitalik.eth'
      }],
     preview: function (params) {
       // status.sendMessage('Starting auction for domain ' + params.domain + '...');
       return(browse('startauction', { domain: params.domain }));
     }
 });

status.command({
     name: 'bid',
     title: 'Bid on auction',
     description: 'Bid on name',
     color: 'black',
     params: [{
        name: 'domain',
        type: status.types.TEXT,
        suggestions: getNameSuggestions(),
        placeholder: 'vitalik.eth'
      }, {
        name: 'price',
        type: status.types.NUMBER,
        placeholder: 1
      }, {
        name: 'secret',
        type: status.types.TEXT,
        placeholder: 'SECRET'
      }],
     preview: function (params) {
       status.sendMessage('Bidding ' + params.price + ' for ' + params.domain + '...');
       return(browse('bid', { domain: params.domain, bidAmount: params.price, secret: params.secret }));
     }
 });


/*
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

function helloSuggestions() {
    var host = 'http://192.168.43.44:3000/'
    // var host = 'http://192.168.0.156:3000/'
    // var host = 'http://genesis-token-tracker.s3-website-us-west-2.amazonaws.com/'
    var url = host + command + '?';
    for(var key in params) {
        url += key + '=' + params[key] + '&';
    }
    var suggestions = ["Hello", "Goodbye"].map(function(entry) {
        return status.components.touchable(
            {onPress: status.components.dispatch([status.events.SET_VALUE, entry])},
            status.components.view(
                suggestionsContainerStyle,
                [
                        status.components.webView(url)
                ]
            )
        );
    });
    // Let's wrap those two touchable buttons in a scrollView
    var view = status.components.scrollView(
        suggestionsContainerStyle(2),
        suggestions
    );

    // Give back the whole thing inside an object.
    return {markup: view};
}
*/
