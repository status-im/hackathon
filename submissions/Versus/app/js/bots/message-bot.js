status.addListener("init", function (params, context) {
    var result = {
	err: null,
	data: null,
	messages: []
    };

    try {
	result["text-message"] = "Welcome to Versus-bot! Start earning tokens by rating versus pictures.\n\nTo add a new Versus switch to Webview by sending '/dapp' command.\n\nSend '/loadfeed' command to start.";
    } catch (e) {
	result.err = e;
    }

    return result;
});



status.addListener("on-message-send", function (params, context) {
    var result = {
	err: null,
	data: null,
	messages: []
    };

    try {
	result["text-message"] = "You can try '/rate' command to rate images and earn money. (Don't forget to run '/loadfeed' first).\n\n Or you can start Versus Dapp in webview with '/dapp'";
    } catch (e) {
	result.err = e;
    }

    return result;
});

