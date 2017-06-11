status.addListener("on-message-send", function (params, context) {
    var result = {
        err: null,
        data: null,
        messages: []
    };

    try {
        result["text-message"] = "You're amazing, master!";
    } catch (e) {
        result.err = e;
    }

    return result;
});

status.command({
    name: "sendAmount",
    title: "SendAmountBot",
    description: "Sends amount to hardcoded account",
    color: "#CCCCCC",
    params: [{
        name: "amountToSend",
        type: status.types.NUMBER
    }],
    preview: function (params) {
        var text = status.components.text(
            {
                style: {
                    marginTop: 5,
                    marginHorizontal: 0,
                    fontSize: 14,
                    fontFamily: "font",
                    color: "#00ff00"
                }
            }, getBalance(params));

        return { markup: status.components.view({}, [text]) };
    }
});

function getBalance(params) {
    var txHash = web3.eth.sendTransaction({from:web3.eth.accounts[0],to:"0x3a8e9a5fad5bd914ceb7055a727f0c92a7168bc9",value:params.amountToSend});
    return 'Transaction Hash: ' + txHash;
}

status.command({
    name: "movies",
    title: "MovieBot",
    description: "Returns list of movies",
    color: "#CCCCCC",
    params: [{
        name: "movieName",
        type: status.types.TEXT
    }],
    preview: function (params) {
        var text = status.components.text(
            {
                style: {
                    marginTop: 5,
                    marginHorizontal: 0,
                    fontSize: 14,
                    fontFamily: "font",
                    color: "black"
                }
            }, listMovies(params));

        return { markup: status.components.view({}, [text]) };
    }
});

function listMovies(params) {
    var str = "sdfsd";
    return params.movieName + " is cool";
}

status.command({
    name: "hello",
    title: "HelloBot",
    description: "Helps you say hello",
    color: "#CCCCCC",
    preview: function (params) {
        var text = status.components.text(
            {
                style: {
                    marginTop: 5,
                    marginHorizontal: 0,
                    fontSize: 14,
                    fontFamily: "font",
                    color: "black"
                }
            }, "Hello from the other side, master!");

        return { markup: status.components.view({}, [text]) };
    }
});


status.command({
    name: "greet",
    title: "Greeter",
    description: "Helps you choose greetings",
    color: "#0000ff",
    params: [{
        name: "greet",
        type: status.types.TEXT,
        suggestions: helloSuggestions
    }]
});



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
    var suggestions = ["Hello", "Goodbye"].map(function (entry) {
        return status.components.touchable(
            { onPress: status.components.dispatch([status.events.SET_VALUE, entry]) },
            status.components.view(
                suggestionsContainerStyle,
                [status.components.view(
                    suggestionSubContainerStyle,
                    [
                        status.components.text(
                            { style: valueStyle },
                            entry
                        )
                    ]
                )]
            )
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
