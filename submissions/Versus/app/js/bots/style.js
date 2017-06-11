function suggestionsContainerStyle(suggestionsCount) {
    return {
        marginVertical: 1,
        marginHorizontal: 0,
        keyboardShouldPersistTaps: "always",
        height: Math.min(150, (56 * suggestionsCount)),
        backgroundColor: "white",
        borderRadius: 5,
        flexGrow: 1,
	flexDirection: "row"
    };
}

var imageStyle = {
    width: 'auto',
    height: 300,
    borderBottomWidth: 1,
    borderBottomColor: "#0000001f",
    margin: 10

};

var suggestionSubContainerStyle = {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#0000001f"
};

var valueStyle = {
    margin: 15,
    fontSize: 16,
    fontFamily: "font",
    color: "#000000de"
};


var titleStyle = {
    margin: 15,
    fontSize: 24,
    fontFamily: "font",
    color: "#000000de"
};
