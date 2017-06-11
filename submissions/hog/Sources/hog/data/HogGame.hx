package hog.data;

import hog.data.GameState;

typedef HogGameJson = {
	id : String,
	localStatus : GameState,
	contractState : ContractStateJson
}

typedef ContractStateJson = {
	ownSlot : String,
	gameSlot : String,
	creationTime : Float,

	status : ContractGameState,
	otherPlayer : String,
	numUnits : UInt,
	oponentNumUnits : UInt,
	move : UInt,
	oponentMove : UInt,
	position : Int,
	expiryTime : Float,
	turn : UInt,
	p1 : Bool
}
	

class HogGameContractState {
	public var ownSlot(default,null) : String;
	public var gameSlot(default,null) : String;
	public var creationTime(default,null) : Float;
	
	public var status(default,null) : ContractGameState;
	public var otherPlayer(default,null) : String;
	public var numUnits(default,null) : UInt;
	public var oponentNumUnits(default,null) : UInt;
	public var move(default,null) : UInt;
	public var oponentMove(default,null) : UInt;
	public var position(default,null) : Int;
	public var expiryTime(default,null) : Float;
	public var turn(default,null) : UInt;
	public var p1(default,null) : Bool;

	public function new(otherGame : ContractStateJson){
		this.ownSlot = otherGame.ownSlot;
		this.gameSlot = otherGame.gameSlot;
		this.creationTime = otherGame.creationTime;
		this.status = otherGame.status;
		this.otherPlayer = otherGame.otherPlayer;
		this.numUnits = otherGame.numUnits;
		this.oponentNumUnits = otherGame.oponentNumUnits;
		this.move = otherGame.move;
		this.oponentMove = otherGame.oponentMove;
		this.position = otherGame.position;
		this.expiryTime = otherGame.expiryTime;
		this.turn = otherGame.turn;
		this.p1 = otherGame.p1;
	}

	public function copyFrom(otherGame : HogGameContractState){
		this.gameSlot = otherGame.gameSlot;
		this.creationTime = otherGame.creationTime;
		this.status = otherGame.status;
		this.otherPlayer = otherGame.otherPlayer;
		this.numUnits = otherGame.numUnits;
		this.oponentNumUnits = otherGame.oponentNumUnits;
		this.move = otherGame.move;
		this.oponentMove = otherGame.oponentMove;
		this.position = otherGame.position;
		this.expiryTime = otherGame.expiryTime;
		this.turn = otherGame.turn;
		this.p1 = otherGame.p1;
	}

	public function different(otherGame : HogGameContractState){
		return this.gameSlot != otherGame.gameSlot
		|| this.creationTime != otherGame.creationTime
		|| this.status != otherGame.status
		|| this.otherPlayer != otherGame.otherPlayer
		|| this.numUnits != otherGame.numUnits
		|| this.oponentNumUnits != otherGame.oponentNumUnits
		|| this.move != otherGame.move
		|| this.oponentMove != otherGame.oponentMove
		|| this.position != otherGame.position
		|| this.expiryTime != otherGame.expiryTime
		|| this.turn != otherGame.turn
		|| this.p1 != otherGame.p1;
	}

	public function isExpired() : Bool{
		//TODO NOW : other status that cannot be expired : Arena ?
		return status != None && expiryTime  <= HogState.time() - 30; //TODO parametrize buffer time
	}

	public function timeLeft() : Float{
		//TODO NOW : other status that cannot be expired : Arena ?
		return expiryTime - (HogState.time() + 30); //TODO parametrize buffer time
	}
}

@:enum
abstract GameEnding(String) to(String) {
  var NotYet = "NotYet";
  var Won = "Won";
  var Lost = "Lost";
  var Draw = "Draw";
}

class HogGame {
	public var id(default,null) : String;
	public var localStatus(default,null): GameState; //add turn ....
	public var contractState(default,null) : HogGameContractState;

	public var numUnits: UInt;
	public var oponentNumUnits : UInt;
	public var position : Int;
	public var lastMove : UInt;
	public var lastOponentMove : UInt;

	public function gameEnding() : GameEnding{
		if(numUnits == 0 || oponentNumUnits == 0 || position >= 3 || position <= -3){
			if(position > 0){
				return Won;
			}else if(position < 0){
				return Lost;
			}else{
				return Draw;
			}
		}else{
			return NotYet;
		}
	}

	public function new(id : String, localStatus : GameState, contractState : HogGameContractState){
		this.id = id;
		this.localStatus = localStatus;
		this.contractState = contractState;
	}

	public function isExpired() : Bool{
		return contractState.isExpired();
	}


	public function timeLeft() : Float{
		return contractState.timeLeft();
	}



	// public function canCollect() : Bool{
	// 	return contractState.isExpired() 
	// 	&& (
	// 		   localStatus == WaitingOponent
	// 		|| localStatus == OponentFirstMove
	// 		|| localStatus == OponentTurn
	// 		|| localStatus == NobodyJoined //do we need this state ?
	// 		|| localStatus == OponentLate //do we need this state ?
	// 		);
	// }
}