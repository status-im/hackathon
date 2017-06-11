package hog.screen.play;

import kha.Framebuffer;
import blip.color.Pico;
using hog.util.FontUtil;

import hog.data.HogGame;
import hog.data.GameState;
import hog.data.HogState;

import web3.Web3;

import kfont.FontFace;
import kha.math.FastMatrix4;
import kha.math.FastMatrix3;
import kha.math.FastVector4;
import kha.math.FastVector3;
import kha.math.FastVector2;
import mathtool.RectPoly;


import spriter.Spriter;
import spriter.EntityInstance;
import blip.AudioBox;
//import spriterkha.SpriterG2;
using spriterkha.SpriterG2;
import imagesheet.ImageSheet;

@:access(spriter)
class Arena implements PlayState extends BaseStateScreen{

		var elapsedTime : Float = 0;
/*
	var sendUnitsRect : RectPoly = new RectPoly(0,0,0,0);
	var sendUnitsState:Bool=false;
	var sendUnitsDown:Bool=false;*/

	var returnHomeRect : RectPoly = new RectPoly(0,0,0,0);
	var returnHomeState:Bool=false;
	var returnHomeDown:Bool=false;


	var quitRect : RectPoly = new RectPoly(0,0,0,0);
	var quitState:Bool=false;
	var quitDown:Bool=false;


	var fightRect : RectPoly = new RectPoly(0,0,0,0);
	var fightState:Bool=false;
	var fightDown:Bool=false;


	var finalRect : RectPoly = new RectPoly(0,0,0,0);
	var finalState:Bool=false;
	var finalDown:Bool=false;


	var scaleX: Float;
		var scaleY: Float;
		var tX: Float;
		var tY: Float;
		var choicewidth:Int=1280;
		var choiceheight:Int=720;

		var imageSheet : ImageSheet;
	var fontFace : FontFace = null;
	var themeMusic : AudioBoxChannel;

	var numUnitsChosen : Int = 1;
	var moving = false;

	var arenapit:EntityInstance;
	//var hudSendUnits:EntityInstance;
	var hudUnits:EntityInstance;

	var hudscore:EntityInstance;
	var finalhud:EntityInstance;
	var returnHome:EntityInstance;
	var quitZone:EntityInstance;
	var fightZone:EntityInstance;
	var effect:EntityInstance;
	var panArray:Array<Units>;

	var foeArray:Array<Units>;
	var gothog:Array<EntityInstance>;
	var unitsindication:EntityInstance;

var rotate:Bool=false;

var blockyLeft:EntityInstance;
var blockyRight:EntityInstance;

var fightstart:Bool=false;
var fxeffect:Bool=false;
var timer:Int=0;
var endturn:Bool=false;

var movelose:Int=0;
var scalecentral:Float=1;

	public function new(hogState : HogState, game : HogGame){
		super(hogState, game);
		gothog=[];
		panArray=[];
		foeArray=[];
	}

	public function enter(state : GameState){
			imageSheet = ImageSheet.fromTexturePackerJsonArray(kha.Assets.blobs.testtex01_json.toString());
		fontFace = FontFace.fromStandardFixedSizeTiles(kha.Assets.images.prefont,35,37,38,37);

		arenapit=HogLoadingScreen.pixities["arena"];
		arenapit.play("main");
		hudscore=HogLoadingScreen.pixities["hudscore"];
		hudscore.play("back");
		//hudSendUnits=HogLoadingScreen.spriter.createEntity("hudraw");
		//hudSendUnits.play("new");
		returnHome=HogLoadingScreen.spriter.createEntity("hudraw");
		returnHome.play("returnhome");

		quitZone=HogLoadingScreen.spriter.createEntity("hudraw");
		quitZone.play("quitx2");

finalhud=HogLoadingScreen.spriter.createEntity("hudraw");
		finalhud.play("drawround");


		fightZone=HogLoadingScreen.spriter.createEntity("hudraw");
		fightZone.play("fight");

		effect=HogLoadingScreen.spriter.createEntity("effect");
		effect.play("fight");

		unitsindication=HogLoadingScreen.spriter.createEntity("panther");
		unitsindication.play("idle");

		hudUnits=HogLoadingScreen.pixities["hudraw"];
		hudUnits.play("games");

		blockyLeft=HogLoadingScreen.spriter.createEntity("hudraw");
		blockyLeft.play("blocky");

		blockyRight=HogLoadingScreen.spriter.createEntity("hudraw");
		blockyRight.play("blocky");


		if(game.localStatus == Arena){
			for(i in 0 ...game.lastMove)
				{
			panArray.push(new Units("arena",2, Math.random() ,50+ 20* Math.random(),620+ 20* Math.random(),"panther","walkright",0,50,-20,450,60,50,10));

				}


				for(i in 0 ...game.lastOponentMove)
				{
			foeArray.push(new Units("foearena",-2, Math.random() ,1100+ 20* Math.random(),620+ 20* Math.random(),"leo","walkleft",0,20,-20,-410,60,50,10));

				}
	

		}
		else if(game.localStatus == OponentTurn){
			for(i in 0 ...game.lastMove)
				{
			panArray.push(new Units("arena",2, Math.random() ,50+ 20* Math.random(),620+ 20* Math.random(),"panther","walkright",0,50,-20,450,60,50,10));

				}
		}
		else if(game.localStatus == Done){
			
		}
		//panArray.push(new Units("arena",2, Math.random()-0.5 ,240,700,"panther","walkright",0,50,10,450,90,50,10));

		for(i in 0 ...6)
		{
			gothog.push(HogLoadingScreen.spriter.createEntity("huddarkerbone"));

		}


		kha.input.Mouse.get(0).notify(down,up,null,null);
	}

	public function exit(){
		kha.input.Mouse.get(0).remove(down,up,null,null);
		panArray=[];
		gothog=[];
		foeArray=[];
		fightstart=false;
		fxeffect=false;
		movelose=0;
		endturn=false;
	}

	function readyForNext() : Bool{
		return elapsedTime > 0.5 && game.localStatus == Arena; 
	}

	function down(button : Int, x : Float, y : Float){
	
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
/*
		if(x > width - 40 && y < 40){
			done = Back;
		}*/
		if(returnHomeRect.InPoly(x,y) && returnHomeDown==false)
		{
			returnHomeDown=true;
			//returnHomeState=true;
		}

		if(quitRect.InPoly(x,y) && quitDown==false)
		{
			quitDown=true;
			//returnHomeState=true;
		}

		if(fightRect.InPoly(x,y) && fightDown==false)
		{
			fightDown=true;
			//returnHomeState=true;
		}

		if(readyForNext() &&  finalRect.InPoly(x,y) && finalDown==false)
		{
			finalDown=true;
			//returnHomeState=true;
		}

		/*
		if(readyForNext() && x > width/2 - s/2 && x < width/2 + s/2 && y > height - s && y < height){
			trace("arena seen");
			hogState.arenaSeen(game.id);
			// TODO moving = true;
		}
		*/
	}

	function up(button : Int, x : Float, y : Float){
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

		if(returnHomeRect.InPoly(x,y) && returnHomeDown==true)
		{
			
			//returnHomeState=true;
			done=Back;
		}

		if(fightRect.InPoly(x,y) && fightDown==true && fightstart==false)
		{
			
			//returnHomeState=true;
			//done=Back;
			fightstart=true;

		for(i in 0 ...panArray.length)
		{
			panArray[i].fight();
		}
			for(i in 0 ...foeArray.length)
		{
			foeArray[i].fight();
		}


		}

		if(readyForNext() &&  finalRect.InPoly(x,y) && finalDown==true)
		{
			trace("arena seen");
			hogState.arenaSeen(game.id);
			//finalState=true;
		}

		if(quitRect.InPoly(x,y) && quitDown==true)
		{
			if(game.localStatus == OponentLate){
				hogState.collect(game.id);
			}else if(game.localStatus == YouLate){
				hogState.quitGame(game.id);
			}else if(game.localStatus == NobodyJoined){
				hogState.collect(game.id);
			}
			done=Back;
		}
		finalDown=false;
		fightDown=false;
		returnHomeDown=false;
		quitDown=false;
	}

	override public function update(elapsedTime : Float, dt : Float) : String{
		super.update(elapsedTime,dt);
		this.elapsedTime  = elapsedTime;
		arenapit.step(dt);
		hudscore.step(dt);
		finalhud.step(dt);
		//hudSendUnits.step(dt);
		hudUnits.step(dt);
		returnHome.step(dt);
		unitsindication.step(dt);
		quitZone.step(dt);
		fightZone.step(dt);
		blockyLeft.step(dt);
		blockyRight.step(dt);
		effect.step(dt);
		for(i in 0 ...6)
		{
			gothog[i].step(dt);
		}

		for(i in 0 ...panArray.length)
		{
			panArray[i].update(elapsedTime , dt );
			if(panArray[i].anim=="fightright" && endturn==false && fxeffect==false)
			{
				fxeffect=true;
			}
			else if(endturn==true)
			{
				if(i<movelose)
				{
					if(panArray[i].anim !="deadright"){
						panArray[i].deadright();
						}
				}
				else
				{
					if(panArray[i].anim !="win"){
						panArray[i].win();
						}
				}

			}

		}

		for(i in 0 ...foeArray.length)
		{
			foeArray[i].update(elapsedTime , dt );

			if(foeArray[i].anim=="fightleft" && endturn==false && fxeffect==false)
			{
				fxeffect=true;
			}
			else if(endturn==true)
			{
				if(i<movelose)
				{
					if(foeArray[i].scheme !="deadleft"){
						foeArray[i].deadleft();

						}

				}
				else
				{
					if(foeArray[i].anim !="win"){
						foeArray[i].win();
						}
				}

			}

		}

		if(fxeffect==true){
			timer++;
		}

		if(timer>100)
		{
			timer=0;
			fxeffect=false;
			endturn=true;
			movelose=Std.int( Math.min(game.lastMove,game.lastOponentMove));

		}

		scalecentral = 1.0 + Math.sin(elapsedTime * 4) * 1/5;

		if(done == null && hogState.lastError != null){
			done = Error;
		}
		return done;
	}


	var s = 80;
	override public function render(elapsedTime : Float, framebuffer : Framebuffer){
		super.render(elapsedTime,framebuffer);

		////////screen dimensionement///////////////////

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
		
		g2.begin(true,Pico.LightGrey);//blip.color.Pico.DarkGrey);
		g2.imageScaleQuality = kha.graphics2.ImageScaleQuality.Low;
		if(presenterOffsetX > 0 || presenterOffsetY > 0){
			g2.scissor(Std.int(presenterOffsetX),Std.int(presenterOffsetY),Std.int(widthTaken),Std.int(heightTaken));
		}
		g2.pushTransformation(transform);

if(fWidth<fHeight) 
		{
			g2.pushTransformation(g2.transformation.multmat(FastMatrix3.translation(choiceheight/2, choicewidth/2).multmat(FastMatrix3.rotation(Math.PI/2).multmat(FastMatrix3.translation(-choicewidth/2, -choiceheight/2)))));
		}
		//////////////////////////////////////////////

		//TODO
		width = choicewidth;//framebuffer.width;
		height = choiceheight ;// framebuffer.height;
		
		/*var backgroundColor = 
		if(game.isExpired()){
			Pico.LightGrey;
		}else{
			0xEECC00;
		}
		
		g2.begin(true,backgroundColor);*/

		g2.color = kha.Color.White;

		g2.drawSpriter(imageSheet, arenapit,640,720);

		g2.drawSpriter(imageSheet, hudscore,640,100);

		g2.drawSpriter(imageSheet, returnHome,1180,100);
		ScreenUtilities.onlyRect(g2, 1180,70, 150, 60, returnHomeRect , false,kha.Color.Red);

		for(i in 0 ...6)
		{
			if( i>(game.position+2) )
			{
				if(gothog[i].currentAnimationName !="middle"){
					gothog[i].play("middle");
				}
			}
			else
			{
				if(gothog[i].currentAnimationName !="hog"){
					gothog[i].play("hog");
				}
				
			}
			g2.drawSpriter(imageSheet, gothog[i],425+i*85,66);
		}
		/////////TIMING
//fontFace.draw(g2,hog.util.TimeUtil.dhms(game.timeLeft()) + " LEFT",640,140,0.8,Center,Center);
//trace(game.timeLeft());
/////////
				g2.drawSpriter(imageSheet,blockyLeft,280, 100);
				var blockyScale =2;

					var blockyL = HogBlocky.get(hogState.registeredAddress);
					blockyL.draw(g2,276, 40,blockyScale, Center,Center);


					g2.drawSpriter(imageSheet,blockyRight,1000, 100);
					var blockyScale =2;
					var blockyR = HogBlocky.get( new Address(game.contractState.otherPlayer) );
					blockyR.draw(g2,996, 40,blockyScale, Center,Center);



					/////////////

		for(i in 0 ...panArray.length)
		{
			g2.drawSpriter(imageSheet, panArray[i].units,panArray[i].startx+panArray[i].x,panArray[i].starty+panArray[i].y);
		}


for(i in 0 ...foeArray.length)
		{
			g2.drawSpriter(imageSheet, foeArray[i].units,foeArray[i].startx+foeArray[i].x,foeArray[i].starty+foeArray[i].y);
		}


		//g2.color = Pico.Red;
		//g2.drawText(font, 30, "X",width, 0,Right,Top);

		g2.color = Pico.White;

		g2.color = Pico.LightGreen;
		fontFace.draw(g2,""+ game.numUnits+"",275, 35,1,Center,Center);
		//g2.drawSpriter(imageSheet, unitsindication,120, 250);
		g2.color = Pico.Red;
		fontFace.draw(g2,""+ game.oponentNumUnits+"",1000, 35,1,Center,Center);
		//g2.drawSpriter(imageSheet, unitsindication,1150, 250);
		g2.color = Pico.White;
		//fontFace.draw(g2,""+ game.position+"",width/2, 80,1,Center,Center);

		//fontFace.draw(g2,game.localStatus,640,300,1,Center,Center);
		//g2.drawText(font, 30, "" + game.lastMove,width/2 - 10, height/2 + 60,Right,Center);

		if(game.localStatus == Arena){
			if(arenapit.currentAnimationName !="main"){
					arenapit.play("main");
				}	

			fontFace.draw(g2,"YOU SENT ",470,366,0.7,Center,Center);
			fontFace.draw(g2,""+game.lastMove+"",510,410,1,Center,Center);
			//g2.drawSpriter(imageSheet, unitsindication,520, 440);

			fontFace.draw(g2,"FOE SENT ",846,366,0.7,Center,Center);
			fontFace.draw(g2,""+game.lastOponentMove+"",770,410,1,Center,Center);
			//g2.drawSpriter(imageSheet, unitsindication,750, 440);
			//g2.drawText(font, 30, "" + game.lastOponentMove,width/2 + 10, height/2 + 60,Left,Center);
			

			if(endturn==true && game.gameEnding()==NotYet){
				if(game.lastMove>game.lastOponentMove)
					{
						fontFace.draw(g2,"ROUND WON",640,300,1,Center,Center);
						if(finalhud.currentAnimationName !="wonround"){
							finalhud.play("wonround");
							}
						g2.drawSpriter(imageSheet, finalhud,645,530);
					ScreenUtilities.onlyRect(g2, 640,470, 220, 90, finalRect , false,kha.Color.Red);
					 }
				else if(game.lastMove<game.lastOponentMove)
					{
						fontFace.draw(g2,"ROUND LOST",640,300,1,Center,Center);
						if(finalhud.currentAnimationName !="lostround"){
							finalhud.play("lostround");
							}
					g2.drawSpriter(imageSheet, finalhud,645,530);
					ScreenUtilities.onlyRect(g2, 640,470, 220, 90, finalRect , false,kha.Color.Red);
					 }
				else if(game.lastMove==game.lastOponentMove)
				{
						fontFace.draw(g2,"ROUND DRAW",640,300,1,Center,Center);
					if(finalhud.currentAnimationName !="drawround"){
							finalhud.play("drawround");
							}
					g2.drawSpriter(imageSheet, finalhud,645,530);
					ScreenUtilities.onlyRect(g2, 640,470, 220, 90, finalRect , false,kha.Color.Red);
				}
			}
			else if(endturn==true && game.gameEnding()!=NotYet)
			{
				if(game.gameEnding()==Won)
					{
						g2.pushTransformation(g2.transformation.multmat(kha.math.FastMatrix3.translation(640,300).multmat(kha.math.FastMatrix3.scale(scalecentral,scalecentral)).multmat(kha.math.FastMatrix3.translation(-640,-300))));
						fontFace.draw(g2,"VICTORY",640,300,2,Center,Center);
						g2.popTransformation();
						if(finalhud.currentAnimationName !="winmatch"){
							finalhud.play("winmatch");
							}

						g2.drawSpriter(imageSheet, finalhud,645,530);
					ScreenUtilities.onlyRect(g2, 640,470, 220, 90, finalRect , false,kha.Color.Red);
					 }
				else if(game.gameEnding()==Lost)
					{
						g2.pushTransformation(g2.transformation.multmat(kha.math.FastMatrix3.translation(640,300).multmat(kha.math.FastMatrix3.scale(scalecentral,scalecentral)).multmat(kha.math.FastMatrix3.translation(-640,-300))));
						fontFace.draw(g2,"DEFEAT",640,300,2,Center,Center);
						g2.popTransformation();
						if(finalhud.currentAnimationName !="lostmatch"){
							finalhud.play("lostmatch");
							}
					g2.drawSpriter(imageSheet, finalhud,645,530);
					ScreenUtilities.onlyRect(g2, 640,470, 220, 90, finalRect , false,kha.Color.Red);
					 }
				else if(game.gameEnding()==Draw)
				{
					g2.pushTransformation(g2.transformation.multmat(kha.math.FastMatrix3.translation(640,300).multmat(kha.math.FastMatrix3.scale(scalecentral,scalecentral)).multmat(kha.math.FastMatrix3.translation(-640,-300))));
						fontFace.draw(g2,"DRAW",640,300,2,Center,Center);
						g2.popTransformation();
					if(finalhud.currentAnimationName !="drawmatch"){
							finalhud.play("drawmatch");
							}
					g2.drawSpriter(imageSheet, finalhud,645,530);
					ScreenUtilities.onlyRect(g2, 640,470, 220, 90, finalRect , false,kha.Color.Red);
				}
			}
			else if(fightstart==false)
			{
				g2.drawSpriter(imageSheet, fightZone,645,320);
			ScreenUtilities.onlyRect(g2, 640,280, 220, 90, fightRect , false,kha.Color.Red);
			}
			else if(fxeffect==true)
			{
				g2.drawSpriter(imageSheet, effect,640,720);
				
			}
				

		}
		else if(game.localStatus == OponentTurn){
			fontFace.draw(g2,hog.util.TimeUtil.dhms(game.timeLeft()) + " LEFT",640,140,0.8,Center,Center);
			if(arenapit.currentAnimationName !="opponeturn"){
					arenapit.play("opponeturn");
				}
				fontFace.draw(g2,"OPPONENT TURN",640,300,1,Center,Center);
			fontFace.draw(g2,"YOU SENT ",470,366,0.7,Center,Center);
			fontFace.draw(g2,""+game.lastMove+"",510,410,1,Center,Center);
			//g2.drawSpriter(imageSheet, unitsindication,510, 440);

		}
		else if(game.localStatus == Done){
			fontFace.draw(g2,"YOU WIN",640,360,1,Center,Center);
		}
		else if(game.localStatus == YouLate){
			fontFace.draw(g2,"YOU LOSE",640,360,2,Center,Center);
			fontFace.draw(g2,"YOU WERE TOO LATE",640,460,1,Center,Center);
			g2.drawSpriter(imageSheet, quitZone,640,620);
		ScreenUtilities.onlyRect(g2, 650,560, 300, 120, quitRect , false,kha.Color.Red);


		}else if(game.localStatus == OponentLate){
			fontFace.draw(g2,"YOU WIN",640,360,2,Center,Center);
			fontFace.draw(g2,"OPPONENT TOO LATE",640,460,1,Center,Center);

		g2.drawSpriter(imageSheet, quitZone,640,620);
		ScreenUtilities.onlyRect(g2, 650,560, 300, 120, quitRect , false,kha.Color.Red);

		}
		

		//g2.drawMultiLineText(font, 30, game.localStatus,width/2, height/2,width, Center,Center);
			//fontFace.draw(g2,"" + game.lastMove+"",640,360,1,Center,Center);
			
/*
		if(readyForNext()){
			g2.color = Pico.Red;
			g2.fillRect(width/2 - s/2, height - s, s, s);
		}
		*/
		////////box limit
		g2.color = blip.color.Pico.DarkGrey;
		
			g2.fillRect(-5,0,35,720);
			g2.fillRect(1255,0,70,720);
////
		////////screen dimensionement///////////////////
		if(fWidth<fHeight) 
		{
			g2.popTransformation();
		}


		g2.popTransformation();
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
		///////////////////////

		g2.end();
	}
}