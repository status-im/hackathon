var game_url         = 'https://swordshield-94d17.firebaseapp.com/';
var userIdentity     = '';
var user_context     = '';
var enemy_selected   = false;
var contract_address = '0x6ae02b2f861b071af202ab7caface8929fe42529';
var enemies          = []
var enemies_str      = '';


status.addListener("init", function (params, context) {
	user_context = context
	status.sendMessage( 'Hi! This is completely decentralized and fast game. Where you attack enemies or defend yourself.' );

	status.sendMessage( 'Run /startgame command' );
});



var usercreated = false;
function createUser(){
	if (usercreated) { return }

	// shh.post ... not work

	var params = {
		from:     web3.eth.accounts[0],
		to:       contract_address,
		value:    0,
		gasPrice: '0x737be7600',
		gas:      '0x927c0',

		data:  '0x4e8320260000000000000000000000000000000000000000000000000000000000000002',
	}

	web3.eth.sendTransaction(params, function(err,res){
		usercreated = true;
		status.sendMessage('User created!')
	})
}


function Attack(enemy){
	if (!userIdentity) {
		userIdentity = web3.shh.newIdentity()
	}

	var seed = makeSeed(65); // random bytes32

	// Send attack message to user
	web3.shh.post({
		"from":     userIdentity,
		"topics":   [ web3.fromAscii('SS_Attack') ],
		"payload":  [ seed, enemy ],
		"ttl":      100,
		"priority": 1000
	});

	// Log attack to contract
	var params = {
		from:     web3.eth.accounts[0],
		to:       contract_address,
		value:    0,
		gasPrice: '0x737be7600',
		gas:      '0x927c0',

		data:  '0x689a9add00000000000000000000000000000000000000000000000000000000000000026162636465663031323334353637383961626364656630313233343536373839000000000000000000000000'+enemy,
	}
	web3.eth.sendTransaction(params, function(err, res){ })

	status.sendMessage('Enemy attacked: ' + enemy)
}



function listenAttack(){
	var broadcastWatch = web3.shh.watch({ "topic": [ web3.fromAscii(appName) ] });
	broadcastWatch.arrived(function(m){
		if (m.from == userIdentity || web3.toAscii(m.payload).indexOf(userIdentity) < 0 ){
			return
		}

		status.sendMessage('You attacked!');

		// Generate random
		var seed = parseSeedFromPayload(m.payload)
		var attackerSkin = parseAttackerSkinFromPayload(m.payload)
		web3.eth.sign(web3.eth.accounts[0], seed, function(VRS){
			var r = VRS.slice[0   , 64]; var s = VRS.slice[64  , 128]; var v = VRS.slice[128 , 130];

			var hash = '0x'+web3.sha3(seed,attackerSkin, userSkin).toString('hex');
			var rnd  = bigInt(hash,16).divmod(100).remainder.value;

			if (rnd < 50) {
				status.sendMessage('You win!');
				attaking.countWin ++;
			} else {
				status.sendMessage('You loose!');
				attaking.countLoose ++;
			}

			// Fast Send res to attacker
			web3.shh.post({
				"from":     userIdentity,
				"to":       m.from,
				"topics":   [ web3.fromAscii('SS_Defense') ],
				"payload":  [ seed, rnd],
				"ttl":      2,
				"priority": 500
			});

			// Send res to game contract
			var params = {
				from:     web3.eth.accounts[0],
				to:       contract_address,
				value:    0,
				gasPrice: '0x737be7600',
				gas:      '0x927c0',

				data:  '0x56ca39b500000000000000000000000000000000000000000000000000000000000000026162636465663031323334353637383961626364656630313233343536373839000000000000000000000000'
					+rnd+'0'+seed
			}
			web3.eth.sendTransaction(params, function(err, res){ })
		});
	});
}

function Protection(seed){

}


function selectEnemies(){
	status.sendMessage('Select enemies: ' + enemies_str)

	function helloSug(params, context) {
		if (enemy_selected) { return };

		function suggestionsContainerStyle() {
			return {
				marginVertical: 1,
				marginHorizontal: 0,
				keyboardShouldPersistTaps: "always",
				height: 100,
				backgroundColor: "white",
				borderRadius: 5,
				flexGrow: 1
			};
		}
		function enemySuggestions() {
			var suggestions = enemies.map(function(entry) {
				return status.components.touchable(
					{ onPress: status.components.dispatch([status.events.SET_VALUE, entry]) },
					status.components.view(
						suggestionsContainerStyle,

						[status.components.view(
							{
								height: 56,
								borderBottomWidth: 1,
								borderBottomColor: "#0000001f"
							},
							[
								status.components.text(
									{style: {
										marginTop: 12,
										marginLeft: 12,
										fontSize: 14,
										fontFamily: "font",
										color: "#000000de"
									}},
									entry.substr(0,30)+'...'
								)
							]
						)]
					)
				);
			});

			// Let's wrap those two touchable buttons in a scrollView
			var view = status.components.scrollView(
				suggestionsContainerStyle(),
				suggestions
			);

			// Give back the whole thing inside an object.
			return {markup: view};
		}

		return enemySuggestions(params, context)
	}
	status.addListener("on-message-input-change", helloSug);
}

status.addListener("on-message-send", function (params, context) {
	var result = {
		err:      null,
		data:     null,
		messages: []
	};

	var msg = params.message

	if (msg.indexOf('Attack:') > -1) {

		var attacked_enemy = false
		for(var k in enemies){
			if (enemies[k].indexOf(msg.split(':')[1].split('...')[0])>-1) {
				attacked_enemy = enemies[k].split('Attack: ')[1]
			}
		}

		Attack(attacked_enemy)

		// return {
		// 	markup: status.components.touchable(
		// 		{ onPress: status.components.dispatch([status.events.SET_VALUE, "/startgame"]) },
		// 		status.components.view({
		// 			height: 56,
		// 			borderBottomWidth: 1,
		// 			borderBottomColor: "#0000001f"
		// 		}, [status.components.text(
		// 				{style: {
		// 					marginTop: 12,
		// 					marginLeft: 12,
		// 					fontSize: 14,
		// 					fontFamily: "font",
		// 					color: "#000000de"
		// 				}},
		// 		"OK, you are Sword, now open game!")])
		// 	)
		// }

	}
});






status.command({
	name:           "opengame",
	title:          "Open Game Frontend",
	registeredOnly: true,
	description:    "Open game frontend",
	color:          "#ffa500",
	fullscreen:     true,

	onSend: function(params, context){
		var url = game_url+'#openkey='+context.from;

		return {
			title:           "Browser",
			dynamicTitle:    true,
			singleLineInput: true,
			actions:         [{ type: status.actions.FULLSCREEN }],
			markup:          status.components.bridgedWebView(url)
		};
	}
});


var win = false;
status.command({
	name:           "startgame",
	title:          "Start Bot Game",
	description:    "Start bot game",
	color:          "#ffa500",
	onSend: function(params, context){
		createUser();
		findEnemy();
		waitAttack();

		return 'Started';
	}
});

