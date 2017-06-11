package;

import blip.Data;
import blip.Shell;
import blip.App;

import web3.Web3;
// import web3helper.Web3State;

import hog.screen.Events;

class Main{

	public static var full = false;
	public static var oldTraces : Array<{v : Dynamic, ?inf : haxe.PosInfos}> = new Array();

	private static function myTrace( v : Dynamic, ?inf : haxe.PosInfos ) {
		if(full){
			oldTraces.shift();
		}
		oldTraces.push({v:v,inf:inf});
		if(oldTraces.length > 20){
			full = true;
		}
	}

	static function setMyTrace(){
		if(js.Browser.window.location.search.indexOf("debug=true") != -1){
			haxe.Log.trace = myTrace;
		}
	}
	
	public static function main(){
		setMyTrace();

		js.Browser.window.onload = function(){
			Web.init();
			HogConfig.init();
			Web3Lib.setup();
			var web3 =  Web3Lib.createInstance();
			
			var readOnly = true;
			var readyToListen = false;
			if(untyped js.Browser.window.web3){
				readyToListen = true;
				var currentWeb3 : Web3 = untyped js.Browser.window.web3;
				untyped js.Browser.window.web3 = web3;
				var provider = currentWeb3.currentProvider;
				web3.setProvider(provider);			
				readOnly = false;
			}else{
				untyped js.Browser.window.web3 = web3;

				var nodeUrl = "https://ropsten.infura.io/d50cy38uVG4f9MtRRvl2";

				// var nodeUrl = "https://mainnet.infura.io/d50cy38uVG4f9MtRRvl2";
				// if(networkID == "3"){
				// 		nodeUrl = "https://ropsten.infura.io/d50cy38uVG4f9MtRRvl2";
				// }
				
				//TODO remove:
				if(Web.params["account"] == null){Web.params["account"] = "0xc430e396b63d40fee619c8e3828f68cf00756ece";}

				if(Web.params["account"] != null){
					nodeUrl = "http://localhost:8545";
					nodeUrl = "http://108.61.173.198:8545";
			 		web3.eth.defaultAccount = new Address(Web.params["account"]);//0xc430e396b63d40fee619c8e3828f68cf00756ece
			 	}else{
			 		//TODO
					var web3MissingElement = js.Browser.document.getElementById('web3_missing');
					web3MissingElement.style.display='block';
					
					var web3MissingButtonElement = js.Browser.document.getElementById('web3_missing_button');
					web3MissingButtonElement.onclick=function(){
						web3MissingElement.style.display='none';
					};
			 	}
				
				
				var provider = Web3Lib.createHttpProvider(nodeUrl);
				web3.setProvider(provider);
				readOnly = true;
				readyToListen = true;
			}

			// var web3State = new Web3State(web3,readOnly);
			// if(readyToListen){
			// 	web3State.listen();
			// }
			
			play(web3);//, web3State);
		};			
	}

	static function play(web3 : Web3){//, web3State : Web3State){

		//TODO use web3State ?

		var hogState = new  hog.data.HogState(web3, 10);

		//var loadingScreen = new blip.LoadingScreen();
		var loadingScreen = new hog.screen.HogLoadingScreen();
		//TODO 
		// public static function hidePreloading(){
		// 	var elem = js.Browser.document.getElementById("preloading");
		// 	if(elem != null){
		// 		elem.style.display = "none";
		// 	}
		// }
		
		var homeScreen = new hog.screen.HomeScreen(hogState);
		var newGameScreen = new hog.screen.NewGameScreen(hogState);
		// var yourTurnScreen = new hog.screen.YourTurnScreen(hogState);
		var hogGameScreen = new hog.screen.HogGameScreen(hogState);

		var errorScreen = new hog.screen.ErrorScreen(hogState);

		var shell = Shell.createFromTransitions(None,loadingScreen, [
			{from:loadingScreen,event:Next,to:homeScreen}
			, {from:homeScreen,event:NewGame,to:newGameScreen}
			, {from:homeScreen,event:PlayGame,to:hogGameScreen}
			, {from:hogGameScreen,event:Back,to:homeScreen}
			, {from:newGameScreen,event:Back,to:homeScreen}

			, {from:homeScreen,event:Error,to:errorScreen}
			, {from:newGameScreen,event:Error,to:errorScreen}
			, {from:hogGameScreen,event:Error,to:errorScreen}
			, {from:errorScreen,event:Back,to:homeScreen}
			, {from:errorScreen,event:Back,to:newGameScreen}
			, {from:errorScreen,event:Back,to:hogGameScreen}

		]);
		

		App.start("hog", shell, function(){
			setMyTrace();
		});
	}

	
}
