package hog.data;

import web3.Web3;
import web3.contract.Hog;
import hog.data.GameState;

import blip.Stream;

import hog.data.HogGame;
import hog.data.Local;

typedef GameUpdate = {
	oldStatus : GameState,
	game : HogGame
}

typedef DebugContractState = {
	period: UInt,  
	szaboPaid: UInt,  
	p1NumUnits: UInt,  
	p2NumUnits: UInt,  
	position: Int,  
	turn: UInt,  
	otherPlayer: String,  
	otherSlotIndex: UInt,  
	move1: UInt,  
	move2: UInt,  
	hash: String,  
	lastTime: String,  
	creationTime: String,  
	gameSlot: String  
}

typedef GameSlotMatchingData = {
	slot : String,
	creator:String,
	creationTime : UInt,
	creationTxHash : String,
	depositInSzabo : UInt,
	periodInMinutes : UInt,
	numUnits : UInt,
	invitedPlayer : String,
	expiryTime : UInt,
	lockedTime : UInt,
	startTxHash : String
}

@:expose
class HogState{

	static public var lastInstance : HogState;

	public static function time() : Float{
		//TODO server time adjustment
		return haxe.Timer.stamp();
	}

	public var wrongNetwork : Bool = false;

	var localData : Local = new Local();

	public var gameUpdated : Stream<GameUpdate> = new Stream();
	public var lastUpdate : Float = 0;
	public var games : Map<String, HogGame> = new Map();
	var contractStates : Map<String, HogGameContractState> = new Map();
	
	
	public var registeredAddress(default,null) : Address;

	var web3 : Web3;
	var hogContract : Hog;

	var _pollingFrequencyInMilliseconds : Int;

	public var lastError : String;

	public function new(web3 : Web3, pollingFrequencyInSeconds : Float){
		lastInstance = this; //for debugging purpose

		_pollingFrequencyInMilliseconds = Std.int(pollingFrequencyInSeconds * 1000);
		this.web3 = web3;
		hogContract = Hog.at(web3, new Address(HogConfig.values.contractAddress));
		
		
		if(js.Browser.window.location.search.indexOf("hogstate.json=true") != -1){
			debugUpdate();
		}else{
			update();
		}

		quickUpdate();
		if(web3.eth.defaultAccount == null){ //TODO remove that condition ?
			getAccounts();
		}else{
			accounts[web3.eth.defaultAccount] = new bignumberjs.BigNumber("0");
			updateBalances();
		}

		if(HogConfig.values.networkID != null){
			web3.version.getNetwork(function(err,networkId){
				if(err == null && networkId != HogConfig.values.networkID && !(HogConfig.values.networkID == "testrpc" &&  networkId != "3" &&  networkId != "0" &&  networkId != "2"&&  networkId != "1" ) ){
					wrongNetwork = true; //TODO use it
					trace("ERROR", "wrong network " + networkId + " instead of  " + HogConfig.values.networkID);
				}
			});
		}
		
		
	}

	//from scenario runner : TODO : share
	function getSlot(address : String, index : UInt) : String{
		var slot : String = address;
		if(index > 0){
			slot = "0x" + StringTools.hex(index) + slot.substr(2);
		}
		return slot;
	}
	function getAddress(slot : String) : String{
		return "0x" + slot.substr(slot.length - 40);
	}

	function debugUpdate(){
		lastUpdate = haxe.Timer.stamp();
		//TODO use local storage to check secret, if the user has already seen the end turn ....

		if(kha.Assets.blobs.hogstate_json != null){
			var newContractStates : Array<DebugContractState> = haxe.Json.parse(kha.Assets.blobs.hogstate_json.toString());
			for(contractState in newContractStates){
				contractStates[contractState.gameSlot] = parseContractState({
					period: contractState.period,  
					szaboPaid: contractState.szaboPaid,  
					p1NumUnits: contractState.p1NumUnits,  
					p2NumUnits: contractState.p2NumUnits,  
					position: contractState.position,  
					turn: contractState.turn,  
					otherPlayer: new Address(contractState.otherPlayer),  
					otherSlotIndex: contractState.otherSlotIndex,  
					move1: contractState.move1,  
					move2: contractState.move2,  
					hash: contractState.hash,  
					lastTime: new bignumberjs.BigNumber(contractState.lastTime),  
					creationTime: new bignumberjs.BigNumber(contractState.creationTime),  
					gameSlot: new bignumberjs.BigNumber(contractState.gameSlot)  
				},contractState.gameSlot);

				updateStatus(contractState.gameSlot,contractStates[contractState.gameSlot]);
			}
		}
		haxe.Timer.delay(debugUpdate,700);
	}


	function updateStatus(id : String, contractState : HogGameContractState, ?newGameData : GameData = null) : Void{
		var status : GameState = contractState.status;

		var localGameData = localData.getGameData(id);
		if(newGameData != null){
			localGameData = newGameData;
		}

		if(localGameData != null){

			//should not need this : 
			// if(localGameData.status != Arena && localGameData.creationTime != contractState.creationTime){ //new
			// 		trace("INFO","localData out of date! " + id);
			// 		localGameData = { //TODO NoLocalData with no care for expired status
			// 			creationTime : contractState.creationTime,
			// 			turn : 0, //not seen
			// 			txHash : null,
			// 			status : status,
			// 			lastMove : 0,
			// 			lastlastMove : 0,
			// 			lastSecret : null
			// 		}
			// 	}
			// }

			
			switch(contractState.status){
				case None:
					if(localGameData.status == CreatingGame){

						status = CreatingGame;

						trace("INFO", "testing CreatingGame ... " + localGameData.txHash);
						//for now
						web3.eth.getTransaction(cast localGameData.txHash,function(err,transaction){
							if(transaction != null && transaction.blockNumber !=null){
								var localGameData = localData.getGameData(id);
								localGameData.status = WaitingOponent;
								localData.setGameData(id, localGameData);
								grabContractState(id, function(error, newContractState){

								});
								
							}
						});
						
					}else if(localGameData.status == StartingGame){
						
						status = StartingGame; 
						trace("INFO", "testing StartingGame ... " + localGameData.txHash);
						//for now
						web3.eth.getTransaction(cast localGameData.txHash,function(err,transaction){
							if(transaction != null && transaction.blockNumber !=null){
								var localGameData = localData.getGameData(id);
								localGameData.status = YourTurn;
								localData.setGameData(id, localGameData);
								grabContractState(id, function(error, newContractState){
									
								});
							}
						});
						
					}else if(localGameData.status == OponentTurn){
						status = Arena;  //repeat what is commented below ?
						///TODO Done when game is ended ?
					}else if(localGameData.status == Arena){
						status = Arena; //stay in the arena until decided
					}else if(localGameData.status == SendingUnits){ //in case SendingUnits come
						trace("INFO","None to Arena via SendingUnits ");
						status = Arena; //stay in the arena until decided
					}else{
						trace("Existing to None : " + localGameData.status);
					}

				case WaitingOponent:



				case OponentFirstMove:

				case YourTurn: 
					if(localGameData.status == OponentTurn){
						status = Arena; //TODO Done when game is ended
					}else if(localGameData.status == SendingUnits){
						status = SendingUnits; 
						trace("INFO", "testing SendingUnits ... " + localGameData.txHash);
						//for now
						web3.eth.getTransaction(cast localGameData.txHash,function(err,transaction){
							if(transaction != null && transaction.blockNumber !=null){
								var localGameData = localData.getGameData(id);
								localGameData.status = OponentTurn;
								localData.setGameData(id, localGameData);
								grabContractState(id, function(error, newContractState){
									
								});
							}
						});
					}else{
						status = YourTurn;
					}

				case OponentTurn:
			}

		}else{
			if(status != None){
				trace("INFO","NoLocalData", status);
				status = NoLocalData;
			}
		}

		
		if(contractState.isExpired()){ //TODO Carefull check for done first
			trace("INFO", "isExpired", status);
			if(status == Collecting){
				status = Collecting;
			}else if(status == Quitting){
				status = Quitting;
			}else if(status == SendingUnits){
				status = SendingUnits;
			}else{
				switch(contractState.status){
					case None:
						status = None; 
					case WaitingOponent:
						if(localGameData != null && localGameData.status == Collecting){
							status = Collecting;
						}else if(localGameData != null && localGameData.status == Quitting){
							status = Quitting;
						}else{
							status = NobodyJoined;
						}
					case OponentFirstMove:
						if(localGameData != null && localGameData.status == Collecting){
							status = Collecting;
						}else if(localGameData != null && localGameData.status == Quitting){
							status = Quitting;
						}else{
							status = OponentLate;
						}
					case OponentTurn:
						if(localGameData != null && localGameData.status == Collecting){
							status = Collecting;
						}else if(localGameData != null && localGameData.status == Quitting){
							status = Quitting;
						}else{
							status = OponentLate;
						}
					case YourTurn: 
						if(localGameData != null && localGameData.status == Collecting){
							status = Collecting;
						}else if(localGameData != null && localGameData.status == Quitting){
							status = Quitting;
						}else{
							status = YouLate;
						}
					 	
				}
			}
		}

		if(localGameData != null){
			trace("from " + localGameData.status + " to " + status + " : " + id);
			localGameData.status = status;
			localData.setGameData(id, localGameData);
		}



		// use function 
		var game_position = contractState.position;
		var game_numUnits = contractState.numUnits;
		var game_oponentNumUnits = contractState.oponentNumUnits;
		var game_lastMove = 0;
		var game_lastOponentMove = 0;
		if(localGameData != null){
			if(contractState.turn < 3){
				//same
				game_position = contractState.position;
				game_numUnits = contractState.numUnits;
				game_oponentNumUnits = contractState.oponentNumUnits;

				 //alow Arena at the end to show correct values
				game_lastMove = contractState.move;
				game_lastOponentMove = contractState.oponentMove;
			}else{
				var turn = contractState.turn;
				var numUnits = contractState.numUnits;
				var oponentNumUnits = contractState.oponentNumUnits;
				var move = contractState.move;
				var oponentMove = contractState.oponentMove;
				var lastMove = localGameData.lastMove;
				if(localGameData.status == SendingUnits){
					lastMove = localGameData.lastlastMove;
				}
				if(contractState.p1){
					game_numUnits = numUnits; //turn % 2 == 0 ? numUnits : numUnits - move;
					game_oponentNumUnits = oponentNumUnits;// = turn % 2 == 0 ? oponentNumUnits : oponentNumUnits - oponentMove;
					game_position = contractState.position;
					game_lastMove = move;
					game_lastOponentMove = oponentMove;
				}else{
					if(turn %2 == 0){
						game_numUnits = numUnits - lastMove; // turn % 2 == 0 ? numUnits - lastMove : numUnits;
						game_oponentNumUnits = oponentNumUnits - oponentMove;// turn % 2 == 0 ? oponentNumUnits - oponentMove : oponentNumUnits;
						game_position = contractState.position;
						if(lastMove > oponentMove){ 
							game_position += 1;
						}
						if(lastMove < oponentMove){ 
							game_position -= 1;
						}
					}else{
						game_numUnits = numUnits; 
						game_oponentNumUnits = oponentNumUnits;
						game_position = contractState.position;
					}
					game_lastMove = lastMove;
					game_lastOponentMove = oponentMove;
				}
			}
		}

		var game = games[id];
		if(game == null){
			game = new HogGame(id,status,contractState);
			games[id] = game;
		}
		//TODO use contructor
		game.position = game_position;
		game.numUnits = game_numUnits;
		game.oponentNumUnits = game_oponentNumUnits;
		game.lastMove = game_lastMove;
		game.lastOponentMove = game_lastOponentMove;


		var gameEnding = game.gameEnding();
		if(status == Arena && !game.contractState.p1 &&  gameEnding != NotYet){
			trace("INFO",gameEnding);
			move(id,0);
		}

		//TODO now
		// //auto collecting
		// //TODO localGameData null
		// if(localGameData != null && localGameData.status != Collecting && contractState.isExpired() && contractState.status != None && contractState.status != YouLate ){
		// 	if(localGameData != null){
		// 		localGameData.status = Collecting;
		// 		@:privateAccess game.localStatus = Collecting;
		// 		localData.setGameData(id, localGameData);
		// 		//TODO ? collect(id,contractState.status);
		// 	}else{
		// 		trace("ERROR", "cannot auto collect since local data missing");
		// 	}
			
		// }

		
		if(status != game.localStatus){
			trace("INFO","gameUpdated", game);
			var oldStatus = game.localStatus;
			@:privateAccess game.localStatus = status;
			// trace("oldStatus", oldStatus);
			// trace("game", haxe.Json.stringify(game));

			gameUpdated.propagate({oldStatus:oldStatus,game:game});
		}


	}



	public function hasEnoughBalance() : Bool{
		//for now
		return accounts[registeredAddress] != null && accounts[registeredAddress].gt(new bignumberjs.BigNumber("200000000000000000"));
	}

	public var currentAccount(default,null) : Address;
	public var accounts(default,null) : Map<Address,bignumberjs.BigNumber> = new Map();
	
	// public function setCurrentAccount(account : Address){
	// 	_setCurrentAccount(account);
	// 	accountManualySet = currentAccount != null;
	// }

	public function _setCurrentAccount(account : Address){
		if(account != currentAccount){
			this.currentAccount = account;
			// currentAccountChanged.propagate(currentAccount);
		}else{
			this.currentAccount = account;
		}
		web3.eth.defaultAccount = account;
	}

	var accountTimer : haxe.Timer;
	var _waitingForAccounts : Bool = false;
	function getAccounts(){
		if(_waitingForAccounts){
			return;
		}
		_waitingForAccounts = true;
		// trace("listenning for accounts");
		web3.eth.getAccounts(function(error, accountsReceived){
			_waitingForAccounts = false;
			if(error != null){
				trace("ERROR", "error getting accounts");
				return;
			}
			accountTimer = haxe.Timer.delay(getAccounts,5000);
			updateAccounts(accountsReceived);
			updateBalances();
		});
	}

	function updateAccounts(accountsReceived : Array<Address>){		
		if(accountsReceived != null && accountsReceived.length > 0){
			// if(web3.eth.accounts != null && web3.eth.accounts.length == 1){
			// 	_setCurrentAccount(web3.eth.accounts[0]);
			// }else if(web3.eth.defaultAccount != null &&  web3.eth.defaultAccount != ""){
			// 	_setCurrentAccount(web3.eth.defaultAccount);
			// }
			var oldAccounts = accounts;
			accounts = new Map();
			for(account in accountsReceived){
				accounts[account] = oldAccounts[account];
			}
			
			if(currentAccount != null && !accounts.exists(currentAccount)){
				// accountManualySet = false;
				_setCurrentAccount(null);
				//TODO signal
			}
			
			// if(!accountManualySet){
				_setCurrentAccount(accountsReceived[0]);
			// }
			
		}else{
			this.accounts = new Map();
			_setCurrentAccount(null);
			Report.anInfo("no accounts");//TODO ?
		}
	}

	//TODO call it
	function updateBalances(){
		for(account in accounts.keys()){
			updateAccountBalance(account);
		}
		//TODO regularly check
	}
		
	function updateAccountBalance(account : Address){
		try{
			web3.eth.getBalance(account, function(error, balance){
				if(error != null){
					// setNoConnection("getBalance");
				}else{
					if(accounts.exists(account)){
						accounts[account] = balance;
					}
				}
			});
		}catch(e:Dynamic){
			// setNoConnection("getBalance catch");
		}
	}

	function quickUpdate(){
		if(registeredAddress != web3.eth.defaultAccount){
			if(registeredAddress !=  null){
				//TODO remove and add event to reset screens
				// lastUpdate = 0;
				// var keys = games.keys();
				// for(key in keys){
				// 	games.remove(key);
				// }
				// keys = contractStates.keys();
				// for(key in keys){
				// 	contractStates.remove(key);
				// }
				js.Browser.location.reload(true);
			}
			
			registeredAddress = web3.eth.defaultAccount;
			update();
		}

		haxe.Timer.delay(quickUpdate,1000);
	}


	function update(){
		lastUpdate = haxe.Timer.stamp();
		

		//TODO use getOccupancy
		if(registeredAddress != null){
			grabContractStates(registeredAddress,0,HogConfig.values.numGames, function(){
				haxe.Timer.delay(update,_pollingFrequencyInMilliseconds);
			});
		}else{
			haxe.Timer.delay(update,_pollingFrequencyInMilliseconds);
		}
		
		
	}

	function grabContractStates(address : String, i : UInt, num : UInt, next : Void -> Void){

		if(i >= num){
			next();
			return;
		}

		var slot = getSlot(address,i);
		grabContractState(slot, function(err, contractState){
			if(err != null){
				//TODO deal with err
				trace("ERROR", "probe_getGame", err);
				//retry for now :
				grabContractStates(address, i,num,next);
			}else{
				// contractStatesBag.push(contractState);

				grabContractStates(address, i+1,num,next);
			}
			
		});
	}

	function parseContractState(result : {  period: UInt,  szaboPaid: UInt,  p1NumUnits: UInt,  p2NumUnits: UInt,  position: Dynamic,  turn: UInt,  otherPlayer: web3.Web3.Address,  otherSlotIndex: UInt,  move1: UInt,  move2: UInt,  hash: String,  lastTime: bignumberjs.BigNumber,  creationTime: bignumberjs.BigNumber,  gameSlot: Dynamic  }, slot : String) : HogGameContractState{
		//  TODO (should work) : var p1 = result.gameSlot.toString(16) != slot;
		var p1 = result.otherPlayer != registeredAddress;
		var justCreated = result.turn == 1;
		var justStarted = result.turn == 2;
		var p1Turn = (result.turn >= 3 && result.turn != 255 && result.turn % 2 == 1);
		var otherPlayer : String = cast result.otherPlayer;
		var numUnits = result.p1NumUnits;
		var oponentNumUnits = result.p2NumUnits;
		var move = result.move1;
		var oponentMove = result.move2;
		var position = result.position;
		if(!p1){
			otherPlayer = getAddress(result.gameSlot.toString(16));
			numUnits = result.p2NumUnits;
			oponentNumUnits = result.p1NumUnits;
			move = result.move2;
			oponentMove = result.move1;
			position = -position;
		}

		var status : ContractGameState = 
		if(result.turn == 0){
			None;
		}else if(p1){
			if(justCreated){
				// if(result.otherPlayer == "0x" || result.otherPlayer == "0x0" || result.otherPlayer == "0x0000000000000000000000000000000000000000" || result.otherPlayer == ""){
					WaitingOponent;
				// }else{
				// 	InviteSent;
				// }
			}else if(p1Turn){
				YourTurn;
			}else{
				if(result.turn == 2){
					OponentFirstMove;
				}else{
					OponentTurn;
				}
			}
		}else{
			if(p1Turn){
				OponentTurn;
			}else{
				YourTurn;
			}
		}

		var contractState = new HogGameContractState({
			p1 : p1,
			ownSlot:slot, //local slot
			gameSlot:"0x"+result.gameSlot.toString(16),
			// gameSlot :
			creationTime : result.creationTime.toNumber(),
			status: status,
			otherPlayer:otherPlayer ,
			numUnits:numUnits,
			oponentNumUnits:oponentNumUnits,
			move : move,
			oponentMove : oponentMove,
			position : position,
			expiryTime : result.lastTime.toNumber() + result.period * 60,
			turn : result.turn
		});

		// trace("contract", contractState);

		return contractState;
	}

	function grabContractState(ownSlot : String, callback : Dynamic -> HogGameContractState -> Void){
		hogContract.probe_getGame({slot:ownSlot},{from:registeredAddress}, function(err,result){

			if(err != null){
				callback(err,null);
			}else{
				var contractState = parseContractState(result,ownSlot);
				var oldContractState = contractStates[contractState.ownSlot];
		
				if(oldContractState == null || oldContractState.different(contractState) || contractState.isExpired()){ //TODO check expiry to not do every time (what abotu YourTUun)
					if(oldContractState != null && oldContractState.different(contractState)){
						trace("oldContractState", oldContractState);
						trace("contract", contractState);
					}
					if(oldContractState == null){
						oldContractState = contractStates[contractState.ownSlot] = contractState;
					}else{
						oldContractState.copyFrom(contractState);
					}

					updateStatus(ownSlot,oldContractState);
				}

				callback(null, contractState);
			}
		});
	}


	public function arenaSeen(id:String){
		var game = games[id];
		var localGameData = localData.getGameData(id);
		if(localGameData == null){
			trace("ERROR", "no local data found for " + id);
			localGameData = {
				creationTime : 0,
				turn : 0,
				txHash : null,
				status : YourTurn,
				lastMove : 0,
				lastlastMove : 0,
				lastSecret : null
			};
		}
		if(game.gameEnding() != NotYet){
			localGameData.status = None;
		}else{
			localGameData.status = YourTurn;
		}
		updateStatus(id,game.contractState,localGameData);
	}

	public function setGameStateAsSeen(id : String){
		//save the turn 

	}

	public function isGameStateSeen(id : String){
		//check turn

	}

	function generateShadow() : Shadow{
		var pvInfo = ethereumjs.Keythereum.create();
		var address = ethereumjs.Keythereum.privateKeyToAddress(pvInfo.privateKey);
		return {
			address : address,
			pk : pvInfo.privateKey
		};
	}


	public function createGame(numSzabo : UInt, periodInMinutes : UInt, numUnits : UInt, callback : Dynamic -> String -> Void){

		if(!hasEnoughBalance()){
			lastError = "Not Enough Ether, need at least 0.2 ether";
			return;
		}

		var game : HogGame = null;
		var slotIndex = 0;
		for(ggame in games){
			if(ggame.contractState.status == None){
				game = ggame;
				break;
			}else{
				slotIndex++;
			}
		}

		if(game == null){
			trace("ERROR", "no game slot available");
			//TODO error
		}else{
			var shadow = localData.getShadow(registeredAddress);

			if(shadow == null || shadow.pk == ""){
				shadow = generateShadow();
				localData.setShadow(registeredAddress, shadow);
			}

			var allowance = new bignumberjs.BigNumber(HogConfig.values.defaultAllowance != null ? HogConfig.values.defaultAllowance : "100000000000000000");
			var price = new bignumberjs.BigNumber("" + numSzabo).times(new bignumberjs.BigNumber("1000000000000"));
			var total = price.plus(allowance);

			
			var data = {
				slotIndex:slotIndex, 
				shadow : new Address(shadow.address), 
				numUnits:numUnits,
				periodInMinutes : periodInMinutes, 
				minSzabo : numSzabo, 
				maxSzabo : numSzabo,
				allowance : allowance.toString(10)
			};
			hogContract.commit_to_create_game(data,{
				from:registeredAddress,
				gas:200000,
				value : total
			},function(err,txhash){
				if(err == null){
					trace("INFO", "create_game tx" , txhash);
					updateStatus(game.id,game.contractState, {
						creationTime : 0,
						turn : 1,
						txHash : txhash,
						status : CreatingGame,
						lastMove : 0,
						lastlastMove : 0,
						lastSecret : null
					});		
					if(callback != null){
						callback(null,game.id);
					}	
				}else{
					if(callback != null){
						callback(err,null);
					}	
					//TODO error
					trace("ERROR", "create_game tx" , err, data);
				}
				
			}, function(err,txhash,txReceipt){
				//TODO ?
				if(err != null){
					trace("ERROR", "create_game mining" , err);
				}
			});
			
		}
		
	}


	public function collect(slot : String){
		trace("collecting " + slot + " ...");
		var game = games[slot];
		var gameSlot = game.contractState.gameSlot;

		var shadow = localData.getShadow(registeredAddress);
		if(shadow == null  || shadow.pk == ""){
			trace("ERROR", "some local data missing");
			return;
		}
		var data = {
			slot:gameSlot
		};
		hogContract.commit_to_collect(data,{
			from:new Address(shadow.address),
			gas:200000,
			privateKey:toPK(shadow.pk)
		},function(err,txhash){
			if(err == null){
				trace("INFO", "collect tx" , txhash);
				updateStatus(slot,game.contractState, {
					creationTime : game.contractState.creationTime,
					turn : 0,
					txHash : txhash,
					status : Collecting,
					lastMove : 0,
					lastlastMove : 0,
					lastSecret : null,
				});			
			}else{
				//TODO error / retry ?
				trace("ERROR", "collect tx" , err, data);
				//TODO NOW : 
				// updateStatus(slot,game.contractState, {
				// 	creationTime : 0,
				// 	turn : 0,
				// 	txHash : null,
				// 	status : None, //CollectingFailed //TODO
				// 	lastMove : 0,
				// 	lastlastMove : 0,
				// 	lastSecret : null,
				// });			
			}
			
		}, function(err,txhash,txReceipt){
			//TODO ? //TODO  retry ?
			if(err != null){
				trace("ERROR", "collect mining" , err);
			}
		});
	}

	public function quitGame(slot : String){
		
		var game = games[slot];
		var gameSlot = game.contractState.gameSlot;

		var data = {
			slot:gameSlot,
			force:true
		};
		hogContract.commit_to_quit(data,{
			from:registeredAddress,
			gas:200000
		},function(err,txhash){
			if(err == null){
				trace("INFO", "quit tx" , txhash);
				updateStatus(slot,games[slot].contractState, {
					creationTime : games[slot].contractState.creationTime,
					turn : 0,
					txHash : txhash,
					lastMove:0,
					lastSecret:null,
					lastlastMove:0,
					status : Quitting //TODO ?
				});			
			}else{
				//TODO error
				trace("ERROR", "quit tx" , err, data);
			}
			
		}, function(err,txhash,txReceipt){
			//TODO ?
			if(err != null){
				trace("ERROR", "quit mining" , err);
			}
		});
	}


	var gameFound : GameSlotMatchingData = null;
	public function grabGameOrCreateNewOne(numSzabo : UInt, periodInMinutes : UInt, numUnits : UInt, ?callback : Dynamic -> String -> Void){
		if(gameFound != null && gameFound.lockedTime > time() + 2 * 60){
			startGame(gameFound.slot, numSzabo, periodInMinutes, numUnits,callback);
		}else{
			HttpUtil.post(HogConfig.values.serverUrl + "/rpc/grabGame", haxe.Json.stringify({
			playerAddress:registeredAddress,
				depositInSzabo:numSzabo,
				periodInMinutes:periodInMinutes,
				numUnits:numUnits
			}),function(error,response){
				gameFound = null;
				if(error == null && response != ""){
					try{
						gameFound = haxe.Json.parse(response);
					}catch(e : Dynamic){
						gameFound = null;
					}
				}
				if(gameFound != null){
					startGame(gameFound.slot, numSzabo, periodInMinutes, numUnits,callback);
				}else{
					createGame(numSzabo,periodInMinutes, numUnits,callback);
				}
			});
		}
	}


	public function startGame(targetSlot : String, numSzabo : UInt, periodInMinutes : UInt, numUnits : UInt, callback : Dynamic -> String -> Void){


		if(!hasEnoughBalance()){
			lastError = "Not Enough Ether, need at least 0.2 ether";
			return;
		}

		var game : HogGame = null;
		var slotIndex = 0;
		for(ggame in games){
			if(ggame.contractState.status == None){
				game = ggame;
				break;
			}else{
				slotIndex++;
			}
		}

		if(game == null){
			trace("ERROR", "no game slot available");
			//TODO error
		}else{
			var shadow = localData.getShadow(registeredAddress);

			if(shadow == null  || shadow.pk == ""){
				shadow = generateShadow();
				localData.setShadow(registeredAddress, shadow);
			}

			var allowance = new bignumberjs.BigNumber(HogConfig.values.defaultAllowance != null ? HogConfig.values.defaultAllowance : "100000000000000000");
			var price = new bignumberjs.BigNumber("" + numSzabo).times(new bignumberjs.BigNumber("1000000000000"));
			var total = price.plus(allowance);

			var data = {
				slotIndex:slotIndex, 
				otherSlot:targetSlot,
				numUnits:numUnits,
				periodInMinutes : periodInMinutes, 
				shadow : new Address(shadow.address), 
				allowance : allowance.toString(10)
			};
			hogContract.commit_to_start_game(data,{
				from:registeredAddress,
				gas:200000,
				value : total
			},function(err,txhash){
				if(err == null){
					trace("INFO", "start_game tx" , txhash);
					updateStatus(game.id,game.contractState, {
						creationTime : game.contractState.creationTime,
						turn : game.contractState.turn+1,
						txHash : txhash,
						status : StartingGame,
						lastMove : 0,
						lastlastMove : 0,
						lastSecret : null
					});			
				}else{
					//TODO error
					trace("ERROR", "start_game tx" , err, data);
				}
				
			}, function(err,txhash,txReceipt){
				//TODO ?
				if(err != null){
					trace("ERROR", "start_game mining" , err);
				}
			});
			
		}
		
	}


	public function move(slot : String, numUnitsToSend : UInt){
		var shadow = localData.getShadow(registeredAddress);
		if(shadow == null || shadow.pk == ""){
			trace("ERROR", "some local data missing");
			lastError = "NO DATA";
			return;
		}

		var game = games[slot];

		switch(game.contractState.status){
			case None:
				lastError = "NO GAME";
				trace("ERROR", "no game to play");
				return;
			case WaitingOponent:
				lastError = "NOT YOUR TURN";
				trace("ERROR", "not your turn to move");
				return;
			case OponentFirstMove:
				lastError = "NOT YOUR TURN";
				trace("ERROR", "not your turn to move");
				return;
			
			case OponentTurn:
				lastError = "NOT YOUR TURN";
				trace("ERROR", "not your turn to move");
				return;

			case YourTurn:
				var turn = game.contractState.turn;
				if(turn == 2){
					trace("INFO","p2 sending first move : " + numUnitsToSend);
					_move(slot,shadow,numUnitsToSend);
				}else if (turn >2 && turn%2==1){
					trace("INFO","p1 sending its visible move : " + numUnitsToSend);
					_move_reveal(slot,shadow,numUnitsToSend);
				}else if(turn >2 && turn%2==0){
					trace("INFO","p2 revealing its previous move and making a new one  : " + numUnitsToSend);
					_reveal_move(slot,shadow,numUnitsToSend);
				}else{
					lastError = "WRONG TURN " + turn;
					trace("ERROR", "wrong situation, YourTurn with turn = " +turn );
					return;
				}
		}
	}

	function _move(slot : String, shadow : Shadow, numUnitsToSend : UInt){
		var game = games[slot];
		var secret = "0x" +haxe.crypto.Sha256.encode(shadow.pk + slot + game.contractState.creationTime + game.contractState.turn);
		trace("INFO","secret", secret);
		var gameSlot = game.contractState.gameSlot;

		// var gameData = localData.getGameData(slot);
		// if(gameData == null){
		// 	trace("ERROR", "no game data for _move");
		// 	return;
		// }

		var data = {
			slot:gameSlot,
			hash:Web3Lib.sha3([secret,registeredAddress,"0x" +StringTools.hex(numUnitsToSend,2)])
		};
		hogContract.commit_to_move(data,{
			from:new Address(shadow.address),
			gas:200000,
			privateKey: toPK(shadow.pk)
		},function(err,txhash){
			if(err == null){
				trace("INFO", "move tx" , txhash);
				updateStatus(slot,game.contractState, {
					creationTime : game.contractState.creationTime,
					turn : game.contractState.turn+1,
					txHash : txhash,
					status : SendingUnits,
					lastMove : numUnitsToSend,
					lastlastMove : game.lastMove, //TODO cuse localGameData ?
					lastSecret : secret //TODO remove use private key as the generator of unique secret
				});			
			}else{
				lastError = err;
				//TODO error
				trace("ERROR", "move tx" , err, data);
			}
			
		}, function(err,txhash,txReceipt){
			//TODO ?
			if(err != null){
				trace("ERROR", "move mining" , err);
			}
		});
	}

	function toPK(pk : Dynamic) : Dynamic{
		if(pk.type == 'Buffer'){
			return untyped EthJS.Util.toBuffer(pk.data);
		}
		return pk;//untyped EthJS.Util.toBuffer(pk.toString());
	}

	function _reveal_move(slot : String, shadow : Shadow, numUnitsToSend : UInt){
		var gameData = localData.getGameData(slot);
		if(gameData == null){
			trace("ERROR", "no game data for _reveal_move");
			return;
		}

		var game = games[slot];
		var secret = "0x" + haxe.crypto.Sha256.encode(shadow.pk + slot + game.contractState.creationTime + game.contractState.turn);
		var previousSecret = "0x" + haxe.crypto.Sha256.encode(shadow.pk + slot + game.contractState.creationTime + (game.contractState.turn - 2));
		trace("INFO","secret", secret);
		trace("INFO","previousSecret", previousSecret);
		trace("INFO","local secret", gameData.lastSecret);

		var lastSecret = gameData.lastSecret;
		if(lastSecret == null){
			trace("ERROR", "no secret for previous move, fallback on generating one");
			lastSecret = previousSecret;
		}

		

		

		var gameSlot = game.contractState.gameSlot;

		var data = {
			slot:gameSlot,
			move : gameData.lastMove,
			secret : lastSecret,
			hash:Web3Lib.sha3([secret,registeredAddress,"0x" +StringTools.hex(numUnitsToSend,2)])
		};
		hogContract.commit_to_reveal_move(data,{
			from:new Address(shadow.address),
			gas:200000,
			privateKey:toPK(shadow.pk)
		},function(err,txhash){
			if(err == null){
				trace("INFO", "reveal_move tx" , txhash);
				if(numUnitsToSend == 0){//TODO use better explicit for staying in arena when the move is the final one (move == 0)
					//TODO do something ?
				}else{
					updateStatus(slot,game.contractState, {
						creationTime : game.contractState.creationTime,
						turn : game.contractState.turn+1,
						txHash : txhash,
						status : SendingUnits, 
						lastMove : numUnitsToSend,
						lastlastMove : game.lastMove, //TODO cuse localGameData ?
						lastSecret : secret //TODO remove use private key as the generator of unique secret
					});			
				}
				
			}else{
				lastError = err;
				//TODO error
				trace("ERROR", "reveal_move tx" , err, data);
			}
			
		}, function(err,txhash,txReceipt){
			//TODO ?
			if(err != null){
				trace("ERROR", "reveal_move mining" , err);
			}
		});
	}

	function _move_reveal(slot : String, shadow : Shadow, numUnitsToSend : UInt){
		var game = games[slot];

		var gameSlot = game.contractState.gameSlot;

		var data = {
			slot:gameSlot,
			move:numUnitsToSend
		};
		hogContract.commit_to_move_reveal(data,{
			from:new Address(shadow.address),
			gas:200000,
			privateKey:toPK(shadow.pk)
		},function(err,txhash){
			if(err == null){
				trace("INFO", "move_reveal tx" , txhash);
				updateStatus(slot,game.contractState, {
					creationTime : game.contractState.creationTime,
					turn : game.contractState.turn+1,
					txHash : txhash,
					status : SendingUnits,
					lastMove : numUnitsToSend,
					lastlastMove : game.lastMove, //TODO cuse localGameData ?
					lastSecret : null //TODO remove use private key as the generator of unique secret
				});			
			}else{
				lastError = err;
				//TODO error
				trace("ERROR", "move_reveal tx" , err, data);
			}
			
		}, function(err,txhash,txReceipt){
			//TODO ?
			if(err != null){
				trace("ERROR", "move_reveal mining" , err);
			}
		});
	}

}