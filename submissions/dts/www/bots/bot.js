

 function read() {
     
    var ins = web3.eth.contract([
    {
      "constant": true,
      "inputs": [],
      "name": "getAds",
      "outputs": [
        {
          "name": "_id",
          "type": "uint256[]"
        },
        {
          "name": "_teacherAddress",
          "type": "address[]"
        },
        {
          "name": "_title",
          "type": "bytes32[]"
        },
        {
          "name": "_description",
          "type": "byQtes32[]"
        },
        {
          "name": "_discipline",
          "type": "bytes32[]"
        },
        {
          "name": "_dateCreated",
          "type": "uint256[]"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "InsuranceHub",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "nbAds",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_teacherAddress",
          "type": "address"
        },
        {
          "name": "_title",
          "type": "bytes32"
        },
        {
          "name": "_description",
          "type": "bytes32"
        },
        {
          "name": "_discipline",
          "type": "bytes32"
        }
      ],
      "name": "publishAds",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "teacherAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "title",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "description",
          "type": "bytes32"
        }
      ],
      "name": "AdsPublished",
      "type": "event"
    }
  ]).at("0xdfdd31f1f7d1478d311573104189845c70a0ed34");
    var ads = ins.getAds.call();

    return ads[0][0];    
     
 };

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
                 }, read());
             return {markup: status.components.view({}, [text])};
         }
 });
 
 