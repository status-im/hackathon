package hog.screen;

import blip.Shell;
import blip.Data;

import hog.data.HogState;
import hog.data.HogGame;
import hog.data.GameState;

import hog.screen.play.YourTurn;
import hog.screen.play.Arena;
import hog.screen.play.PlayState;
import hog.screen.play.Popup;

import kha.Framebuffer;


class HogGameScreen extends BaseScreen implements Screen{
	var game : HogGame;

	var done : Events = null;
	var data : Data = null;

	var yourTurn : YourTurn;
	var arena : Arena;
	var popup : Popup;

	var currentStateScreen : PlayState;

	public function new(hogState : HogState){
		super(hogState);
	}

	public function enter(data : Data){
		onEnter(data);
		game = switch(data){
			case Some(g):g;
			case None:null;
		}
		this.data = data = None;
		done = null;
		
		hogState.gameUpdated.then(gameUpdated);

		if(game != null){
			
			yourTurn = new YourTurn(hogState, game);
			arena = new Arena(hogState, game);
			popup = new Popup(hogState, game);

			setState(game.localStatus);
		}else{
			//TODO error
			done = Back;
		}
		
	}

	public function setState(gameState : GameState){

		// trace("setState : " + gameState);
		// trace(game);
		
		if(currentStateScreen != null){
			currentStateScreen.exit();
		}
		

		switch(gameState){
			case None: //the game does not exist (should not happen ?)
				//TODO error
				done = Back;

			// should not be able to  emter ?
			case CreatingGame: //waiting for create_game transaction to be mined (P1 only)
				currentStateScreen = popup; //for now
			case StartingGame: //waiting for start_game transaction to be mined (P2 only)
				currentStateScreen = popup; //for now
			
			// should not be able to enter ?
			case WaitingOponent:  //waiting for oponent "start_game" to be mined (P1 only)
				currentStateScreen = popup; //for now
			case OponentFirstMove: //waiting for P2 to play its first move (show as setting up)
				currentStateScreen = yourTurn; //for now
			
			// should not be able to  emter ?
			case NobodyJoined: // Nobody did a "start_game"
				currentStateScreen = yourTurn; //for now

			// should not be able to  emter ?
			case Collecting: // You are closing the game
				currentStateScreen = popup; //for now

			// should not be able to  emter ?
			case Quitting: // You are closing the game
				currentStateScreen = popup; //for now

			// should not be able to  emter ?
			case NoLocalData: // There is no local data // cannot be played -> redirect the player to us e the device where it started (will be fixed later)
				currentStateScreen = yourTurn; //for now

			case YourTurn: //waiting for you to play  
				currentStateScreen = yourTurn;
			case SendingUnits: // waiting for your move transaction to be mined
				currentStateScreen = yourTurn;
			
			case OponentTurn: //waiting for oponent play to be mined
				currentStateScreen = arena;
			case Arena: // both players played, showing the result
				currentStateScreen = arena;
			case Done: //Game is done
				currentStateScreen = arena;
			

			case OponentLate: // Oponent did move in time
				currentStateScreen = arena;
			
			case YouLate: //You arrived too late to make a move
				currentStateScreen = arena;
			
			case OponentQuit: // The oponent quited the game
				currentStateScreen = arena;
			
			
		}

		if(currentStateScreen == null){
			//TODO error
			trace("ERROR","wrong state : ", gameState);
			done = Back;
		}else{
			currentStateScreen.enter(gameState);
		}
		
	}

	public function gameUpdated(gameUpdate : GameUpdate){
		if(gameUpdate.game.id == game.id){
			setState(game.localStatus);
		}
	}

	public function exit(elapsedTime : Float){
		hogState.gameUpdated.detach(gameUpdated);
		if(currentStateScreen != null){
			currentStateScreen.exit();
		}
		onExit();
	}

	public function getOutcome() : Data{
		return data;
	}

	
	public function update(elapsedTime : Float, dt : Float) : String{
		if(currentStateScreen != null){
			var tmpDone = currentStateScreen.update(elapsedTime, dt);
			if(tmpDone != null){
				return tmpDone;
			}else{
				return done;
			}
		}else{
			return done;
		}
		
	}

	public function render(elapsedTime : Float, framebuffer : Framebuffer){
		if(currentStateScreen != null){
			currentStateScreen.render(elapsedTime, framebuffer);
		}
	}
}