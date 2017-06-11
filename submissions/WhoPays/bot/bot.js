// Contract ABI definition
var contractAbi = [{"constant":true,"inputs":[],"name":"getStatus","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"member","type":"address"}],"name":"validMember","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"member","type":"address"}],"name":"memberStatus","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalStatus","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"groupName","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalExpenses","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"memberInfo","outputs":[{"name":"memberExpense","type":"uint256"},{"name":"balance","type":"uint256"},{"name":"positive","type":"bool"},{"name":"totalOws","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"memberList","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"listMembers","outputs":[{"name":"","type":"address[]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"member","type":"address"}],"name":"memberAddPay","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[],"name":"contractResolve","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"contractStatus","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"member","type":"address"}],"name":"memberBalance","outputs":[{"name":"","type":"uint256"},{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"member","type":"address"},{"name":"expense","type":"uint256"}],"name":"removeExpense","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"groupInfo","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"member","type":"address"},{"name":"expense","type":"uint256"}],"name":"addExpense","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalOwed","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"name","type":"string"},{"name":"memberAddresses","type":"address[]"}],"payable":false,"type":"constructor"}];

// Contract bytecode
var byteCode = "0x606060405234156200000d57fe5b604051620016d6380380620016d6833981016040528080518201919060200180518201919050505b81600090805190602001906200004d929190620000b9565b5080600690805190602001906200006692919062000140565b50600060048190555033600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b50506200023d565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620000fc57805160ff19168380011785556200012d565b828001600101855582156200012d579182015b828111156200012c5782518255916020019190600101906200010f565b5b5090506200013c9190620001cf565b5090565b828054828255906000526020600020908101928215620001bc579160200282015b82811115620001bb5782518260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055509160200191906001019062000161565b5b509050620001cb9190620001f7565b5090565b620001f491905b80821115620001f0576000816000905550600101620001d6565b5090565b90565b6200023a91905b808211156200023657600081816101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905550600101620001fe565b5090565b90565b611489806200024d6000396000f300606060405236156100fa576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680634e69d560146100fc57806361ce7f461461012257806364afef30146101705780636eda0ab6146101ba578063783cec80146101e05780637bd35af8146102795780638da5cb5b1461029f578063a313c371146102f1578063b307fc6d14610354578063b6afd2ca146103b4578063bed474a214610429578063c2534e5314610457578063c6ee20d214610481578063d39a9975146104a7578063dcec1974146104fc578063e4ac7cbd1461054f578063e765d6c4146105e8578063e7fa9f7d1461063b575bfe5b341561010457fe5b61010c610661565b6040518082815260200191505060405180910390f35b341561012a57fe5b610156600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061066c565b604051808215151515815260200191505060405180910390f35b341561017857fe5b6101a4600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610724565b6040518082815260200191505060405180910390f35b34156101c257fe5b6101ca610795565b6040518082815260200191505060405180910390f35b34156101e857fe5b6101f06107b1565b604051808060200182810382528381815181526020019150805190602001908083836000831461023f575b80518252602083111561023f5760208201915060208101905060208303925061021b565b505050905090810190601f16801561026b5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561028157fe5b61028961084f565b6040518082815260200191505060405180910390f35b34156102a757fe5b6102af610855565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156102f957fe5b610325600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061087b565b604051808581526020018481526020018315151515815260200182815260200194505050505060405180910390f35b341561035c57fe5b61037260048080359060200190919050506108b8565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156103bc57fe5b6103c46108f8565b6040518080602001828103825283818151815260200191508051906020019060200280838360008314610416575b805182526020831115610416576020820191506020810190506020830392506103f2565b5050509050019250505060405180910390f35b610455600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061099e565b005b341561045f57fe5b610467610b7c565b604051808215151515815260200191505060405180910390f35b341561048957fe5b610491610f1d565b6040518082815260200191505060405180910390f35b34156104af57fe5b6104db600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610f23565b60405180838152602001821515151581526020019250505060405180910390f35b341561050457fe5b610539600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050611083565b6040518082815260200191505060405180910390f35b341561055757fe5b61055f6111c4565b60405180806020018281038252838181518152602001915080519060200190808383600083146105ae575b8051825260208311156105ae5760208201915060208101905060208303925061058a565b505050905090810190601f1680156105da5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156105f057fe5b610625600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190505061127e565b6040518082815260200191505060405180910390f35b341561064357fe5b61064b61135d565b6040518082815260200191505060405180910390f35b600060045490505b90565b60006000600260045414156106815760006000fd5b600090505b600680549050811015610719578273ffffffffffffffffffffffffffffffffffffffff166006828154811015156106b957fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141561070b576001915061071e565b5b8080600101915050610686565b600091505b50919050565b6000600260045414156107375760006000fd5b6107408261066c565b1561078f57600560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001549050610790565b5b919050565b6000600260045414156107a85760006000fd5b60015490505b90565b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108475780601f1061081c57610100808354040283529160200191610847565b820191906000526020600020905b81548152906001019060200180831161082a57829003601f168201915b505050505081565b60015481565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60056020528060005260406000206000915090508060000154908060010154908060020160009054906101000a900460ff16908060030154905084565b6006818154811015156108c757fe5b906000526020600020900160005b915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610900611435565b600260045414156109115760006000fd5b600680548060200260200160405190810160405280929190818152602001828054801561099357602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311610949575b505050505090505b90565b60006000600260045414156109b35760006000fd5b349150600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060030154821115610a065760006000fd5b81600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600301600082825403925050819055508160026000828254039250508190555060006002541415610b7657600090505b600680549050811015610b6d576001151560056000600684815481101515610a9a57fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060020160009054906101000a900460ff1615151415610b5f57610b5e600682815481101515610b2c57fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16611363565b5b5b8080600101915050610a76565b60026004819055505b5b505050565b60006000600060006000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610f0c5760026004541415610bed5760006000fd5b6001600481905550600680549050600154811515610c0757fe5b049350600092505b600680549050831015610f035760056000600685815481101515610c2f57fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000015491508382101515610d45578382039050600160056000600686815481101515610cbf57fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060020160006101000a81548160ff021916908315150217905550610e73565b8184039050600060056000600686815481101515610d5f57fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060020160006101000a81548160ff0219169083151502179055508060056000600686815481101515610df457fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060030181905550806002600082825401925050819055505b8060056000600686815481101515610e8757fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600101819055505b8280600101935050610c0f565b60019450610f16565b60009450610f16565b5b5050505090565b60045481565b6000600060006001600454141515610f3b5760006000fd5b60011515600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060020160009054906101000a900460ff1615151415610fe157600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600101549050611027565b600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206003015490505b80600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060020160009054906101000a900460ff16925092505b50915091565b600060006004541415156110975760006000fd5b6000821180156110ac57506110ab8361066c565b5b156111bd57600082600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000154031080611108575060008260015403105b156111135760006000fd5b81600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000016000828254039250508190555081600160008282540392505081905550600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000015490506111be565b5b92915050565b6111cc611449565b600260045414156111dd5760006000fd5b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156112735780601f1061124857610100808354040283529160200191611273565b820191906000526020600020905b81548152906001019060200180831161125657829003601f168201915b505050505090505b90565b600060006004541415156112925760006000fd5b6000821180156112a757506112a68361066c565b5b156113565781600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000016000828254019250508190555081600160008282540192505081905550600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001549050611357565b5b92915050565b60025481565b6000600560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600101541115611431578073ffffffffffffffffffffffffffffffffffffffff166108fc600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600101549081150290604051809050600060405180830381858888f19350505050151561143057fe5b5b5b50565b602060405190810160405280600081525090565b6020604051908101604052806000815250905600a165627a7a72305820d8289e38ac5a1947d4785ddca2d02fd5967ce0228c978236c1d63a27bc5c5e5b0029";

// Define the WhoPays Contract which is being deployed
var WhoPaysContract = web3.eth.contract(contractAbi);

// General suggestions style, will also be used by other suggestions
function suggestionsContainerStyle() {
  return {
    marginVertical: 1,
    marginHorizontal: 0,
    keyboardShouldPersistTaps: "always",
    height: 350,
    backgroundColor: "#ffffff",
    flexGrow: 1,
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
  };
}

var suggestionSubContainerStyle = {
  height: 60,
  borderBottomWidth: 1,
  borderBottomColor: "#eeeeee",
  justifyContent: 'center',
  paddingLeft: 10,
  paddingRight: 10,
};

var valueStyle = {
  fontWeight: 'bold',
  fontSize: 15,
  color: "#111",
};

var subValueStyle = {
  fontWeight: 'normal',
  fontSize: 15,
  color: "#555",
}

function getListUserNumber(length) {
  if (length === 1) {
    return "1 user";
  } else {
    return length + " users";
  }
}

function listSuggestions() {
  var suggestions;
  if (getData().length !== 0) {
    suggestions = getData().map(function(entry) {
      return status.components.touchable(
        {onPress: status.components.dispatch([status.events.SET_COMMAND_ARGUMENT,[0, entry.name]])},
        status.components.view(
          suggestionsContainerStyle,
          [status.components.view(
            suggestionSubContainerStyle,
            [
              status.components.text(
                {style: valueStyle},
                entry.name
              ),
              status.components.text(
                {style: subValueStyle},
                getListUserNumber(entry.users.length)
              )
            ]
          )]
        )
      );
    });
  } else {
    suggestions = [status.components.view(
      { style: { flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 200}},
      [status.components.view(
        {}, [
          status.components.image(
            {
                source: {uri: "https://ethdeveloper.com/static/whopays-no-lists.png"},
                style: {
                    width: 100,
                    height: 100,
                    marginBottom: 20,
                }
            }
          ),
          status.components.text(
                {style: { color: '#111', fontSize: 16 }},
                "No lists found"
              ),
        ]
      )]
    )];
  }

  // Let's wrap those two touchable buttons in a scrollView
  var view = status.components.scrollView(
      suggestionsContainerStyle(),
      suggestions
  );

  // Give back the whole thing inside an object.
  return { markup: view };
}
  


function createList(name) {
  var list = { name: name, users: [web3.eth.accounts[0]], hash: null };
  if (localStorage.getItem("data")) {
    var data = JSON.parse(localStorage.getItem("data"));
    var exists = false;
    for (var i = 0; i < data.length; i++) {
      if (name === data[i].name) {
        exists = true;
      }
    }
    if (!exists) {
      data.push(list);
      setData(data);
      status.sendMessage("You've successfully created a new list *" + name + '*.');
    } else {
      status.sendMessage("You've got a list named *" + name + '*. Please create one with a different name.');
    }
  } else {
    setData([list]);
    status.sendMessage("You've successfully created a new list *" + name + '*.');
  }
}

function joinListWithHash(name, users, hash) {
  var list = { name: name, users: users, hash: hash };
  if (localStorage.getItem("data")) {
    var data = JSON.parse(localStorage.getItem("data"));
    data.push(list);
    setData(data);
  } else {
    setData([list]);
  }
  status.sendMessage("You've successfully joined a list named: " + name + '.');
}

function addUserToList(name, address) {
  var data = getData();
  for (var i = 0; i < data.length; i++) {
    if (data[i].name === name) {
      data[i].users.push(address);
    }
  }
  setData(data);
}

function addContractToList(name, hash) {
  var data = getData();
  for (var i = 0; i < data.length; i++) {
    if (data[i].name === name) {
      data[i].hash = hash;
    }
  }
  setData(data);
}

function getList(name) {
  var data = getData();
  for (var i = 0; i < data.length; i++) {
    if (data[i].name === name) {
      return data[i];
    }
  }
}

function removeList(name) {
  var data = getData();
  for (var i = 0; i < data.length; i++) {
    if (data[i].name === name) {
      data.splice(i, 1);
    }
  }
  setData(data);
}

function setData(data) {
  localStorage.setItem("data", JSON.stringify(data));
}

function getData() {
  return JSON.parse(localStorage.getItem("data"));
}

/*
 * Thanks to @tomnash who linked me to their project to help me figure out how they wait for their contractHash
 * https://github.com/morelazers/SaveWithStatus/blob/master/build/bot/bot.js
 */ 
function waitForTransactionHash(txHash) {
  var mined = false
  var receipt
  while (!mined) {
    receipt = web3.eth.getTransactionReceipt(txHash)
    if (!receipt) continue
    if (receipt.contractAddress || receipt.gasUsed) mined = true
  }
  return receipt
}

/*
 * GET-STARTED
 */


function getStartedScrollView() {
  return {
      horizontal: true,
      pagingEnabled: true,
      backgroundColor: "#2bd18f",
      flexDirection: 'row',
  };
}

var styles = {
  step: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 450,
    flex: 1,
    marginBottom: 100,
    width: 410,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 50
  },
  title: {
    color: "#fff",
    fontSize: 21,
    textAlign: 'center',
    marginBottom: 5,
  },
  desc: {
    color: "rgba(255,255,255, 0.8)",
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24
  },
}

function showGetStarted(params, context) {

  var steps = [
    {
      title: "Welcome to WhoPays",
      desc: "Scroll to the side for a short introduction",
      image: "https://ethdeveloper.com/static/get-started-0.png",
      image_width: 150,
      image_height: 150,
    },
    {
      title: "Create a list",
      desc: "You can create a list to track expenses with a group during, for example, an event or holiday. You can add your friends to this list.",
      image: "https://ethdeveloper.com/static/get-started-1.png",
      image_width: 128,
      image_height: 128,
    },
    {
      title: "Add expenses",
      desc: "Everyone from the group can add their expenses to the list.",
      image: "https://ethdeveloper.com/static/get-started-2.png",
      image_width: 128,
      image_height: 128,
    },
    {
      title: "Close the list",
      desc: "At the end of the event the person who created the list can close the list. The list will divide all the expenses and calculate how much everyone has to pay or will receive.",
      image: "https://ethdeveloper.com/static/get-started-3.png",
      image_width: 128,
      image_height: 128,
    },
    {
      title: "Transfer",
      desc: "Every person who needs to pay, transfers Ether to the list. The list keeps track of who paid.",
      image: "https://ethdeveloper.com/static/get-started-4.png",
      image_width: 128,
      image_height: 128,
    },
    {
      title: "Done!",
      desc: "Once everyone paid. The list will transfer Ether automatically to the persons whom are still owed Ether. The list will close.",
      image: "https://ethdeveloper.com/static/get-started-5.png",
      image_width: 128,
      image_height: 128,
    }
  ];

  var screens = steps.map(function (step) {
      return status.components.view(
        styles.step,
        [
          status.components.image(
            {
                source: {uri: step.image},
                style: {
                    width: step.image_width,
                    height: step.image_height,
                    marginBottom: 20,
                }
            }
          ),
          status.components.text(
            { style: styles.title },
            step.title
          ),
          status.components.text(
            { style: styles.desc },
            step.desc
          )
        ]
      );
  });

  var view = status.components.scrollView(
    getStartedScrollView(),
    screens
  );

  return {
    title: "Get started",
    dynamicTitle: false,
    singleLineInput: true,
    markup: view
  };
}

status.command({
  name: "get-started",
  title: "get-started",
  registeredOnly: true,
  description: "A short intro to WhoPays",
  color: "#2bd18e",
  fullscreen: true,
  onSend: showGetStarted
});

/*
 * CREATE LIST
 */

var create = {
  name: "create",
  title: "Create list",
  icon: "list",
  registeredOnly: true,
  description: "Create a list",
  color: "#2bd18e",
  params: [{
    name: "name",
    type: status.types.TEXT,
    placeholder: "Add your list name"
  }],
  preview: function (params) {
    return {
        markup: status.components.view({}, [
          status.components.text({
            style: {
              marginTop: 5,
              fontSize: 15,
              color: '#000000',
            }
          }, "Created a list named "),
          status.components.text({
            style: {
              marginTop: 2,
              fontSize: 15,
              color: "#000000",
              fontWeight: 'bold',
            }
          }, params.name),
        ])
      }
    },
  handler: function(params) {
    createList(params.name);
  }
}

status.command(create);

/*
 * REMOVE LIST
 */

status.command({
  name: "remove",
  title: "Remove a list",
  registeredOnly: true,
  description: "Remove a list",
  color: "#2bd18e",
  params: [{
    name: "name",
    type: status.types.TEXT,
    placeholder: "Select list",
    suggestions: listSuggestions
  }],
   preview: function (params) {
    return {
        markup: status.components.view({}, [
          status.components.text({
            style: {
              marginTop: 5,
              fontSize: 15,
            }
          }, "Removed a list named: "),
          status.components.text({
            style: {
              marginTop: 2,
              fontSize: 15,
              fontWeight: 'bold',
            }
          }, params.name),
        ])
      }
    },
  handler: function(params) {
    removeList(params.name);
  }
});

/*
 * ADD USER
 */

status.command({
  name: "add-user",
  title: "Add user",
  registeredOnly: true,
  description: "Add a user to a list",
  color: "#2bd18e",
  sequentialParams: true,
  params: [{
    name: "name",
    type: status.types.TEXT,
    placeholder: "Select list",
    suggestions: listSuggestions
  },
  {
    name: "address",
    type: status.types.TEXT,
    placeholder: "User Ether Address"
  }],
  preview: function (params) {
    return {
        markup: status.components.view({}, [
          status.components.text({
            style: {
              marginTop: 5,
              marginHorizontal: 0,
              fontSize: 14,
              color: '#000000'
            }
          }, "Added"),
          status.components.text({
            style: {
              marginTop: 5,
              marginHorizontal: 0,
              fontSize: 14,
              fontWeight: 'bold',
              color: '#000000'
            }
          }, params.address),
          status.components.text({
            style: {
              marginTop: 5,
              marginHorizontal: 0,
              fontSize: 14,
              color: '#000000'
            }
          }, "to"),
          status.components.text({
            style: {
              marginTop: 5,
              marginHorizontal: 0,
              fontSize: 14,
              fontWeight: 'bold',
              color: '#000000'
            }
          }, params.name),
        ])
      }
    },
  handler: function(params) {
    if (params.address[0] == '0' && params.address[1] == 'x') {
      addUserToList(params.name, params.address);
    } else {
      addUserToList(params.name, "0x" + params.address);
    }
  }
});

/*
 * VIEW LIST
 */

function getMemberInfo(instance, currentStatus, address) {
  if (currentStatus == 0) {
    return status.components.view(
      {},
      [
        status.components.text(
          {},
          address
        ),
        status.components.text(
          {},
          "Current expense: " +  instance.memberStatus(address)
        )
      ]
    );
  }

  if (currentStatus == 1) {
    var memberBalance = instance.memberBalance(address);

    if(memberBalance[1] === true) {
      return status.components.view(
        {},
        [
          status.components.text(
            {},
            address
          ),
          status.components.text(
            {},
            "Will receive: " + web3.fromWei(memberBalance[0], 'ether')
          )
        ]
      );
    }
    else{
      return status.components.view(
        {},
        [
          status.components.text(
            {},
            address
          ),
          status.components.text(
            {},
            "Will have to pay: " + web3.fromWei(memberBalance[0], 'ether')
          )
        ]
      );
    }
  }

}

var viewStyles = {
  header: {
    backgroundColor: '#2bd18e',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'center',
  }
}

function renderYou(address) {
  if (address === web3.eth.accounts[0]) {
    return status.components.text({ style: { position: 'absolute', 'right': 0, top: -2, fontSize: 10, fontWeight: 'bold', backgroundColor: '#f1f1f1', color: '#111', borderRadius: 5, textAlign: 'center', paddingLeft: 5, paddingRight: 5, paddingTop: 2, paddingBottom: 2 }},
      "YOU" 
    )
  }

  return null;
  
}
function showViewList(params) {

  var list = getList(params.list);
  
  if (list.hash) {
    var instance = WhoPaysContract.at(list.hash);
    // Set defaultAccount which is needed for transactions
    web3.eth.defaultAccount = web3.eth.accounts[0];
    var listStatus = instance.getStatus();
    var listMembers = instance.listMembers();
    var totalAmount = instance.totalStatus();

    if (listStatus == 0) {
      var statusHeader = status.components.view({}, [
          status.components.text(
            { style: { textAlign: 'center', color: 'rgba(255,255,255, 0.8)', fontSize: 15 }},
            "TOTAL EXPENSES"
          ),
          status.components.text(
            { style: { textAlign: 'center', color: '#fff', fontSize: 28 }},
            "Ξ" + web3.fromWei(totalAmount, 'ether')
          ),
          status.components.text(
            { style: { textAlign: 'center', color: 'rgba(255,255,255, 0.8)', fontSize: 13 }},
            "Everyone can add their expenses"
          )
        ]
      );

      var userList = listMembers.map(function(address) {
        return status.components.view(
          { flexDirection: 'row', padding: 15, borderBottomColor: '#dddddd', borderBottomWidth: 1, borderBottomStyle: 'solid', alignItems: 'center' },
          [
            status.components.text({ style: { backgroundColor: '#2bd18e', borderRadius: 5, textAlign: 'center', padding: 5, color: '#fff', fontWeight: 'bold', fontSize: 16, marginRight: 10 }},
              "Ξ" + web3.fromWei(instance.memberStatus(address), 'ether')
            ),
            status.components.text({ style: { color: '#888fa0', fontSize: 12 }},
              address
            ),
          ]
        )
      });
    }

    if (listStatus == 1) {
      var statusHeader = status.components.view({}, [
          status.components.text(
            { style: { textAlign: 'center', color: 'rgba(255,255,255, 0.8)', fontSize: 15 }},
            "TOTAL EXPENSES"
          ),
          status.components.text(
            { style: { textAlign: 'center', color: '#fff', fontSize: 28 }},
            "Ξ" + web3.fromWei(totalAmount, 'ether')
          ),
          status.components.text(
            { style: { textAlign: 'center', color: 'rgba(255,255,255, 0.8)', fontSize: 13 }},
            "List closed. Check if you need to pay."
          )
        ]
      );

      var userList = listMembers.map(function(address) {
        var memberBalance = instance.memberBalance(address);

        if (memberBalance[1] === true) {
          return status.components.view(
            { flexDirection: 'row', padding: 15, borderBottomColor: '#dddddd', borderBottomWidth: 1, borderBottomStyle: 'solid', alignItems: 'center' },
            [
              status.components.text({ style: { backgroundColor: '#2bd18e', borderRadius: 5, textAlign: 'center', padding: 5, color: '#fff', fontWeight: 'bold', fontSize: 16, marginRight: 10 }},
                "Ξ" + web3.fromWei(memberBalance[0], 'ether')
              ),
              status.components.view({ flexDirection: 'column' }, [
                status.components.text({ style: { color: '#111', fontSize: 12, fontWeight: 'bold' }},
                  "RECEIVE"
                ),
                status.components.text({ style: { color: '#888fa0', fontSize: 12 }},
                  address
                ),
                renderYou(address)
              ])
            ]
          )
        } else {
          return status.components.view(
            { flexDirection: 'row', padding: 15, borderBottomColor: '#dddddd', borderBottomWidth: 1, borderBottomStyle: 'solid', alignItems: 'center' },
            [
              status.components.text({ style: { backgroundColor: '#f04213', borderRadius: 5, textAlign: 'center', padding: 5, color: '#fff', fontWeight: 'bold', fontSize: 16, marginRight: 10 }},
                "Ξ" + web3.fromWei(memberBalance[0], 'ether')
              ),
              status.components.view({ flexDirection: 'column' }, [
                status.components.text({ style: { color: '#111', fontSize: 12, fontWeight: 'bold' }},
                  "PAY"
                ),
                status.components.text({ style: { color: '#888fa0', fontSize: 12 }},
                  address
                ),
                renderYou(address)
              ])
            ]
          )
        }
      });
    }

    if (listStatus == 2) {
      var statusHeader = null;

      var userList = [status.components.view({ backgroundColor: '#2bd18e', flex: 1, alignItems: 'center', justifyContent: 'center' },
       [
        status.components.text({ style: { textAlign: 'center', padding: 5, color: '#fff', fontSize: 24 }},
          "List is closed"
        ),
        status.components.text({ style: { textAlign: 'center', padding: 5, color: 'rgba(255,255,255, 0.7)', fontSize: 18 }},
          "If you had to receive money, take a look in your wallet :)"
        ),
       ]
      )]
    }

    var viewScreen = [status.components.view(
        viewStyles.header,
        [statusHeader]
    ), status.components.scrollView({ horizontal: true, pagingEnabled: true, backgroundColor: "#fff", flexDirection: 'row' },
        [status.components.view(
          { flexDirection: 'column', width: 410 },
          userList
        )]
      )
    ];

    var screen = [status.components.view(
      { alignItems: 'stretch', flexDirection: 'column', width: 410 },
      viewScreen
    )];

    var view = status.components.scrollView(
      {
        horizontal: true,
        pagingEnabled: true,
        backgroundColor: "#fff",
        flexDirection: 'row',
      },
      screen
    );
  }
  return {
    title: "View list",
    dynamicTitle: false,
    singleLineInput: true,
    markup: view
  };
}

status.command({
  name: "view",
  title: "view",
  registeredOnly: true,
  description: "View a list with its members",
  color: "#2bd18e",
  fullscreen: true,
  onSend: showViewList,
  params: [{
    name: "list",
    type: status.types.TEXT,
    placeholder: "Select list",
    suggestions: listSuggestions
  }],
});


/*
 * ACTIVATE
 */

status.command({
  name: "activate",
  title: "activate",
  registeredOnly: true,
  description: "Activate a list",
  color: "#2bd18e",
  params: [{
    name: "name",
    type: status.types.TEXT,
    placeholder: "Select list",
    suggestions: listSuggestions
  }],
  preview: function (params) {
    return {
        markup: status.components.view({}, [
          status.components.text({
            style: {
              marginTop: 5,
              fontSize: 15,
            }
          }, "Activating the list named: "),
          status.components.text({
            style: {
              marginTop: 2,
              fontSize: 15,
              fontWeight: 'bold',
            }
          }, params.name),
        ])
      }
    },
  handler: function(params) {  
    var list = getList(params.name);
    var addresses = [];
    for (var i = 0; i < list.users.length; i++) {
      addresses.push(list.users[i]);
    }

    var myContractInstance = WhoPaysContract.new(params.name, addresses, {
      from: web3.eth.accounts[0],
      data: byteCode,
      gas: '2500000'
    });

    status.sendMessage("Creating the list. This might take some time..");
    var hash = waitForTransactionHash(myContractInstance.transactionHash);
    addContractToList(params.name, hash.contractAddress);
    status.sendMessage("List created. Copy the address below to the friends you added to this list.");
    status.sendMessage(hash.contractAddress);
  }
});

/*
 * ADD EXPENSE
 */

status.command({
  name: "add-expense",
  title: "Add an expense",
  registeredOnly: true,
  description: "Add an expense",
  color: "#2bd18e",
  sequentialParams: true,
  params: [{
    name: "list",
    type: status.types.TEXT,
    placeholder: "Select list",
    suggestions: listSuggestions
  }, {
    name: "expense",
    type: status.types.NUMBER,
    placeholder: "Enter expense",
  }],
  preview: function (params) {
    return {
        markup: status.components.view({}, [
          status.components.text({
            style: {
              marginTop: 5,
              fontSize: 15,
              color: "#000000"
            }
          }, "Added "),
          status.components.text({
            style: {
              marginTop: 2,
              fontSize: 15,
              fontWeight: 'bold',
              color: "#000000"
            }
          }, "Ξ" + params.expense),
          status.components.text({
            style: {
              marginTop: 5,
              fontSize: 15,
              color: "#000000"
            }
          }, "to: "),
          status.components.text({
            style: {
              marginTop: 2,
              fontSize: 15,
              fontWeight: 'bold',
              color: "#000000"
            }
          }, params.list),
        ])
      }
    },
  handler: function(params) {
    var list = getList(params.list);
    var hash = list.hash;
    if (list.hash) {
      var instance = WhoPaysContract.at(list.hash);
      // Set defaultAccount which is needed for transactions
      web3.eth.defaultAccount = web3.eth.accounts[0];
      var tx = instance.addExpense(web3.eth.accounts[0], web3.toWei(params.expense, 'ether'));
      status.sendMessage("Adding expense of *Ξ" + params.expense + "*. Please wait..");
      var txDone = waitForTransactionHash(tx);
      if (txDone) {
        status.sendMessage("Expense of *Ξ" + params.expense + "* added!");
      }
    }
  }
});

/*
 * REMOVE EXPENSE
 */

status.command({
  name: "remove-expense",
  title: "Remove an expense",
  registeredOnly: true,
  description: "Remove an expense",
  color: "#2bd18e",
  sequentialParams: true,
  params: [{
    name: "list",
    type: status.types.TEXT,
    placeholder: "Select list",
    suggestions: listSuggestions
  }, {
    name: "expense",
    type: status.types.NUMBER,
    placeholder: "Enter expense",
  }],
  preview: function (params) {
    return {
        markup: status.components.view({}, [
          status.components.text({
            style: {
              marginTop: 5,
              fontSize: 15,
            }
          }, "Removed "),
          status.components.text({
            style: {
              marginTop: 2,
              fontSize: 15,
              fontWeight: 'bold',
            }
          }, params.expense),
          status.components.text({
            style: {
              marginTop: 5,
              fontSize: 15,
            }
          }, "of: "),
          status.components.text({
            style: {
              marginTop: 2,
              fontSize: 15,
              fontWeight: 'bold',
            }
          }, params.list),
        ])
      }
    },
  handler: function(params) {
    var list = getList(params.list);
    var hash = list.hash;
    if (list.hash) {
      var instance = WhoPaysContract.at(list.hash);
      // Set defaultAccount which is needed for transactions
      web3.eth.defaultAccount = web3.eth.accounts[0];
      var tx = instance.removeExpense(web3.eth.accounts[0], web3.toWei(params.expense, 'ether'));
      status.sendMessage("Removing expense of *Ξ" + params.expense + "*. Please wait..");
      var txDone = waitForTransactionHash(tx);
      if (txDone) {
        status.sendMessage("Expense of *Ξ" + params.expense + "* removed!");
      }
    }
  }
});

/*
 * JOIN LIST
 */

status.command({
  name: "join",
  title: "Join a list",
  registeredOnly: true,
  description: "Join a list",
  color: "#2bd18e",
  params: [{
    name: "hash",
    type: status.types.TEXT,
    placeholder: "Enter the hash you received",
  }],
  preview: function (params) {
    return {
        markup: status.components.view({}, [
          status.components.text({
            style: {
              marginTop: 5,
              fontSize: 15,
            }
          }, "Joining the list with the hash: "),
          status.components.text({
            style: {
              marginTop: 2,
              fontSize: 15,
              fontWeight: 'bold',
            }
          }, params.hash),
        ])
      }
    },
  handler: function(params) {
    if (params.hash) {
      var instance = WhoPaysContract.at(params.hash);

      // Set defaultAccount which is needed for transactions
      web3.eth.defaultAccount = web3.eth.accounts[0];
      var name = instance.groupInfo();
      var users = instance.listMembers();
      joinListWithHash(name, users, params.hash);
      status.sendMessage("Joined the list: *" + name + "*.");
    }
  }
});

/*
 * RESOLVE
 */

status.command({
  name: "resolve",
  title: "Resolve a list",
  registeredOnly: true,
  description: "Resolve a list",
  color: "#2bd18e",
  params: [{
    name: "list",
    type: status.types.TEXT,
    placeholder: "List name",
    suggestions: listSuggestions
  }],
  preview: function (params) {
    return {
        markup: status.components.view({}, [
          status.components.text({
            style: {
              marginTop: 5,
              fontSize: 15,
            }
          }, "Resolving the list named: "),
          status.components.text({
            style: {
              marginTop: 2,
              fontSize: 15,
              fontWeight: 'bold',
            }
          }, params.list),
        ])
      }
    },
  handler: function(params) {
    if (params.list) {
      var list = getList(params.list);
      if (list.hash) {
        var instance = WhoPaysContract.at(list.hash);
        // Set defaultAccount which is needed for transactions
        web3.eth.defaultAccount = web3.eth.accounts[0];
        var tx = instance.contractResolve();
        status.sendMessage("Resolving the contract. Let's calculate the balances..");
        var txDone = waitForTransactionHash(tx);
        if (txDone) {
          status.sendMessage("Contract resolved! You can view the balance of everyone with the */view* command. You can notify your friends they can pay.");
        }
      }
    }
  }
});

/*
 * PAY
 */

status.command({
  name: "pay",
  title: "Pay",
  registeredOnly: true,
  description: "Pay what you owe",
  color: "#2bd18e",
  sequentialParams: true,
  params: [{
    name: "list",
    type: status.types.TEXT,
    placeholder: "List name",
    suggestions: listSuggestions
  }],
  preview: function (params) {
    return {
        markup: status.components.view({}, [
          status.components.text({
            style: {
              marginTop: 5,
              fontSize: 15,
            }
          }, "Paying to the list: "),
          status.components.text({
            style: {
              marginTop: 2,
              fontSize: 15,
              fontWeight: 'bold',
            }
          }, params.list),
        ])
      }
    },
  handler: function(params) {
    if (params.list) {
      var list = getList(params.list);
      if (list.hash) {
        var instance = WhoPaysContract.at(list.hash);
        // Set defaultAccount which is needed for transactions
        web3.eth.defaultAccount = web3.eth.accounts[0];
        var balance = instance.memberBalance(web3.eth.accounts[0]);
        if (balance[1] === false) {
          var tx = instance.memberAddPay(web3.eth.accounts[0], { value: balance[0]});
          status.sendMessage("Transfering money to the list. Should take a moment..");
          var txDone = waitForTransactionHash(tx);
          if (txDone) {
            status.sendMessage("You paid successfully.");
          }
        } else {
          status.sendMessage("You don't have to pay anything.");
        }
      }
    }
  }
});
