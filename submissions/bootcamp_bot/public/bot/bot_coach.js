var BP_ABI = [{"constant":true,"inputs":[],"name":"NbOfChallenges","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"nbOfSessions","type":"uint256"},{"name":"name","type":"string"}],"name":"NewChallenge","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"challengeId","type":"uint256"}],"name":"ValidateNewSession","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"challengeId","type":"uint256"}],"name":"getName","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"challengeId","type":"uint256"}],"name":"ViewState","outputs":[{"name":"","type":"uint256[2]"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}];
var BPContract = web3.eth.contract(BP_ABI);
var BPInstance = BPContract.at('0xf8708cfc0951b3cfa40e209088f2752daf0935da');
var DB_PREFIX = 'savewithstatus_bootcamp_'
var COLORS = {
  DEFAULT_COMMAND: '#333FFF',
  BALANCE_POSITIVE: 'green',
  BALANCE_NEGATIVE: 'red'
}

// -------------------------------------------------------------------------
// ----------------------   	Generic functions	   ---------------------
// -------------------------------------------------------------------------
function waitForMining(txHash) {
  var mined = false
  var receipt
  while (!mined) {
    receipt = web3.eth.getTransactionReceipt(txHash)
    if (!receipt) continue
    if (receipt.contractAddress || receipt.gasUsed) mined = true
  }
  return receipt
}

function ErrorLog(f) {
  var g = function (params, context) {
    try {
      return f(params, context);
    } catch (e) {
      console.log(e);
    }
  }
  return g;
}

function saveToDb(item, value) {
  localStorage.setItem(addDbPrefix(item), value)
}

function getFromDb(item) {
  return localStorage.getItem(addDbPrefix(item))
}

function removeFromDb(item) {
  return localStorage.removeItem(addDbPrefix(item))
}

function addDbPrefix(item) {
  return DB_PREFIX + item
}

function initDbVariable(){

}



// -------------------------------------------------------------------------
// ----------------------   	Commands functions	   ---------------------
// -------------------------------------------------------------------------


function initSuggestions() {
  var suggestions = status.components.scrollView({style: {margin: 10}}, [
    status.components.image(
      {
        source: {uri: "http://mediaprocessor.websimages.com/width/300/crop/0,0,300x155/www.centreks.fr/6572626_orig.jpg"},
        style: {
        width: 240,
        height: 120,
        marginLeft: 'auto',
        marginRight: 'auto'
      }
    }),
    status.components.text({style: {fontWeight: 'bold', textAlign: 'center' }}, 'Blockchain as a Coach'),
    status.components.text({style: {marginTop: 10}}, 'Hello soldier! Welcome to Bootcamp!'),
    status.components.text({style: {marginTop: 5, marginLeft: 20}}, 'Bootcamp helps you to reach you goals using\n' +
      'Smart Contracts as referee and Ether as leverage.\n' +
      'Challenge yourself by putting some money at.\n' +
      'Stake. Each milestone accomplished allows you\n' +
      'to get progressively your funds back. Enjoy!'),
    status.components.text({style: {marginTop: 10, color: 'red'}}, 'Type /help for more information.')
  ])
  return {markup: suggestions}
}


// -----------------------------------------
// ------ 	    Add Challenge  	      ------
// -----------------------------------------
function createChallengeSuggestions() {
  var suggestions = status.components.scrollView({style: {margin: 10}}, [
    status.components.image(
            {
                source: {uri: "https://hoiquanphidung.com/uploadhinh/hqpd2/HQPD_1355597558.jpg"},
                style: {
                    width: 100,
                    height: 105,
					marginLeft: 'auto',
					marginRight: 'auto'
                }
            }),
    status.components.text({style: {fontWeight: 'bold', textAlign: 'center' }}, 'To create a new challenge you need to provide'),
    status.components.text({style: {marginTop: 5, color: 'green', fontWeight: 'bold'}}, 'A challenge name:'),
    status.components.text({style: {marginLeft: 20}}, '"Marathon training", "March Gym Sessions", ...'),
    status.components.text({style: {marginTop: 5, color: 'green', fontWeight: 'bold'}}, 'A number of sessions:'),
    status.components.text({style: {marginLeft: 20}}, 'An integer representing the number of milestones.'),
    status.components.text({style: {marginTop: 5, color: 'green', fontWeight: 'bold'}}, 'The Ether at stake:'),
    status.components.text({style: {marginLeft: 20}}, 'How much money your need to motivate yourself.')
  ])
  return {markup: suggestions}
}




// -----------------------------------------
// ------ 	    Start training 	      ------
// -----------------------------------------
function trainChallengeSuggestions() {
	var listMyChallenge = "Friday Running, Marathon"
	var myLocation = "Hyde Park"

	var nameSuggestions = status.components.scrollView({style: {margin: 10}}, [
	status.components.image(
			{
				source: {uri: "https://www.skr.su/var/files/175381.jpg/uploaded-files/175381/x.jpg"},
				style: {
					width: 130,
					height: 120,
					marginLeft: 'auto',
					marginRight: 'auto'
				}
			}),
	status.components.text({style: {fontWeight: 'bold', textAlign: 'center' }}, 'How to start a challenge'),,
	status.components.text({style: {marginTop: 10, color: 'grey'}}, 'Run Command:'),
	status.components.text({style: {marginLeft: 20, color: 'green', fontWeight: 'bold'}}, '/new'),
	status.components.text({style: {marginTop: 10}}, 'Steps:'),
	status.components.text({style: {marginTop: 5, marginLeft: 20}},
		'- Name: ' + listMyChallenge + '\n' +
		'- Location: where your are currently ' + myLocation + '\n' +
		'- Time : 30, 60, 180 minutes ...'),
	status.components.text({style: {marginTop: 10, fontWeight: 'bold', textAlign: 'center' }}, '\nChallenge yourself!\n Blockchain as a Coach')
	])
	return {markup: nameSuggestions}
}


// -----------------------------------------
// ------ 	  Stats of training	      ------
// -----------------------------------------

function getContractState() {
  var outp = {nbchallenges: 0, data: []};
  var nbofchallenges = BPInstance.NbOfChallenges.call({from: web3.eth.accounts[0]});
  outp.nbchallenges = nbofchallenges;
  var i;
  for(i=0;i<= nbofchallenges ; i++) {
    if(i>0) {
      var challengeState = {remsessions: 0, remether: 0, name: ''};
      var cstate = BPInstance.ViewState.call(i,{from: web3.eth.accounts[0]});
      var cname = BPInstance.getName.call(i,{from: web3.eth.accounts[0]});
      challengeState.remsessions = cstate[1];
      challengeState.remether = cstate[0];
      challengeState.name = cname;
      outp.data.push(challengeState);
    }
  }
  return outp;
}


function viewSuggestions(info) {
  var nbchal = info.nbchallenges;
  var components = [];
  components.push(status.components.text({}, 'Number of challenges:'));
  components.push(status.components.text({style: {marginLeft: 20, color: 'red', fontWeight: 'bold'}}, String(info.nbchallenges)));
  var i;
  for(i = 0; i< nbchal ; i++) {
    components.push(status.components.text({style: {marginTop: 10, color: 'blue', fontWeight: 'bold'}}, String(info.data[i].name)));
    components.push(status.components.text({style: {marginLeft: 20}}, 'Sessions remaining:'));
    components.push(status.components.text({style: {marginLeft: 20,fontWeight: 'bold'}}, String(info.data[i].remsessions)));
    components.push(status.components.text({style: {marginLeft: 20}}, 'Ether remaining:'));
    components.push(status.components.text({style: {marginLeft: 20,fontWeight: 'bold' }}, String(info.data[i].remether)));
  }
  var suggestions = status.components.scrollView({style: {margin: 10}}, components);
  return {markup: suggestions}
}


function checkSuggestions() {
  var suggestions = status.components.scrollView({style: {margin: 10}}, [
    status.components.image(
            {
                source: {uri: "https://tripodfilm.files.wordpress.com/2011/12/dodgeball_288x288.jpg"},
                style: {
                    width: 288,
                    height: 288,
					marginLeft: 'auto',
					marginRight: 'auto'
                }
            })]);
  return {markup: suggestions}
}


function statChallengeSuggestions() {
	var w_rewardObtained = "12" // getFromDb("username")
	var w_rewardPending = "1" // getFromDb("userage")
	var w_workout = "25" // getFromDb("userkey")
	var m_rewardObtained = "48" // getFromDb("username")
	var m_rewardPending = "10" // getFromDb("userage")
	var m_workout = "180" // getFromDb("userkey")

  var nameSuggestions = status.components.scrollView({style: {margin: 10}}, [
    status.components.image(
            {
                source: {uri: "http://wealthtec.in/images/solid-production.png"},
                style: {
                    width: 160,
                    height: 120,
					marginLeft: 'auto',
					marginRight: 'auto'
                }
            }),,
    status.components.text({style: {marginTop: 10, color: 'grey'}}, 'Run Command:'),
    status.components.text({style: {marginLeft: 20, color: 'green', fontWeight: 'bold'}}, '/stats'),
    status.components.text({style: {fontWeight: 'bold', textAlign: 'center' }}, 'Your performance'),
    status.components.text({style: {marginTop: 5}}, 'This week:'),
    status.components.text({style: {marginTop: 5, marginLeft: 20}},
		'- Reward obtained: ' + w_rewardObtained + ' ETH\n' +
		'- Reward pending: ' + w_rewardPending + ' ETH\n' +
		'- Workout : ' + w_workout + ' minutes\n' ),
    status.components.text({style: {marginTop: 15}}, 'This month:'),
    status.components.text({style: {marginTop: 5, marginLeft: 20}},
		'- Reward obtained: ' + m_rewardObtained + ' ETH\n' +
		'- Reward pending: ' + m_rewardPending + ' ETH\n' +
		'- Workout : ' + m_workout + ' minutes\n' ),
    status.components.text({style: {marginTop: 15}}, 'Commands:'),
    status.components.text({style: {marginTop: 5, marginLeft: 20}},
		'- list: provide a list of all running challenges\n' +
		'- history: provide a detailed recap of all the training done during this month\n' +
		'- custom: TBD ' ),
    status.components.text({style: {marginTop: 10, fontWeight: 'bold', textAlign: 'center' }}, '\nChallenge yourself! \nBlockchain as a Coach')
  ])
  return {markup: nameSuggestions}
}


// -----------------------------------------
// ------ 	      Settings  	      ------
// -----------------------------------------
function userProfilSuggestions() {
	var name = getFromDb("username")
	var age = getFromDb("userage")
	// var key = getFromDb("userkey")

  var nameSuggestions = status.components.scrollView({style: {margin: 10}}, [
    status.components.image(
            {
                source: {uri: "https://images-na.ssl-images-amazon.com/images/I/71YduWs-%2BEL.png"},
                style: {
                    width: 120,
                    height: 120,
					marginLeft: 'auto',
					marginRight: 'auto'
                }
            }),
    status.components.text({style: {fontWeight: 'bold', textAlign: 'center' }}, 'Your profil'),
    status.components.text({style: {marginTop: 5, marginLeft: 20}},
	 '- Name: ' + name + '\n' +
 	 '- Age: ' + age + ' ans\n'),
    status.components.text({style: {marginTop: 10, fontWeight: 'bold', textAlign: 'center' }}, '\nChallenge yourself! \nBlockchain as a Coach')
  ])
  return {markup: nameSuggestions}
}



// -----------------------------------------
// ------ 	      	HELP	  	      ------
// -----------------------------------------
function helpSuggestions() {
  var suggestions = status.components.scrollView({style: {margin: 10}}, [
    status.components.image(
      {
        source: {uri: "http://militarka.com.ua/media/catalog/product/cache/1/small_image/296x296/595ced8988bcd1c8f271e8edbd20654b/3/6/36951b405aba11e58e6df0795961c460_9081e88a5cc04e17b389862b91d73ba4.png"},
        style: {
        width: 96,
        height: 96,
        marginLeft: 'auto',
        marginRight: 'auto'
      }
    }),
    status.components.text({style: {marginTop: 5, color: 'green', fontWeight: 'bold'}}, '/view'),
    status.components.text({style: {marginLeft: 20}}, 'To view your challenges, funds...'),

    status.components.text({style: {marginTop: 5, color: 'green', fontWeight: 'bold'}}, '/new'),
    status.components.text({style: {marginLeft: 20}}, 'To create a new challenge.'),

    status.components.text({style: {marginTop: 5, color: 'green', fontWeight: 'bold'}}, '/check'),
    status.components.text({style: {marginLeft: 20}}, 'To validate a new milestone on a challenge.'),

    status.components.text({style: {marginTop: 5, color: 'green', fontWeight: 'bold'}}, '/profil'),
    status.components.text({style: {marginLeft: 20}}, 'To edit your profil.')
  ])
  return {markup: suggestions}
}


// -----------------------------------------
// ------ 	    Start training 	      ------
// -----------------------------------------
var trainCommand = {
  name: 'train',
  title: 'Train',
  description: 'Start a Challenge !',
  color: COLORS.DEFAULT_COMMAND,
  sequentialParams: true,
  params: [{
    name: 'name',
    placeholder: 'Select a challenge',
    type: status.types.TEXT,
    suggestions: trainChallengeSuggestions
  }, {
    name: 'location',
    placeholder: 'Where are you ?',
    type: status.types.TEXT,
    suggestions: trainChallengeSuggestions
  }, {
    name: 'timeChallenge',
    placeholder: 'How long did you train (minutes) ?',
    type: status.types.NUMBER,
    suggestions: trainChallengeSuggestions
  }],
  validator: function(params) {
    var error
	if (params.location.length < 2) {
      error = status.components.validationMessage(
        'Not a valid location',
        'What is this, your dream ?'
      )
      return {markup: error}
    }
	if (params.timeChallenge < 2) {
      error = status.components.validationMessage(
        'Not a valid timeChallenge',
        'What is this, your dream ?'
      )
      return {markup: error}
    }
  },
  preview: function(params, context) {
    var message = 	'Challenge: ' + params.name + '\n' +
					// 'Weekly expected reward this week: ' + params.paymentAmount + ' ETH\n' +
					// 'Sport type: ' + params.sportType + '\n' +
					'Location: ' + params.location + '\n' +
					'Time for this Challenge: ' + params.timeChallenge + ' minutes\n'
					// 'Target time per Week: ' + params.timeWeek + ' minutes/week\n'
    return {markup: status.components.text({}, message)}
  },
  handler: function(params, context) {
    // saveToDb('nameChallenge', params.name)
    status.sendMessage('Ok, we just need you to confirm that, one sec...')

    var message = 	'Challenge: ' + params.name + '\n' +
					// 'Weekly expected reward this week: ' + params.paymentAmount + ' ETH\n' +
					// 'Sport type: ' + params.sportType + '\n' +
					'Location: ' + params.location + '\n' +
					'Time for this Challenge: ' + params.timeChallenge + ' minutes\n'
					// 'Target time per Week: ' + params.timeWeek + ' minutes/week\n'

    status.sendMessage('Done! We added this new training\n' + message)
  }
}


// -----------------------------------------
// ------ 	      Settings  	      ------
// -----------------------------------------
var settingsCommand = {
  name: 'profil',
  title: 'Edit your profil',
  color: COLORS.DEFAULT_COMMAND,
  description: 'Set your first name',
  params: [{
		name: 'name',
		placeholder: 'Your first name',
		type: status.types.TEXT,
		suggestions: userProfilSuggestions
	  }, {
		name: 'age',
		placeholder: 'How old are you ?',
		type: status.types.NUMBER,
		suggestions: userProfilSuggestions
	  }
	  // , {
		// name: 'publicKey',
		// placeholder: 'Where is your money ^^ ?',
		// type: status.types.TEXT
		// suggestions: userProfilSuggestions
	  // }
	  ],
  sequentialParams: true,
  validator: function(params, context) {
    var error
    // also check that the name has no spaces/special chars in
    if (!/^[a-zA-Z0-9]+$/.test(params.name)) {
      error = status.components.validationMessage(
        'Uh oh',
        'I\'m only able to save English alphanumeric characters, blame my programmers...'
      )
      return {markup: error}
    }
    if (params.name.length > 20) {
      error = status.components.validationMessage(
        'Ooh, could you shorten that a little?',
        'There\'s a limit to how much I can remember, something something goldfish joke'
      )
      return {markup: error}
    }
    if (params.age < 13) {
      error = status.components.validationMessage(
        'Ooh, your are young',
        'Too young for this bot, please come back later ;)'
      )
      return {markup: error}
    }
    if (params.age > 99) {
      error = status.components.validationMessage(
        'Ooh, your sur ?!',
        'Are you still alive ? Maybe your gost'
      )
      return {markup: error}
    }
  },
  preview: function(params, context) {},
  handler: function(params, context) {
    saveToDb('username', params.name)
    saveToDb('userage', params.age)

    // not sure how to make sure that this happens after the 'preview' has been rendered
    // it sometimes looks a bit silly when we do it like this unfortunately
    status.sendMessage('Nice to meet you ' + params.name + '!')
  }
}


// -----------------------------------------
// ------ 	  Stats of training	      ------
// -----------------------------------------
var statsCommand = {
  name: 'stats',
  title: 'Stats',
  description: 'Get statistics from your training',
  color: COLORS.DEFAULT_COMMAND,
  sequentialParams: true,
  params: [{
    name: 'command',
    placeholder: 'Available: list, history, ',
    type: status.types.TEXT,
    suggestions: statChallengeSuggestions
  }],
  validator: function(params) {
    var error
	if (params.command != 'list' && params.command != 'history') {
      error = status.components.validationMessage(
        'Enknown command',
        'What is this, your dream ?'
      )
      return {markup: error}
    }
  },
  preview: function(params, context) {
    var message = 	'You selected the command: ' + params.command + '\n'
    return {markup: status.components.text({}, message)}
  },
  handler: function(params, context) {
    status.sendMessage('Ok, processing, one sec...')
    var message = 	'You selected the command: ' + params.command + '\n'
    status.sendMessage('Done! Here your training\n' + message)
  }
}



// -------------------------------------------------------------------------
// ----------------------   	Commands setter  	  ----------------------
// -------------------------------------------------------------------------

// ==> view: Get State
status.command({
     name: "view",
     title: "Get State",
     description: "Get state of the contract",
     color: "#ffaaaa",
     params: [],
     preview: function(params, context) {
       return {markup: status.components.text({}, "")}
     },
      handler: function(params, context) {
        try {
        var info = getContractState();
        status.showSuggestions(viewSuggestions(info).markup);
      } catch(e) { status.sendMessage(e);}
      }
 });


// ==> help: Get some help
status.command({
   name: "help",
   title: "Get some help",
   description: "Get some help",
   color: "#ff0000",
   params: [],
   preview: function(params, context) {
     return {markup: status.components.text({}, "")}
   },
   handler: function(params, context) {
     status.showSuggestions(helpSuggestions().markup);
   }
});


// ==> check: Check for a new milestone
status.command({
     name: "check",
     title: "Check for a new milestone",
     description: "Show you did what you should do",
     color: "#ffaaaa",
     params: [{
               name: "challengeid",
               type: status.types.TEXT,
               placeholder: "Which challenge?",
               suggestions: checkSuggestions
             }],
             preview: function(params, context) {
               return {markup: status.components.text({}, "")}
             },
      handler: function(params, context) {
        var tx = BPInstance.ValidateNewSession(params.challengeid,{from: web3.eth.accounts[0]});
        waitForMining(tx);
        var info = getContractState();
        status.showSuggestions(viewSuggestions(info).markup);
      }
 });

status.command({
     name: "new",
     title: "New challenge",
     description: "Create a new challenge",
     color: "#ff00ff",
     params: [{
               name: "p3",
               type: status.types.TEXT,
               placeholder: "Give it a name!",
               suggestions: createChallengeSuggestions
             },
            {
              name: "p1",
              type: status.types.NUMBER,
              placeholder: "How many sessions?",
              suggestions: createChallengeSuggestions
            },
            {
               name: "p2",
               type: status.types.NUMBER,
               placeholder: "How much Ether at stake?",
               suggestions: createChallengeSuggestions
             }],
      sequentialParams: true,
      preview: function(params, context) {
        return {markup: status.components.text({}, "")}
      },
      handler: function(params, context) {
        var tx = BPInstance.NewChallenge(params.p1,params.p3,{from: web3.eth.accounts[0], value: params.p2});
        waitForMining(tx);
        status.sendMessage("Hooah! Your challenge " + params.p3 + " is confirmed. You are commited to " + String(params.p1) + " sessions. There are " + String(params.p2) + " ETH at Stake.");
      }
 });

status.command(statsCommand);
status.command(settingsCommand);

// -------------------------------------------------------------------------
// ----------------------   		Listners 	  	  ----------------------
// -------------------------------------------------------------------------

status.addListener('init', function(params, context) {
   status.sendMessage('Hi soldier, Welcome to Bootcamp.')
   status.showSuggestions(initSuggestions().markup);
})


// -------------------------------------------------------------------------
// ---------------------- 	  Chatbot functions		  ----------------------
// -------------------------------------------------------------------------


var p_actions = { 'action': ['NEW', 'VIEW', 'CHECK', 'STATS', 'PROFIL', 'HELP'],
				 'NEW': { 'keywords': [ 'add', 'new', 'start', 'create', 'plan' ],
							'answer': '/new : add a training session',
							'cmd': trainChallengeSuggestions},
				 'VIEW': { 'keywords': [ 'view', 'current', 'actual' ],
							'answer': '/view : see performances of the current challenge',
							'cmd': viewSuggestions},
				 'CHECK': { 'keywords': [ 'check', 'last', 'previous' ],
							'answer': '/check : check performances on my challenges',
							'cmd': checkSuggestions},
				 'STATS': { 'keywords': [ 'stat', 'performance', 'graph', 'chart' ],
							'answer': '/stats : display challenges done, and average reward obtained',
							'cmd': statChallengeSuggestions},
				 'PROFIL': { 'keywords': [ 'settings', 'profil', 'setup', 'private' ],
							'answer': '/profil : setup the account: all your private information',
							'cmd': userProfilSuggestions},
				 'HELP': { 'keywords': [ 'help' ],
							'answer': '/help : display the help for all commands available',
							'cmd': helpSuggestions}
				}

function test_action(message, list_action, ref_action){
	for (var i = 0; i< list_action.length; i++){
		if (message.indexOf(list_action[i]) !== -1)
			return true
	}
	return false
}


status.addListener("on-message-send",
	function (params, context) {
		// Avoid empty messages
		if (params.message == '') {
			return {"text-message": "Sorry I dont understand what you meant. I'm currently quite dumb :("};
		}

		var mess = params.message.toLowerCase()

		// Try each type of potential command
		for (var i =0; i< p_actions['action'].length; i++){
			var action = p_actions['action'][i]
			if (test_action(mess, p_actions[action]['keywords'], action)){
				status.showSuggestions(p_actions[action]['cmd']())
				status.response(trainCommand)
				return {"text-message": 'The command that match your request is: ' + p_actions[action]['answer']};
			}
		}

		return {"text-message": "Sorry :(\n I'm currently quite dumb :(\n Could you be more precise"};
});
