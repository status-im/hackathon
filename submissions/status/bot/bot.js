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