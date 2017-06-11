package hog.data;

import hog.data.GameState;

typedef GameData = {
	creationTime : Float,
	turn : UInt, // status is better? not sure for when getting back frin another device 
	txHash : String,
	status : GameState,
	lastMove : UInt,
	lastlastMove : UInt,
	lastSecret : String
}
//TODO deal with case ehere player load froma a game previously played on another device => use web3.decrypt to get the private key / secret / status...

typedef Shadow = { //could be generated from personal_sign/game id ? would need a passphrase though!
	address : String,
	pk : String
}

typedef LocalData = {
	v : UInt,
	gameData : haxe.DynamicAccess<GameData>,
	shadows : haxe.DynamicAccess<Shadow>
}

class Local{
	var emptyData : LocalData  = {
		v : 1,
		gameData : {},
		shadows : {}
	};

	var data : LocalData = null;

	var localStorage : js.html.Storage = null;
	public function new(){
		localStorage = js.Browser.getLocalStorage();
		if(localStorage != null){
			var storedData = localStorage.getItem("hog");
			if(storedData != null && storedData != ""){
				try{
					data = haxe.Json.parse(storedData);
				}catch(e : Dynamic){
					data = null;
				}
				if(data.v == null){
					data = null;
				}
			}
			if(data == null){
				data = emptyData;
			}
		}else{
			//TODO remove
			js.Browser.alert("Hog requires local storage to save info on game");
		}
		
	}

	function save(){
		if(localStorage != null && data != null){
			localStorage.setItem("hog", haxe.Json.stringify(data));
		}
	}


	public function hasGameData(id : String) : Bool{
		return data.gameData[id] != null;
	}

	public function getGameData(id : String) : GameData{
		return data.gameData[id];
	}

	public function setGameData(id : String, gameData : GameData){
		data.gameData[id] = gameData;
		save();
	}

	public function hasShadow(account : String) : Bool{
		return data.shadows.exists(account);
	}

	public function getShadow(account : String) : Shadow{
		return data.shadows[account];
	}

	public function setShadow(account : String, shadow : Shadow){
		data.shadows[account] = shadow;
		save();
	}


	//TODO debug
	public function erase(){
		data = emptyData;
		save();
	}
}