import web3.Web3;

/////////////////// SPECIFIC //////////////////////////
@:enum
abstract Action(String) from(String){
	var Deploy = "_deploy_";
	var Wait = "_wait_";

	var CreateGame = "create_game";
	var CreateGameInvite = "create_game_invite";
	var StartGame = "start_game";
	var Move = "move";
	var MoveReveal = "move_reveal";
	var RevealMove = "reveal_move";
	
}
////////////////////////////////////////////////////////

typedef Scenario = {
	initalBalances:Array<String>,
	steps : Array<Step>
}

@:enum
abstract ExpectationTest(String) from(String){
	var Equality = "=";
	var Aproximation = "~";
	var Skip = "*";
}


typedef Step = {
	?id : String,
	account : Address,
	action : Action,
	?value : String,
	?gas : UInt, 
	?params : Dynamic, //haxe.DynamicAccess<Dynamic>,
	?shouldFail : Bool,
	?expectedDeltas : Array<String>
	//TODO "test":{}, probe result and check
	//TODO before and after probes ?
	
}