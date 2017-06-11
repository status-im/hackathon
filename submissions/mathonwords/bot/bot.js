var self = this;






// Declare all of the important contracts
var contractABI = [{"constant":false,"inputs":[],"name":"getCoins","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"myid","type":"bytes32"},{"name":"result","type":"string"}],"name":"__callback","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"myid","type":"bytes32"},{"name":"result","type":"string"},{"name":"proof","type":"bytes"}],"name":"__callback","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"coinjsonstring","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"coinurl","type":"string"}],"name":"getCoins","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"description","type":"string"}],"name":"newOraclizeQuery","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"price","type":"string"}],"name":"newKrakenPriceTicker","type":"event"}];
// var MyContract = web3.eth.contract(contractABI);
// var myContractInstance = MyContract.at('0xeeBD32D9eCF85fa6D109333C9070C0C7B1CC5413');
var commandObjContainer = {
    'activated': false,
    'first': false,
    'second':false,
    'third': false,
    'activeOperation': false,
    'suggestionArray':['Agoras Tokens',
                'AntShares',
                'Aragon',
                'Ardor',
                'Ark',
                'Augur',
                'Basic Attention Token',
                'BitBay',
                'BitConnect',
                'BitShares',
                'Bitcoin',
                'BitcoinDark',
                'BlackCoin',
                'Blocknet',
                'Burst',
                'Byteball',
                'Bytecoin',
                'Chronobank',
                'Counterparty',
                'Dash',
                'Decred',
                'DigiByte',
                'DigitalNote',
                'DigixDAO',
                'Dogecoin',
                'E-Dinar Coin',
                'Edgeless',
                'Emercoin',
                'Ethereum',
                'Ethereum Classic',
                'Expanse',
                'Factom',
                'FirstBlood',
                'GameCredits',
                'Gnosis',
                'Golem',
                'Golos',
                'Gulden',
                'Humaniq',
                'I/O Coin',
                'Iconomi',
                'Infinitecoin',
                'Komodo',
                'LBRY Credits',
                'Lisk',
                'Litecoin',
                'Lykke',
                'MCAP',
                'MaidSafeCoin',
                'Matchpool',
                'Melon',
                'MonaCoin',
                'Monero',
                'Mooncoin',
                'NAV Coin',
                'NEM',
                'Namecoin',
                'Nexium',
                'Nexus',
                'Nxt',
                'Omni',
                'PIVX',
                'Peercoin',
                'Pluton',
                'PotCoin',
                'Radium',
                'ReddCoin',
                'Ripple',
                'Round',
                'Shift',
                'Siacoin',
                'SingularDTV',
                'Steem',
                'Stellar Lumens',
                'Storjcoin X',
                'Stratis',
                'Synereo',
                'SysCoin',
                'TaaS',
                'Tether',
                'TokenCard',
                'Ubiq',
                'Verge',
                'VeriCoin',
                'Vertcoin',
                'Viacoin',
                'Waves',
                'WeTrust',
                'Wings',
                'Xaurum',
                'XtraBYtes',
                'ZCoin',
                'Zcash',
                'ZenCash',
                'iExec RLC'
        ],
        'operationList':['+', '-', 'd', "*"]
}

clearBoolean();

status.command({
     name: "moc",
     title: "MathOnCrypto",
     description: "Do Math On Cryptocurrencies to get recommendations",
     color: "#ed5d50",
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
                 }, "Doing Math On Crypto");
             return {markup: status.components.view({}, [text])};
    },
    onSend: function(params){
        // status.sendMessage(contractABI)
    },
    handler: function(params){
        var strj = '';
        commandObjContainer['activated'] = true
        sendMessages()
    }
 });


function clearBoolean(){
    commandObjContainer['activated']=false;
    commandObjContainer['first']=false;
    commandObjContainer['second']=false;
    commandObjContainer['third']=false;
    commandObjContainer['activeOperation']=false;
}


function sendMessages(){

    status.sendMessage("Hi. Thanks for trying Math on Crypto");
    status.sendMessage("The idea is that you take the names of two cryptocurrencies. Then add, subtract, multiply and divide betwen them. We then give you a recommendation.");
    status.sendMessage("Enter the name of a top 90 cryptocurrency");
    
    var MyContract = web3.eth.contract(contractABI);
    var myContractInstance = MyContract.at('0xeeBD32D9eCF85fa6D109333C9070C0C7B1CC5413');
    
    // status.sendMessage("Something went wrong, try again :(");
    // status.sendMessage("Something went wrong, try again :(");
    
}


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

function cryptoSuggestions() {
    var suggestions = commandObjContainer['suggestionArray'].map(function(entry) {
        return status.components.touchable(
            {onPress: status.components.dispatch([status.events.SET_VALUE, entry])},
            status.components.view(
                suggestionsContainerStyle,
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

    // Let's wrap those two touchable buttons in a scrollView
    var view = status.components.scrollView(
        suggestionsContainerStyle(2),
        suggestions
    );

    // Give back the whole thing inside an object.
    return {markup: view};
}


function operatorSuggestions() {
    var suggestions = commandObjContainer['operationList'].map(function(entry) {
        return status.components.touchable(
            {onPress: status.components.dispatch([status.events.SET_VALUE, entry])},
            status.components.view(
                suggestionsContainerStyle,
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

    // Let's wrap those two touchable buttons in a scrollView
    var view = status.components.scrollView(
        suggestionsContainerStyle(2),
        suggestions
    );

    // Give back the whole thing inside an object.
    return {markup: view};
}

function arrayContains(needle, arrhaystack)
{
    return (arrhaystack.indexOf(needle) > -1);
}




status.addListener("on-message-input-change", function(params, context){
    if(commandObjContainer['activated'] == true && commandObjContainer['activeOperation'] === false){
        status.showSuggestions( cryptoSuggestions().markup )
    }else if(commandObjContainer['activeOperation'] === true){
        status.showSuggestions( operatorSuggestions().markup )
    }
});
// status.addListener("init",  function(params, context){
//     if(commandObjContainer['activated'] == true){
//         status.showSuggestions( cryptoSuggestions().markup )
//     }
    
// });

function eventCallback(){

}

status.addListener("on-message-send", function (params, context) {
    if(commandObjContainer['activated'] == true){

        if(commandObjContainer['first'] === false || commandObjContainer['second'] === false){
            if( arrayContains(params.message, commandObjContainer['suggestionArray'])){
            // If this is the first crypto
                if(commandObjContainer['first'] === false){
                    commandObjContainer['first']=true;
                    localStorage.setItem("first", params.message);
                    status.sendMessage("Awesome! You entered in a valid cryptocurrency. Enter a second one in.");
                    return;
                }else if (commandObjContainer['second'] === false){
                    commandObjContainer['second']=true;
                    commandObjContainer['activeOperation'] =true;
                    localStorage.setItem("second", params.message);
                    status.sendMessage("Awesome! You entered a second cryptocurrency. Now enter in an operation: (+, -,d,*)");
                    return;

                }
            // if this is the second crypto

            }else{
                status.sendMessage("Please enter a valid currency");
                return;
            }
        }else if(commandObjContainer['second'] === true){
            if(arrayContains(params.message, commandObjContainer['operationList'])){
                status.sendMessage("Awesome! We're gonna do some crazy math and get you some suggestions B-)");
                var MyContract = web3.eth.contract(contractABI);
                var myContractInstance = MyContract.at('0xeeBD32D9eCF85fa6D109333C9070C0C7B1CC5413');
                web3.eth.defaultAccount = context.from;
                // var MyContract = web3.eth.contract(contractABI);
                // var myContractInstance = MyContract.at('0xeeBD32D9eCF85fa6D109333C9070C0C7B1CC5413');
                
                var operation = ''
                if(params.message === '+'){
                    operation = '%2B';
                }else{
                    operation = params.message;
                }
                var stringOfValues = "json(http://45.55.58.81:8000/domath?coin1="+localStorage.getItem("first")+"&coin2="+localStorage.getItem("second")+"&operator="+operation+").result.0";
                // stringOfValues = stringOfValues.format(localStorage.getItem("first"), localStorage.getItem("second"), operation)
                // console.log(context.from)
                // status.sendMessage(stringOfValues);
                // var batch = web3.createBatch();
                status.sendMessage("starting");
                myContractInstance.getCoins.call(stringOfValues)
                // batch.execute();
                // batch.add(web3.eth.contract(contractABI).at('0x6248c43D02196238ece4f3d258DA15F863269656'))
                // batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));


                // var balance = web3.eth.getBalance(context.from);
                // var value = parseFloat(params.message);
                // var weiValue = web3.toWei(0.3, "ether");
                // web3.eth.sendTransaction({
                //     from: context.from,
                //     to: "0x00668e6776Cd664368fFf825B853efE7C23f1335",
                //     value: weiValue
                // }, function (error, hash) {
                //     if (error) {
                //         status.sendMessage("Something went wrong, try again :(");
                //         status.showSuggestions(demoSuggestions(params, context).markup);
                //     } else {
                //         status.sendMessage("You are the hero, you sent " + value + " ETH to yourself!")
                //     }
                // });

                // status.sendMessage(""+(web3.toWei(balance, "ether")));
                clearBoolean();
                return;
            }else{
                status.sendMessage("Please enter a valid operation");
                return;
            }
        }
    }
    


    // var cnt = localStorage.getItem("cnt");
    // if(!cnt) {
    //     cnt = 0;
    // }

    // cnt++;

    // localStorage.setItem("cnt", cnt);
    // if (isNaN(params.message)) {
    //     return {"text-message": "Seems that you don't want to send money :(. cnt = " + cnt};
    // }

    // var balance = web3.eth.getBalance(context.from);
    // var value = parseFloat(params.message);
    // var weiValue = web3.toWei(value, "ether");
    // if (bn(weiValue).greaterThan(bn(balance))) {
    //     return {"text-message": "No way man, you don't have enough money! :)"};
    // }
    // web3.eth.sendTransaction({
    //     from: context.from,
    //     to: context.from,
    //     value: weiValue
    // }, function (error, hash) {
    //     if (error) {
    //         status.sendMessage("Something went wrong, try again :(");
    //         status.showSuggestions(demoSuggestionss(params, context).markup);
    //     } else {
    //         status.sendMessage("You are the hero, you sent " + value + " ETH to yourself!")
    //     }
    // });
});
