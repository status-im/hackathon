package hog.screen;

import blip.Shell;
import blip.Data;
import kha.Framebuffer;

import hog.data.HogState;
import hog.data.GameState;

import blip.color.Pico;


import kfont.FontFace;
import kha.math.FastMatrix4;
import kha.math.FastMatrix3;
import kha.math.FastVector4;
import kha.math.FastVector3;
import kha.math.FastVector2;
import mathtool.RectPoly;

import blip.color.Pico;
import spriter.Spriter;
import spriter.EntityInstance;
import blip.AudioBox;
//import spriterkha.SpriterG2;
using spriterkha.SpriterG2;
import imagesheet.ImageSheet;

using hog.util.FontUtil;

@:access(spriter)
class HomeScreen extends BaseScreen implements Screen{

	var scaleX: Float;
		var scaleY: Float;
		var tX: Float;
		var tY: Float;
		var choicewidth:Int=1280;
		var choiceheight:Int=720;

	var done : Events = null;
	var data : Data = null;
	var imageSheet : ImageSheet;
	var fontFace : FontFace = null;
	var themeMusic : AudioBoxChannel;

	var centralCadreRect : RectPoly = new RectPoly(0,0,0,0);
	var centralCadreState:Bool=false;
	var centralCadreDown:Bool=false;

	var newGameRect : RectPoly = new RectPoly(0,0,0,0);
	var newGameState:Bool=false;
	var newGameDown:Bool=false;

	var homeRect : RectPoly = new RectPoly(0,0,0,0);
	var homeState:Bool=false;
	var homeDown:Bool=false;

	var requestRect : RectPoly = new RectPoly(0,0,0,0);
	var requestState:Bool=false;
	var requestDown:Bool=false;

	var arrowLeftRect : RectPoly = new RectPoly(0,0,0,0);
	var arrowLeftState:Bool=false;
	var arrowLeftDown:Bool=false;

	var arrowRightRect : RectPoly = new RectPoly(0,0,0,0);
	var arrowRightState:Bool=false;
	var arrowRightDown:Bool=false;

	var mdownHere:Bool=false;
	var mousedownX:Float;

	var arena:EntityInstance;
	var hogpit:EntityInstance;
	var hudrequest:EntityInstance;
	var hudhome:EntityInstance;
	var hudgames:EntityInstance;
	var hudnew:EntityInstance;
	var cadre:EntityInstance;
	var blocky:EntityInstance;

	var arrowleft:EntityInstance;
	var arrowright:EntityInstance;

	var gameleft:EntityInstance;
	var gameright:EntityInstance;
	var gamecentral:EntityInstance;

	var mapposition:Int=0;
	var actualposition:Int=0;
	var donotrepeat:Int=0;

	var gameAvailable:Array<hog.data.HogGame>;

var crazytestswitcher:Int=0;
var center:Bool=false;
var centernewgames:String;
var centerInt:Int=0;

var rotate:Bool=false;

var scalecentral:Float=1;


	public function new(hogState : HogState){
		super(hogState);
		gameAvailable=[];
	}


	public function enter(data : Data){

		onEnter(data);
		mdownHere=false;
		imageSheet = ImageSheet.fromTexturePackerJsonArray(kha.Assets.blobs.testtex01_json.toString());
		fontFace = FontFace.fromStandardFixedSizeTiles(kha.Assets.images.prefont,35,37,38,37);
		//"opponeturn"

		arena=HogLoadingScreen.pixities["arena"];
		arena.play("home");//arena.entity.animations[1].name);
		hogpit=HogLoadingScreen.pixities["hogpit"];
		hogpit.play(hogpit.entity.animations[1].name);
		hudrequest=HogLoadingScreen.pixities["hudrequest"];
		hudrequest.play("request");
		hudhome=HogLoadingScreen.pixities["hudhome"];
		hudhome.play("home");
		hudgames=HogLoadingScreen.pixities["hudgames"];
		hudgames.play("gamesx15");
		hudnew=HogLoadingScreen.pixities["hudnew"];
		hudnew.play("newtextanim");

		gamecentral=HogLoadingScreen.pixities["gamecentral"];
		gamecentral.play("middle");
		gameleft=HogLoadingScreen.pixities["gameleft"];
		gameleft.play("corner");
		gameright=HogLoadingScreen.pixities["gameright"];
		gameright.play("corner");

		arrowleft=HogLoadingScreen.pixities["arrowleft"];
		arrowright=HogLoadingScreen.pixities["arrowright"];

		cadre=HogLoadingScreen.pixities["cadre"];
		cadre.play(cadre.entity.animations[0].name);

		blocky=HogLoadingScreen.spriter.createEntity("hudraw");
		blocky.play("blocky");



		this.data = data = None;
		done = null;
		//themeMusic = AudioBox.streamMusic(kha.Assets.sounds.theme,true);
		if(AudioBox.musicEnabled==false)
		{
			//AudioBox.switchFurtherMusic();
		}
	
		if(themeMusic != null){
			//themeMusic.volume = 0.5;
			
		}
		kha.input.Mouse.get(0).notify(down,up,null,null);
	}
	public function exit(elapsedTime : Float){
		 mdownHere=false;
		if(themeMusic != null){
			//AudioBox.stop(themeMusic);
			themeMusic = null;
		}
		kha.input.Mouse.get(0).remove(down,up,null,null);
		onExit();
	}

	public function getOutcome() : Data{
		return data;
	}

	var debugCounter = 0;
	var lastDown : Float =  0;
	function down(button : Int, x : Float, y : Float){
		var now : Float = kha.Scheduler.time();
		if(now - lastDown < 0.2){
			debugCounter ++;
			if(debugCounter >= 5){
				var localStorage = js.Browser.getLocalStorage();
				if(localStorage != null){
					localStorage.removeItem("hog");
					return;
				}
			}
		}else{
			debugCounter = 0;
		}
		lastDown = now;


		var tempx=x;
		var tempy=y;

		if(rotate) 
		{
			x = (y - tY) / scaleY;
			y = choiceheight- (tempx - tX) / scaleX ;
		}
		else{
			x = (x - tX) / scaleX;
			y = (y - tY) / scaleY;
		}

		mdownHere=true;
		mousedownX=x;

		if(centralCadreRect.InPoly(x,y))
		{
			centralCadreDown=true;
			//centralCadreState=false;
		}
		else if(arrowLeftRect.InPoly(x,y) )
		{
			arrowLeftDown=true;
		}
		else if(arrowRightRect.InPoly(x,y) )
		{
			arrowRightDown=true;
		}
		else if(newGameRect.InPoly(x,y) )
		{
			newGameDown=true;
		}
		else if(requestRect.InPoly(x,y) )
		{
			requestDown=true;
		}
		
	}

	function up(button : Int, x : Float, y : Float)
	{
		var tempx=x;
		var tempy=y;

		if(rotate) 
		{
			x = (y - tY) / scaleY;
			y =choiceheight- (tempx - tX) / scaleX ;
		}
		else{
			x = (x - tX) / scaleX;
			y = (y - tY) / scaleY;
		}
		trace(x);
		trace(y);
		trace("up");
		if(centralCadreRect.InPoly(x,y) && centralCadreDown==true)
		{
			
			centralCadreState=true;
		}
		else if(arrowLeftRect.InPoly(x,y) && arrowLeftDown==true)
		{
			
			arrowLeftState=true;
			actualposition-=1;
			crazytestswitcher-=1;

		}
		else if(arrowRightRect.InPoly(x,y) && arrowRightDown==true)
		{
			
			arrowRightState=true;
			actualposition+=1;
			crazytestswitcher+=1;

		}
		else if(newGameRect.InPoly(x,y) && newGameDown==true)
		{
			
			//newGameState=true;
			center=true;
			hogState.grabGameOrCreateNewOne(
						HogConfig.values.defaultSzaboInPlay,
						HogConfig.values.defaultPeriodInMinutes,
						HogConfig.values.defaultNumUnits,checkparam
						); 

	

		}
		else if(requestRect.InPoly(x,y) && newGameDown==true)
		{
			
			//requestState=true;
			

		}
		else
		{
			if( (x-mousedownX)>0 && Math.abs( x-mousedownX)> (100/scaleX) && mdownHere==true) //choicewidth/10)
			{
				actualposition+=1;
	
				crazytestswitcher+=1;

			}
			else if( (x-mousedownX)<0 && Math.abs( x-mousedownX)>(100/scaleX) && mdownHere==true )// choicewidth/10)
				{
				actualposition-=1;
				crazytestswitcher-=1;
	
			}
			
		}

		centralCadreDown=false;
		arrowLeftDown=false;
		arrowRightDown=false;
		newGameDown=false;
		requestDown=false;

		mousedownX=x;
		 mdownHere=false;

	}

public function checkparam(test:Dynamic, gameid: String) {
	centernewgames=gameid;
}


	public function update(elapsedTime : Float, dt : Float) : String{

			hogpit.step(dt);
			arena.step(dt);
			hudrequest.step(dt);
			hudhome.step(dt);
			hudgames.step(dt);
			hudnew.step(dt);
			cadre.step(dt);
			blocky.step(dt);

			arrowleft.step(dt);
			arrowright.step(dt);
			gameleft.step(dt);
			gameright.step(dt);
			gamecentral.step(dt);

scalecentral = 1.0 + Math.sin(elapsedTime * 4) * 1/20;


		if(done == null && hogState.lastError != null){
			done = Error;
		}
		return done;
	}

	public function render(elapsedTime : Float, framebuffer : Framebuffer){

		var fWidth = framebuffer.width;
		var fHeight = framebuffer.height;

		var presenterScaleX : Float ;
		var presenterScaleY : Float ;
		var presenterScale : Float ;

		var presenterOffsetX : Float ;
		var presenterOffsetY : Float;
		var widthTaken : Float;
		var heightTaken : Float  ;


		if(fWidth<fHeight) 
		{
			presenterScaleX  = fWidth / choiceheight;
		presenterScaleY = fHeight/ choicewidth ;
		presenterScale = Math.min(presenterScaleX,presenterScaleY);

		presenterOffsetX = (fWidth - (presenterScale * choiceheight)) /2 ;
		presenterOffsetY= (fHeight - (presenterScale *choicewidth )) /2;
		widthTaken = presenterScale * choiceheight;
		heightTaken = presenterScale * choicewidth;
		rotate=true;
		}
		else{
			presenterScaleX  = fWidth / choicewidth;
		presenterScaleY = fHeight/ choiceheight ;
		presenterScale = Math.min(presenterScaleX,presenterScaleY);

		presenterOffsetX = (fWidth - (presenterScale * choicewidth)) /2 ;
		presenterOffsetY= (fHeight - (presenterScale * choiceheight )) /2;
		widthTaken = presenterScale * choicewidth;
		heightTaken = presenterScale * choiceheight ;

		rotate=false;
		
		}

		


		scaleX = presenterScale;
		scaleY = presenterScale;
		tX = presenterOffsetX;
		tY = presenterOffsetY ;


		var g2 = framebuffer.g2;
		var transform = FastMatrix3.translation(tX,tY).multmat(FastMatrix3.scale(scaleX,scaleY));
		
		g2.begin(true,blip.color.Pico.DarkGrey);
		g2.imageScaleQuality =kha.graphics2.ImageScaleQuality.Low;
		if(presenterOffsetX > 0 || presenterOffsetY > 0){
			g2.scissor(Std.int(presenterOffsetX),Std.int(presenterOffsetY),Std.int(widthTaken),Std.int(heightTaken));
		}

		g2.pushTransformation(transform);

		if(fWidth<fHeight) 
		{
			g2.pushTransformation(g2.transformation.multmat(FastMatrix3.translation(choiceheight/2, choicewidth/2).multmat(FastMatrix3.rotation(Math.PI/2).multmat(FastMatrix3.translation(-choicewidth/2, -choiceheight/2)))));
		}
		g2.drawRect(0, 0, 300,300);


g2.color = blip.color.Pico.DarkGrey;
		g2.drawSpriter(imageSheet, arena,640,720);

g2.color = kha.Color.White;
g2.drawSpriter(imageSheet, cadre ,640,720);

g2.drawSpriter(imageSheet,hogpit,640,240);

fontFace.draw(g2,"HOG",640,140,2,Center,Center);

//g2.drawSpriter(imageSheet,hudhome,220,180);
//fontFace.draw(g2,"HOME",220,150,1,Center,Center);
//g2.drawSpriter(imageSheet,hudrequest,1025,180);
//ScreenUtilities.onlyRect(g2,1025,240, 270, 80, requestRect , true);
//fontFace.draw(g2,"REQUEST",1030,150,1,Center,Center);
		//g2.popTransformation();
		//g2.popTransformation();
		//g2.transformation = FastMatrix3.identity();
		//g2.transformation=transform;
		g2.drawSpriter(imageSheet,hudnew,650,620);
		ScreenUtilities.onlyRect(g2,644,568, 286, 96, newGameRect , false);

		g2.drawSpriter(imageSheet,hudgames,645,490);
		
		g2.drawSpriter(imageSheet,arrowright,400,340);
		ScreenUtilities.onlyRect(g2,390,330, 80, 120, arrowLeftRect , false);
		g2.drawSpriter(imageSheet,arrowleft,900,340);
		ScreenUtilities.onlyRect(g2,900,330, 80, 120, arrowRightRect , false);

		var x = 640;
		var y = 330;
		var counter = 0;
		var numGames = 0;
		g2.pushTransformation(g2.transformation.multmat(kha.math.FastMatrix3.translation((x+10),(y+20)).multmat(kha.math.FastMatrix3.scale(scalecentral,scalecentral)).multmat(kha.math.FastMatrix3.translation(-(x+10),-(y+20)))));
		g2.drawSpriter(imageSheet,gamecentral,x+10,y+20);
		g2.popTransformation();
		ScreenUtilities.onlyRect(g2, x+8,y+15, 150, 150, centralCadreRect ,false);
fontFace.draw(g2,"YOUR GAMES",650,265,1,Center,Center);

/////////TIMING
//ERWAN : how do I get the game selected to show its timeLeft ? fontFace.draw(g2,hog.util.TimeUtil.dhms(game.timeLeft()) + " LEFT",650,460,0.8,Center,Center);

/////////


g2.drawSpriter(imageSheet,blocky,170, 220);
var blockyScale =2;

					//hogState.registeredAddress;
					//currentAccount
					var blocky = HogBlocky.get(hogState.registeredAddress);
					blocky.draw(g2,166, 160,blockyScale, Center,Center);




/////////////////
var indava:Int=0;

		
		for(gameId in hogState.games.keys()){ 
			numGames ++;
			var game = hogState.games[gameId];

			if(game.localStatus == None){
				continue;
			}
			if(hogState.games[gameId]!=null ){

			gameAvailable[indava]= hogState.games[gameId];
			if(center==true)
			{
				if(centernewgames==gameId)
				{
					actualposition=indava;
					center=false;
				}
			}
			indava++;

			}
		}

/////////////
var nGam=gameAvailable.length;		

		if(actualposition<0)
			{actualposition=actualposition+nGam;}
		else if(actualposition>(nGam-1))
			{actualposition=0;}


//////////

if(nGam==0 && numGames > 0)
		{
			fontFace.draw(g2,"CREATE GAME",650,410,0.5,Center,Center);
			if(gamecentral.currentAnimationName !="nogame"){
				gamecentral.play("nogame");
			}
			actualposition=0;
			if(centralCadreState==true)
			{
				hogState.grabGameOrCreateNewOne(
						HogConfig.values.defaultSzaboInPlay,
						HogConfig.values.defaultPeriodInMinutes,
						HogConfig.values.defaultNumUnits
						); 
				centralCadreState=false;
			}
		}

//trace(gameAvailable.length);
//trace(gameAvailable);

// trace("gameAvailable.length");
var ind:Int=0;
var noaction=false;
		for(game in gameAvailable){ 

			if(game!=null ){

			g2.color = kha.Color.White;
			var stateanim="none";
			var	statement="NONE";


			
			if(game.localStatus == None){
				gameAvailable.remove(game);
				continue;
		
			}
			switch(game.localStatus){
				case OponentFirstMove: 
				stateanim="firstturn";
				statement="OPPONENT BUILDS";
				noaction=false;
				case WaitingOponent: 
				stateanim="searching";
				statement="SEARCHING FOE";
				noaction=true;
				case OponentTurn: 
				stateanim="opponentturn";
				statement="OPPONENT TURN";
				noaction=false;
				case YourTurn: 
				stateanim="yourturn";
				statement="YOUR TURN";
				noaction=false;
				case CreatingGame: 
				stateanim="creating";
				statement="CREATING GAME";
				noaction=true;
				case StartingGame: 
				stateanim="starting";
				statement="STARTING GAME";
				noaction=true;
				case SendingUnits: 
				stateanim="units";
				statement="SENDING UNITS";
				noaction=false;
				case Arena: 
				stateanim="fight";
				statement="FIGHT";
				noaction=false;
				case Done: 
				stateanim="done";
				statement="THE END";
				noaction=false;
				case NobodyJoined: 
				stateanim="nobody";
				statement="NOBODY JOINED";
				noaction=false;
				case OponentLate: 
				stateanim="opponentlate";
				statement="OPPONENT LATE";
				noaction=false;
				case YouLate: 
				stateanim="youlate";
				statement="YOU ARE LATE";
				noaction=false;
				case OponentQuit: 
				stateanim="opponentquit";
				statement="OPPONENT QUIT";
				noaction=false;
				case NoLocalData: 
				stateanim="nodata";
				statement="NO LOCAL DATA";
				noaction=false;
				case None: 
				stateanim="none";
				statement="NONE";
				noaction=true;
				case Collecting: 
				stateanim="collect";
				statement="COLLECT";
				noaction=true;
				case Quitting: 
				stateanim="collect";
				statement="QUITING";
				noaction=true;
			};

			if(ind ==actualposition)
			{


				if(centralCadreState==true && noaction==false)
				{
					done = PlayGame;
					data = Some(game);
					centralCadreState=false;
				}
				else if(centralCadreState==true && noaction==true)
				{

					centralCadreState=false;
				}

				fontFace.draw(g2,statement,650,425,0.7,Center,Center);
				if(gamecentral.currentAnimationName !=stateanim){
				gamecentral.play(stateanim);
				}

				if( (stateanim== "nodata" ||  stateanim =="collect"  ||   stateanim=="nobody" ||  stateanim=="opponentlate" ||  stateanim=="youlate" || stateanim=="opponentquit")==false )
				{
					fontFace.draw(g2,hog.util.TimeUtil.dhms(game.timeLeft()) + " LEFT",650,460,0.6,Center,Center);
				}


			}
			else if( ind ==(actualposition+1) && actualposition< nGam-1 )
			{
				if(gameright.currentAnimationName !=stateanim){
				gameright.play(stateanim);
				}
				g2.drawSpriter(imageSheet,gameright,x+160,y);
			}
			else if( ind==(actualposition-1) && actualposition>0 )
			{
				if(gameleft.currentAnimationName !=stateanim){
				gameleft.play(stateanim);
				}
				g2.drawSpriter(imageSheet,gameleft,x-140,y);
			}
			else if( ind == 0 && actualposition== (nGam-1) )
			{
				if(gameright.currentAnimationName !=stateanim){
				gameright.play(stateanim);
				}
				g2.drawSpriter(imageSheet,gameright,x+160,y);
			}
			else if( ind==(nGam-1) && actualposition==0 )
			{
				if(gameleft.currentAnimationName !=stateanim){
				gameleft.play(stateanim);
				}
				g2.drawSpriter(imageSheet,gameleft,x-140,y);
			}

			mapposition++;
				}
			ind++;	
		}
		mapposition=0;


		if(numGames==0)
		{
			var s = "NO GAME SLOT";
			if(hogState.registeredAddress == null){
				s = "NO ACCOUNT";
			}
			fontFace.draw(g2,s,650,410,0.5,Center,Center);
			if(gamecentral.currentAnimationName !="none"){
				gamecentral.play("none");
			}
			actualposition=0;
			if(centralCadreState==true)
			{
				ScreenUtilities.onlyRect(g2, x+10,y, 200, 200, centralCadreRect , true,kha.Color.Green);
				centralCadreState=false;
			}
		}

////////box limit
		g2.color = blip.color.Pico.DarkGrey;
		
			g2.fillRect(-5,0,35,720);
			g2.fillRect(1255,0,70,720);
////


if(fWidth<fHeight) 
		{
			g2.popTransformation();
		}
		////////screen dimensionement///////////////////
		g2.popTransformation();
		
		//TODO use viewport ?
		g2.color = blip.color.Pico.DarkGrey;
		
		if(presenterOffsetX > 0 || presenterOffsetY > 0 ){
			g2.disableScissor();
		}

		if(presenterOffsetX > 0){
			g2.fillRect(0,0,presenterOffsetX,fHeight);
			g2.fillRect(presenterOffsetX + widthTaken,0,fWidth,fHeight);
		}
		if(presenterOffsetY > 0){
			g2.fillRect(0,0,fWidth, presenterOffsetY);
			g2.fillRect(0,presenterOffsetY + heightTaken,fWidth, fHeight);
		}
		//////////////////////////////////////

		g2.end();


		//debug_render(elapsedTime,framebuffer);
	}


	function debug_down(button : Int, x : Float, y : Float){
		if(hogState.wrongNetwork){
			return;
		}
		var now : Float = kha.Scheduler.time();
		if(now - lastDown < 0.2){
			var localStorage = js.Browser.getLocalStorage();
			if(localStorage != null){
				localStorage.removeItem("hog");
				return;
			}
		}
		lastDown = now;
		// trace("x",x);
		x -= 20;
		x /= 60;

		if(y < 20 || y > 70){
			return;
		}

		var i = Std.int(x);
		// trace("i",i);
		if(i >= 0){
			var c= 0;
			for (gameId in hogState.games.keys()){
				var game = hogState.games[gameId];
				if(game.localStatus != None){
					if(i == c){
						if(game.localStatus == NoLocalData){
							hogState.quitGame(game.id);
						// }else if(game.localStatus == YouLate || game.localStatus == OponentLate){
						// 	hogState.
						}else{
							done = PlayGame;
							data = Some(game);
						}
					}
					c++;
				}
			}
			if(done == null){
				if(i == c){
					// done = NewGame; //TODO screen for new game
					hogState.grabGameOrCreateNewOne(
						HogConfig.values.defaultSzaboInPlay,
						HogConfig.values.defaultPeriodInMinutes,
						HogConfig.values.defaultNumUnits
						); 
				}
			}
			
		}
	}


	function debug_render(elapsedTime : Float, framebuffer : Framebuffer){
		var g2 = framebuffer.g2;
		
		
		g2.begin(true,0xFFEECC00);

		if(hogState.wrongNetwork){
			g2.color = Pico.Black;
			g2.drawText(kha.Assets.fonts.default_font, 30, "Wrong Network", framebuffer.width/2, framebuffer.height/2, Center, Center);
			g2.end();
			return;
		}
		
		var x = 20;
		var counter = 0;
		var numGames = 0;
		for(gameId in hogState.games.keys()){ //TODO sort
			numGames ++;
			var game = hogState.games[gameId];
			if(game.localStatus == None){
				continue;
			}
			g2.color = 
			switch(game.localStatus){
				case OponentFirstMove: Pico.White;
				case WaitingOponent: Pico.Yellow;
				case OponentTurn: Pico.Orange;
				case YourTurn: Pico.LightGreen;
				case CreatingGame: Pico.Pink;
				case StartingGame: Pico.Pink;
				case SendingUnits: Pico.Pink;
				case Arena: Pico.LightGreen;
				case Done: Pico.LightGrey;
				case NobodyJoined:Pico.LightGrey;
				case OponentLate:Pico.LightGrey;
				case YouLate: Pico.LightGrey;
				case OponentQuit: Pico.LightGrey;
				case NoLocalData:Pico.Black;
				case None: Pico.DarkGrey;
				case Collecting: Pico.DarkBrown;
				case Quitting: Pico.DarkBrown;
			};

			if(game.isExpired()){
				g2.color = Pico.LightGrey;
			}
			g2.fillRect(x,20,50,50);
			x+= 60;
			counter++;
		}

		if(counter < numGames){
			g2.color = Pico.Red;
			g2.fillRect(x,20,50,50);
		}

		g2.color = Pico.Pink;
		g2.fillRect(0,0,50,50);

		g2.color = Pico.Black;
		var ty = 30.0;
		for(tr in Main.oldTraces){
			g2.drawText(kha.Assets.fonts.default_font, 10, tr.v,0, ty,Left,Top);
			
			if(tr.inf != null && tr.inf.customParams != null){
				ty += 10;
				g2.drawText(kha.Assets.fonts.default_font, 10, tr.inf.customParams.join(","),10, ty,Left,Top);
			}
			
			ty += 15;
		}

		g2.end();
	}
}