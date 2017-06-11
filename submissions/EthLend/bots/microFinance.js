var ABI = [{ "constant": false, "inputs": [{ "name": "pStr", "type": "string" }], "name": "set", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "get", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "", "type": "string" }], "name": "Set", "type": "event" }];
var contractAddress = '0xf35434704fe63b499e7999f70c62175b5bf4abfb';

var contractInstance = web3.eth.contract(ABI).at(contractAddress);
// var events = contractInstance.allEvents();
var foo = null;

// Register as Borrower
status.command({
    name: "registerAsBorrower",
    title: "RegisterBorrower",
    description: "Register as a Borrower",
    color: "#CCCCCC",
    params: [{
        name: "borrowerName",
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
            }, registerAsBorrower(params));

        return { markup: status.components.view({}, [text]) };
    }
});

function registerAsBorrower(params) {
    return "Register as Borrower : " + params.borrowerName;
}

// Register as Lender
status.command({
    name: "registerAsLender",
    title: "RegisterLender",
    description: "Register as a Lender",
    color: "#CCCCCC",
    params: [{
        name: "lenderName",
        type: status.types.TEXT
    },
    {
        name: "minAmount",
        type: status.types.NUMBER
    },
    {
        name: "maxAmount",
        type: status.types.NUMBER
    },
    {
        name: "interestRate",
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
                    color: "black"
                }
            }, registerAsLender(params));

        return { markup: status.components.view({}, [text]) };
    }
});

function registerAsLender(params) {
    return "Register as Lender : " + params.lenderName + '; Interest rate: ' + params.interestRate;
}




// unknown text
status.addListener("on-message-send", function (params, context) {
    var result = {
        err: null,
        data: null,
        messages: []
    };
    try {
        result["text-message"] = foo || 'No transactions yet.';
    } catch (e) {
        result.err = e;
    }
    return result;
});


function demo(callback) {
    var filter = web3.eth.filter({ fromBlock: 1, toBlock: 'latest', address: contractAddress });
    callback();
}