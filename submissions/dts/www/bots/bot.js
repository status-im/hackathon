var c = {
  "contract_name": "AdsRegistry",
  "abi": [
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
  ],
  "unlinked_binary": "0x6060604052341561000c57fe5b5b6107088061001c6000396000f300606060405263ffffffff60e060020a6000350416630955ae998114610042578063b665816b14610239578063bff821b21461024b578063ebf6cede1461026d575bfe5b341561004a57fe5b610052610294565b6040518080602001806020018060200180602001806020018060200187810387528d8181518152602001915080519060200190602002808383600083146100b4575b8051825260208311156100b457601f199092019160209182019101610094565b5050509190910188810387528d5181528d5160209182019250818f01910280838382156100fc575b8051825260208311156100fc57601f1990920191602091820191016100dc565b5050509190910188810386528c5181528c5160209182019250818e0191028083838215610144575b80518252602083111561014457601f199092019160209182019101610124565b5050509190910188810385528b5181528b5160209182019250818d019102808383821561018c575b80518252602083111561018c57601f19909201916020918201910161016c565b5050509190910188810384528a5181528a5160209182019250818c01910280838382156101d4575b8051825260208311156101d457601f1990920191602091820191016101b4565b50505091909101888103835289518152895160209182019250818b019102808383821561021c575b80518252602083111561021c57601f1990920191602091820191016101fc565b5050509050019c5050505050505050505050505060405180910390f35b341561024157fe5b61024961055b565b005b341561025357fe5b61025b610563565b60408051918252519081900360200190f35b341561027557fe5b610249600160a060020a0360043516602435604435606435610569565b005b61029c61066a565b6102a461066a565b6102ac61066a565b6102b461066a565b6102bc61066a565b6102c461066a565b6102cc61066a565b6102d461066a565b6102dc61066a565b6102e461066a565b6102ec61066a565b6102f461066a565b600060006103006106a0565b6001546040518059106103105750595b908082528060200260200182016040525b5098506001546040518059106103345750595b908082528060200260200182016040525b5097506001546040518059106103585750595b908082528060200260200182016040525b50965060015460405180591061037c5750595b908082528060200260200182016040525b5095506001546040518059106103a05750595b908082528060200260200182016040525b5094506001546040518059106103c45750595b908082528060200260200182016040525b50935060009250600091505b6001548260ff161015610537575060ff80821660009081526020818152604091829020825160e08101845281548152600180830154600160a060020a0316938201939093526002820154938101939093526003810154606084015260048101546080840152600581015460a084015260060154909216151560c082018190529091141561052b57805189518a908590811061047857fe5b90602001906020020181815250508060200151888481518110151561049957fe5b600160a060020a03909216602092830290910190910152604081015187518890859081106104c357fe5b60209081029091010152606081015186518790859081106104e057fe5b60209081029091010152608081015185518690859081106104fd57fe5b6020908102909101015260a0810151845185908590811061051a57fe5b602090810290910101526001909201915b5b6001909101906103e1565b8888888888889e509e509e509e509e509e505b505050505050505050909192939495565b60006001555b565b60015481565b6105716106a0565b60018054808352600160a060020a03878116602080860191825260408087018a815260608089018b81526080808b018c815260c08c018b81524260a08e0190815260009b8c528b89529a8790208d518082559951818e018054600160a060020a03191691909c16908117909b55955160028701819055935160038701819055915160048701559951600586015598516006909401805460ff191694151594909417909355885489019098558251948552928401949094528281019590955281019290925291517fd6597948dbc3fd79377de6a1e2d0ad5546f7d0520a5110123d3f476d650b5d62929181900390910190a15b5050505050565b60408051602081019091526000815290565b60408051602081019091526000815290565b60408051602081019091526000815290565b6040805160e081018252600080825260208201819052918101829052606081018290526080810182905260a0810182905260c0810191909152905600a165627a7a72305820da3d7081ee963e629ce53f84f766121a4ad240fe9f88923f26823f9b0dae93670029",
  "networks": {
    "1496523973891": {
      "events": {
        "0xd6597948dbc3fd79377de6a1e2d0ad5546f7d0520a5110123d3f476d650b5d62": {
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
      },
      "links": {},
      "address": "0x65a26284f2a38a624270990f19b153c9edd6497a",
      "updated_at": 1496541908202
    },
    "1496570673415": {
      "events": {
        "0xd6597948dbc3fd79377de6a1e2d0ad5546f7d0520a5110123d3f476d650b5d62": {
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
      },
      "links": {},
      "address": "0xa07ddaff6d8b7aabf91ac6f82bf89455eb9784f4",
      "updated_at": 1496570691510
    },
    "1496572721527": {
      "events": {
        "0xd6597948dbc3fd79377de6a1e2d0ad5546f7d0520a5110123d3f476d650b5d62": {
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
      },
      "links": {},
      "address": "0xa07ddaff6d8b7aabf91ac6f82bf89455eb9784f4",
      "updated_at": 1496572792005
    },
    "1496574500671": {
      "events": {
        "0xd6597948dbc3fd79377de6a1e2d0ad5546f7d0520a5110123d3f476d650b5d62": {
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
      },
      "links": {},
      "address": "0xd26192b2e3072ea2bd69b4389685e4a67f4c988f",
      "updated_at": 1496608475009
    },
    "1496691470995": {
      "events": {
        "0xd6597948dbc3fd79377de6a1e2d0ad5546f7d0520a5110123d3f476d650b5d62": {
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
      },
      "links": {},
      "address": "0x778b4731193290008244d4a0da026ab2f0e685c3",
      "updated_at": 1496697238937
    },
    "1496775160974": {
      "events": {
        "0xd6597948dbc3fd79377de6a1e2d0ad5546f7d0520a5110123d3f476d650b5d62": {
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
      },
      "links": {},
      "address": "0x80cfcfacaa4ea883766d07b213b416a4e3e3e612",
      "updated_at": 1496776119111
    },
    "1496778996528": {
      "events": {
        "0xd6597948dbc3fd79377de6a1e2d0ad5546f7d0520a5110123d3f476d650b5d62": {
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
      },
      "links": {},
      "address": "0xa07ddaff6d8b7aabf91ac6f82bf89455eb9784f4",
      "updated_at": 1496779017968
    },
    "1496823572442": {
      "events": {
        "0xd6597948dbc3fd79377de6a1e2d0ad5546f7d0520a5110123d3f476d650b5d62": {
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
      },
      "links": {},
      "address": "0xc900ec4775055002de31035a1a3011376cb7b39d",
      "updated_at": 1496824454590
    },
    "1496861053367": {
      "events": {
        "0xd6597948dbc3fd79377de6a1e2d0ad5546f7d0520a5110123d3f476d650b5d62": {
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
      },
      "links": {},
      "address": "0xdfdd31f1f7d1478d311573104189845c70a0ed34",
      "updated_at": 1496862715267
    }
  },
  "schema_version": "0.0.5",
  "updated_at": 1496862715267
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
                 }, "Hello from the other side!");
             return {markup: status.components.view({}, [text])};
         }
 });