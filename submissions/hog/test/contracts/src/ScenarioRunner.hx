import web3.Web3;
import web3.contract.Hog;

import web3.providers.HttpProvider;
import ethereumjs.TestRpc;
import ethereumjs.Util;

import ethereumjs.Tx;

import Scenario;
import Scenario.Step;


typedef Shadow = {
	address : String,
	privateKeyInfo : {
		privateKey : Dynamic,
		iv : Dynamic,
		salt : Dynamic
	}
}

class ScenarioRunner{

	var shadowAccounts:Map<UInt,Shadow> = new Map();
	var currentAccountIndex : Int = 0;
	var isShadowAccount : Bool = false;
	
/////////////////// SPECIFIC //////////////////////////
	var deployedContract : Hog;
	function deployContract(next : Void -> Void){
		Sys.println("account " + currentAccountIndex + " deploying Contract"); //TODO gas
		Hog.deploy(web3,{from:step.account, gas : step.gas},function(err,result){
			assertStepDoNotFail(step,err,"deploy");
		},function(err : Dynamic, contract : Hog){		
			assertStepDoNotFail(step,err,"deploy");
			deployedContract = contract;
			Sys.println("contract deployed");
			next();
		});	
	}

	function createGame(next : Void -> Void){
		deployedContract.commit_to_create_game(step.params,{from:step.account, gas : step.gas, value:step.value}, 
		function(err,txhash){
			if(err != null){
				Sys.println("player " + currentAccountIndex + " cannot create game with");
				Sys.println(haxe.Json.stringify(step.params)); 
				assertStepDoNotFail(step,err,"create_game");
			}else{
				Sys.println("txhash : " + txhash);
			}
		},function(err : Dynamic,txHash,t){
					
			deployedContract.probe_getGame({
				slot:getSlot(step.account,step.params.slotIndex)
			}, {},function(e,secondResult){
				//TODO e
				trace(secondResult);
				trace("0x" + secondResult.gameSlot.toString(16));
				// trace(secondResult.gameSlot.toString(16));
				if(err == null && secondResult.lastTime.toNumber() < currentStepTime){
					err = "lastTime (" +secondResult.lastTime.toString(10)+")  smaller than currentStepTime(" + currentStepTime +")";
				}

				assertStepDoNotFail(step,err,"create_game");
				
				// Sys.println("player" + currentAccountIndex + " got seed = " + result.seed + " ");
				// if(step.id != null){
				// 	stepData[step.id] = {seed:result.seed,competition:result.competitionIndex};
				// }
				// previousPerAccount[step.account] = {seed:result.seed,competition:result.competitionIndex};
				next();
			});
		});
	}

	function createGameInvite(next : Void -> Void){
		//TODO
		next();
	}

	function startGame(next : Void -> Void){
		deployedContract.commit_to_start_game(step.params,{from:step.account, gas : step.gas, value:step.value}, 
		function(err,txhash){
			if(err != null){
				Sys.println("player " + currentAccountIndex + " cannot start game with");
				Sys.println(haxe.Json.stringify(step.params)); 
				assertStepDoNotFail(step,err,"start_game");
			}else{
				Sys.println("txhash : " + txhash);
			}
		},function(err : Dynamic,txHash,t){
					
			deployedContract.probe_getGame({
				slot: step.params.otherSlot
			}, {},function(e,secondResult){
				trace(secondResult);
				trace("0x" + secondResult.gameSlot.toString(16));
				//TODO e
				if(err == null && secondResult.lastTime.toNumber() < currentStepTime){
					err = "lastTime (" +secondResult.lastTime.toString(10)+")  smaller than currentStepTime(" + currentStepTime +")";
				}

				assertStepDoNotFail(step,err,"start_game");
				
				// Sys.println("player" + currentAccountIndex + " got seed = " + result.seed + " ");
				// if(step.id != null){
				// 	stepData[step.id] = {seed:result.seed,competition:result.competitionIndex};
				// }
				// previousPerAccount[step.account] = {seed:result.seed,competition:result.competitionIndex};
				next();
			});
		});
	}

	function move(next : Void -> Void){

		var options : TransactionInfo = {from:step.account, gas : step.gas, value:step.value};
		if(isShadowAccount){
			options.privateKey = shadowAccounts[currentAccountIndex].privateKeyInfo.privateKey;
		}

		deployedContract.commit_to_move(step.params,options, 
		function(err,txhash){
			if(err != null){
				Sys.println("player " + currentAccountIndex + " cannot move with");
				Sys.println(haxe.Json.stringify(step.params)); 
				assertStepDoNotFail(step,err,"move");
			}else{
				Sys.println("txhash : " + txhash);
			}
		},function(err : Dynamic,txHash,t){
					
			deployedContract.probe_getGame({
				slot: step.params.slot
			}, {},function(e,secondResult){
				trace(secondResult);
				trace("0x" + secondResult.gameSlot.toString(16));

				var hashFound = secondResult.hash;
				//TODO e
				if(err == null && hashFound != step.params.hash){
					err = "hash found (" + hashFound + ")  different than provided(" + step.params.hash +")";
				}

				assertStepDoNotFail(step,err,"move");
				
				// Sys.println("player" + currentAccountIndex + " got seed = " + result.seed + " ");
				// if(step.id != null){
				// 	stepData[step.id] = {seed:result.seed,competition:result.competitionIndex};
				// }
				// previousPerAccount[step.account] = {seed:result.seed,competition:result.competitionIndex};
				next();
			});
		});
	}

	function moveReveal(next : Void -> Void){

		var options : TransactionInfo = {from:step.account, gas : step.gas, value:step.value};
		if(isShadowAccount){
			options.privateKey = shadowAccounts[currentAccountIndex].privateKeyInfo.privateKey;
		}

		deployedContract.commit_to_move_reveal(step.params,options, 
		function(err,txhash){
			if(err != null){
				Sys.println("player " + currentAccountIndex + " cannot move_reveal with");
				Sys.println(haxe.Json.stringify(step.params)); 
				assertStepDoNotFail(step,err,"move_reveal");
			}else{
				Sys.println("txhash : " + txhash);
			}
		},function(err : Dynamic,txHash,t){
					
			deployedContract.probe_getGame({
				slot: step.params.slot
			}, {},function(e,secondResult){
				trace(secondResult);
				trace("0x" + secondResult.gameSlot.toString(16));
				//TODO e
				if(err == null && secondResult.lastTime.toNumber() < currentStepTime){
					err = "lastTime (" +secondResult.lastTime.toString(10)+")  smaller than currentStepTime(" + currentStepTime +")";
				}

				assertStepDoNotFail(step,err,"move_reveal");
				
				// Sys.println("player" + currentAccountIndex + " got seed = " + result.seed + " ");
				// if(step.id != null){
				// 	stepData[step.id] = {seed:result.seed,competition:result.competitionIndex};
				// }
				// previousPerAccount[step.account] = {seed:result.seed,competition:result.competitionIndex};
				next();
			});
		});
	}

	function revealMove(next : Void -> Void){
		var options : TransactionInfo = {from:step.account, gas : step.gas, value:step.value};
		if(isShadowAccount){
			options.privateKey = shadowAccounts[currentAccountIndex].privateKeyInfo.privateKey;
		}

		deployedContract.commit_to_reveal_move(step.params,options, 
		function(err,txhash){
			if(err != null){
				Sys.println("player " + currentAccountIndex + " cannot reveal_move with");
				Sys.println(haxe.Json.stringify(step.params)); 
				assertStepDoNotFail(step,err,"reveal_move");
			}else{
				Sys.println("txhash : " + txhash);
			}
		},function(err : Dynamic,txHash,t){
					
			deployedContract.probe_getGame({
				slot: step.params.slot
			}, {},function(e,secondResult){
				trace(secondResult);
				trace("0x" + secondResult.gameSlot.toString(16));
				//TODO e
				if(err == null && secondResult.lastTime.toNumber() < currentStepTime){
					err = "lastTime (" +secondResult.lastTime.toString(10)+")  smaller than currentStepTime(" + currentStepTime +")";
				}

				assertStepDoNotFail(step,err,"reveal_move");
				
				// Sys.println("player" + currentAccountIndex + " got seed = " + result.seed + " ");
				// if(step.id != null){
				// 	stepData[step.id] = {seed:result.seed,competition:result.competitionIndex};
				// }
				// previousPerAccount[step.account] = {seed:result.seed,competition:result.competitionIndex};
				next();
			});
		});
	}

	function _next(){
		wait(1);
		stepIndex++;
		if(scenario.steps.length > stepIndex){
			step = scenario.steps[stepIndex];
			var parsedAccount = Std.parseInt(step.account);
			if(parsedAccount == null){
				var split = cast(step.account,String).split(":");
				var special = split[0];
				if(special == "_shadowAddress"){
					var accountIndex = Std.parseInt(split[1]);
					if(!shadowAccounts.exists(accountIndex)){
						var pvInfo = ethereumjs.Keythereum.create();
						shadowAccounts[accountIndex] = {
							address : ethereumjs.Keythereum.privateKeyToAddress(pvInfo.privateKey),
							privateKeyInfo :pvInfo
						};
					}
					step.account = new Address(shadowAccounts[accountIndex].address);
					currentAccountIndex = accountIndex;
					isShadowAccount = true;
				}else{
					step.account = transformParam(step.account);
					currentAccountIndex = -1;
					isShadowAccount = false;
				}
			}else{
				step.account = accounts[parsedAccount];
				currentAccountIndex = parsedAccount;
				isShadowAccount = false;
			}
			currentStepTime = untyped Date.prototype.getTime() / 1000;
			if(step.value == null){
				step.value = "0";
			}
			if(step.gas == null){
				step.gas = 3000000; //TODO remove defaults
			}
			injectParams(step.params);
			switch(step.action){
				case Deploy:wrapBalanceCheck(deployContract);
				case Wait:Sys.println("waiting " + step.params.seconds + " seconds ...");wait(step.params.seconds);_next();
				case CreateGame:wrapBalanceCheck(createGame);
				case CreateGameInvite:wrapBalanceCheck(createGameInvite);
				case StartGame:wrapBalanceCheck(startGame);
				case Move:wrapBalanceCheck(move);
				case MoveReveal:wrapBalanceCheck(moveReveal);
				case RevealMove:wrapBalanceCheck(revealMove);
				default:skip(step);
			}
		}else{
			end();
		}
		
	}
////////////////////////////////////////////////////////


	var scenario : Scenario;
	var web3 : Web3;
	var _callback : Dynamic -> Void;
	var stepIndex : Int = -1;
	var step : Step;
	var stepData : Map<String,Dynamic>;
	var previousPerAccount : Map<Int,Dynamic>;
	var accounts : Array<Address>;
	var time : Float = 0;
	var balancesBefore : Array<Wei>;
	var balancesAfter : Array<Wei>;
	var currentStepTime : Float;
	

	public function new(scenario : Scenario){
		this.scenario = scenario;
		stepData = new Map();
		previousPerAccount = new Map();

		var counter = 0;
		var initialBalances : Array<{balance:String,index:UInt}> = [];
		for(balance in scenario.initalBalances){
			initialBalances.push({balance:balance,index:counter});
			counter++;
		}

		Web3Lib.setup();
		web3 = Web3Lib.createInstance();
		web3.setProvider(TestRpc.provider({
			logger:js.Node.console,
			accounts:initialBalances,
			seed:"testing"
		}));
	}

	function getSlot(address : Address, index : UInt) : String{
		var slot : String = cast address;
		if(index > 0){
			slot = "0x" + StringTools.hex(index) + slot.substr(2);
		}
		return slot;
	}

	function transformParam(str : String ) : Dynamic{
		var split = str.split(":");
		var special = split[0];
		if(special == "_shadowAddress"){
			var accountIndex = Std.parseInt(split[1]);
			if(!shadowAccounts.exists(accountIndex)){
				var pvInfo = ethereumjs.Keythereum.create();
				shadowAccounts[accountIndex] = {
					address : ethereumjs.Keythereum.privateKeyToAddress(pvInfo.privateKey),
					privateKeyInfo :pvInfo
				};
			}
			return shadowAccounts[accountIndex].address;
		}else if(special == "_account"){
			return accounts[Std.parseInt(split[1])];
		}else if(special == "_leftPadAccount"){
			var s : String = accounts[Std.parseInt(split[1])];
			s = s.substr(2);
			while( s.length < 64 )s = "0"+s;
			//TODO remove
			trace("leftPadAccount ", s);
			return "0x" + s;

		}else if(special == "_slot"){
			return getSlot(accounts[Std.parseInt(split[1])],Std.parseInt(split[2]));
		}else if(special == "_sha3"){ //TODO fix
			var elems : Array<String> = [];
			for(i in 1...split.length){
				var elem : String = split[i];
				elems.push(transformParam(StringTools.replace(elem,"|",":")));
			}
			var val = Web3Lib.sha3(elems);
			//TODO remove
			trace("sha3 : ", val);
			return val;
		}else{
			return str;
		}
	}

	function injectParams(params : Dynamic) {
		var fields = Reflect.fields(params);
		for(fieldName in fields){
			var value = Reflect.field(params,fieldName);
			if(Std.is(value,String)){
				var strValue : String = cast value;
				if(strValue.charAt(0) == "_"){
					Reflect.setField(params,fieldName,transformParam(strValue));
				}
			}
		}
	}

	public function run(callback : Dynamic -> Void){
		_callback = callback;

		time = 1000;
		Util.setTime(time);
		web3.eth.getAccounts(function(err,accs){
			accounts = accs;
			balancesAfter = new Array();
			balancesBefore = new Array();
			for(i in 0...accounts.length){
				balancesBefore.push(0);
				balancesAfter.push(0);
			}
			trace(haxe.Json.stringify(accounts));
			_next();
		});
	}

	function saveBalance(balanceArray : Array<Wei>, i : Int, callback : Void -> Void){
		web3.eth.getBalance(accounts[i],function(err,balance){
			balanceArray[i] = balance;
			//Sys.println("balance for " + i + " : " + balance);
			callback();
		});
	}
	
	function saveBalances(balanceArray : Array<Wei>, callback : Void -> Void){
		var counter = accounts.length;		
		for(i in 0...accounts.length){
			saveBalance(balanceArray, i, function(){
				counter--;
				if(counter<=0){
					callback();
				}
			});
		}
	}

	function wrapBalanceCheck(func : (Void->Void) -> Void){
		saveBalances(balancesBefore, function(){
			func(function(){
				saveBalances(balancesAfter, function(){
					//if(step.expectedDeltas != null){
						Sys.println("checking deltas ...");
						var balanceErrors = [];
						for(i in 0...balancesAfter.length){
							var actualDelta = balancesAfter[i].minus(balancesBefore[i]);
							if(!actualDelta.equals(untyped 0)){ Sys.println("account " + i + " balance delta : " + actualDelta.toString(10));}
							if(step.expectedDeltas != null){
								var expectationTest : ExpectationTest = Equality;
								var expectationParam : Int = 0;
								var expectedDelta : bignumberjs.BigNumber = 0;
								if(step.expectedDeltas.length > i){
									if(step.expectedDeltas[i] == Skip){
										continue;
									}
									var expextedDeltaString : String = step.expectedDeltas[i];
									var split = expextedDeltaString.split(":");
									expectedDelta = new bignumberjs.BigNumber(split[0]);
									if(split.length > 1){
										expectationTest = split[1].charAt(0);
										if(split[1].length > 1){
											expectationParam = Std.parseInt(split[1].substr(1));
										}
									}
								}
								var actualDelta = balancesAfter[i].minus(balancesBefore[i]);
								var match = 
								switch(expectationTest){
									case Equality: actualDelta.equals(new Wei(expectedDelta));
									case Aproximation: 
										var small = expectedDelta.minus(new bignumberjs.BigNumber(expectationParam/2.0));
										var big = expectedDelta.plus(new bignumberjs.BigNumber(expectationParam/2.0)); 
										actualDelta.gt(small) && actualDelta.lt(big);
									case Skip: true;
								}
								if(!match){
									balanceErrors.push("no matching balance delta " + expectedDelta + " vs actual " + actualDelta + " for account " + i);
								}
							}
						}
						if(balanceErrors.length > 0){
							for(err in balanceErrors){
								Sys.println(err);
								abort("balance mismatch");
							}	
						}
						
						Sys.println("done");
					//}
					_next();
				});
			});
		});
	}

	function assertStepDoNotFail(step : Step, err : Dynamic, message : String){
		if(step.shouldFail && err == null){
			abort("should have failed but it did not : " + message);
		}else if(!step.shouldFail && err != null){
			abort("failed : " + message + ", error: " + err);
		}
	}

	function wait(seconds : Float){
		time += seconds;
		Util.setTime(time);
	}
	
	function skip(step : Step){
		Sys.println("skipping " + step);
		_next();
	}
	
	function abort(message : String){
		Sys.println("error : " + message);
		Sys.println("" + stepIndex);
		Sys.println("" + step);
		Sys.exit(1);
	}

	public function end(){
		//TODO use provider.stop() instead until https://github.com/ethereumjs/testrpc/issues/70 is resolved
		Sys.exit(0);
	}
}