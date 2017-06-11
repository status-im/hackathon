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
class YourTurn implements PlayState extends BaseStateScreen{

	var sendUnitsRect : RectPoly = new RectPoly(0,0,0,0);
	var sendUnitsState:Bool=false;
	var sendUnitsDown:Bool=false;

	var returnHomeRect : RectPoly = new RectPoly(0,0,0,0);
	var returnHomeState:Bool=false;
	var returnHomeDown:Bool=false;

	var quitRect : RectPoly = new RectPoly(0,0,0,0);
	var quitState:Bool=false;
	var quitDown:Bool=false;

var arrowLeftRect : RectPoly = new RectPoly(0,0,0,0);
	var arrowLeftState:Bool=false;
	var arrowLeftDown:Bool=false;

	var arrowRightRect : RectPoly = new RectPoly(0,0,0,0);
	var arrowRightState:Bool=false;
	var arrowRightDown:Bool=false;

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

	var fort:EntityInstance;
	var hudSendUnits:EntityInstance;
	var hudUnits:EntityInstance;

	var hudscore:EntityInstance;
	var returnHome:EntityInstance;
	var panArray:Array<Units>;
	var gothog:Array<EntityInstance>;
	var unitsindication:EntityInstance;
	var quitZone:EntityInstance;

	var arrowleft:EntityInstance;
	var arrowright:EntityInstance;

	var rotate:Bool=false;

	var blockyLeft:EntityInstance;
var blockyRight:EntityInstance;

	public function new(hogState : HogState, game : HogGame){
		super(hogState, game);
		//gothog=new Array();
		gothog=[];
		panArray=[];
	}

	public function enter(state : GameState){
		moving = false;
		imageSheet = ImageSheet.fromTexturePackerJsonArray(kha.Assets.blobs.testtex01_json.toString());
		fontFace = FontFace.fromStandardFixedSizeTiles(kha.Assets.images.prefont,35,37,38,37);

		fort=HogLoadingScreen.pixities["fortress"];
		fort.play("idle");
		hudscore=HogLoadingScreen.pixities["hudscore"];
		hudscore.play("back");
		hudSendUnits=HogLoadingScreen.spriter.createEntity("hudraw");
		hudSendUnits.play("new");
		returnHome=HogLoadingScreen.spriter.createEntity("hudraw");
		returnHome.play("returnhome");
		quitZone=HogLoadingScreen.spriter.createEntity("hudraw");
		quitZone.play("quitx2");

		unitsindication=HogLoadingScreen.spriter.createEntity("panther");
		unitsindication.play("idle");

		hudUnits=HogLoadingScreen.pixities["hudraw"];
		hudUnits.play("games");
arrowleft=HogLoadingScreen.pixities["arrowleft"];
		arrowright=HogLoadingScreen.pixities["arrowright"];
		blockyLeft=HogLoadingScreen.spriter.createEntity("hudraw");
		blockyLeft.play("blocky");

		blockyRight=HogLoadingScreen.spriter.createEntity("hudraw");
		blockyRight.play("blocky");


		for(i in 0 ...numUnitsChosen)
		{
			panArray.push(new Units("choose",2,0,200+Math.random()*50,700,"panther","walkright",0,300,0,800,0,20,10));
		}
		for(i in 0 ...6)
		{
			gothog.push(HogLoadingScreen.spriter.createEntity("huddarkerbone"));

		}

		kha.input.Mouse.get(0).notify(down,up,null,null);

		returnHomeDown=false;
sendUnitsDown=false;
quitDown=false;
	}

	public function exit(){
		panArray=[];
		gothog=[];

		returnHomeDown=false;
sendUnitsDown=false;
quitDown=false;
		kha.input.Mouse.get(0).remove(down,up,null,null);
	}

	var lastDownX = -1.0;
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

if(arrowLeftRect.InPoly(x,y) )
		{
			arrowLeftDown=true;
		}
		else if(arrowRightRect.InPoly(x,y) )
		{
			arrowRightDown=true;
		}

		if(returnHomeRect.InPoly(x,y) && returnHomeDown==false)
		{
			returnHomeDown=true;
			//returnHomeState=true;
		}
				lastDownX = x;
		if( moveAllowed() && !moving && sendUnitsRect.InPoly(x,y) && sendUnitsDown==false && game.localStatus == YourTurn)
		{
			sendUnitsDown=true;
		}	

if(quitRect.InPoly(x,y) && quitDown==false)
		{
			quitDown=true;
			//returnHomeState=true;
		}

		/*if( moveAllowed() && !moving && x > width - s - 50 && x < width - 50 && y > height/2 - s/2 && y < height/2 - s/2 + s ){
			hogState.move(game.id, numUnitsChosen);
			moving = true;
		}*/
	}

	function moveAllowed() : Bool{
		return (game.numUnits == 0 || numUnitsChosen > 0);
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

		


		if( moveAllowed() && !moving && sendUnitsRect.InPoly(x,y) && sendUnitsDown==true && game.localStatus == YourTurn)
		{
			
			hogState.move(game.id, numUnitsChosen);
			//done=Back;
			moving = true;
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
			//returnHomeState=true;
			done=Back;
		}

		

	if(arrowLeftRect.InPoly(x,y) && arrowLeftDown==true && numUnitsChosen > 0)
		{
			
			numUnitsChosen --;
				panArray.pop();

		}
		else if(arrowRightRect.InPoly(x,y) && arrowRightDown==true  && numUnitsChosen < game.numUnits)
		{
			
			//arrowRightState=true;
			numUnitsChosen ++;
				panArray.push(new Units("choose",2,0,240,700,"panther","walkright",0,300,0,800,0,20,10));
		}
		else if(lastDownX > 0){
			if(x - lastDownX > 20 && numUnitsChosen < game.numUnits){
				numUnitsChosen ++;
				panArray.push(new Units("choose",2,0,240,700,"panther","walkright",0,300,0,800,0,20,10));
			}
			if(x - lastDownX < -20 && numUnitsChosen > 0){
				numUnitsChosen --;
				panArray.pop();
			}
		}

		arrowLeftDown=false;
		arrowRightDown=false;
		returnHomeDown=false;
		sendUnitsDown=false;
		quitDown=false;
		
	}

	override public function update(elapsedTime : Float, dt : Float) : String{
		super.update(elapsedTime,dt);
		fort.step(dt);
		hudscore.step(dt);
		hudSendUnits.step(dt);
		hudUnits.step(dt);
		returnHome.step(dt);
		unitsindication.step(dt);
		quitZone.step(dt);
		arrowleft.step(dt);
			arrowright.step(dt);
		blockyLeft.step(dt);
		blockyRight.step(dt);


		for(i in 0 ...6)
		{
			gothog[i].step(dt);
		}

		for(i in 0 ...panArray.length)
		{
			panArray[i].update(elapsedTime , dt );
		}

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

		g2.drawSpriter(imageSheet, fort,640,720);


if(game.localStatus == YourTurn){
			g2.drawSpriter(imageSheet, hudUnits,640,430);
		fontFace.draw(g2,"PICK YOUR",640,300,1,Center,Center);
		fontFace.draw(g2,"UNITS",640,350,1,Center,Center);
		fontFace.draw(g2,""+numUnitsChosen+"",640, 400,1,Center,Center);
		g2.drawSpriter(imageSheet, unitsindication,770, 410);
		g2.drawSpriter(imageSheet, hudSendUnits,1140,550);
		fontFace.draw(g2,"SEND",1130,480,1,Center,Center);
		fontFace.draw(g2,"UNITS",1130,520,1,Center,Center);
		ScreenUtilities.onlyRect(g2, 1130,500, 280, 100, sendUnitsRect , false,kha.Color.Red);	
		g2.drawSpriter(imageSheet,arrowright,400,340);
		ScreenUtilities.onlyRect(g2,380,330, 80, 120, arrowLeftRect , true);
		g2.drawSpriter(imageSheet,arrowleft,900,340);
		ScreenUtilities.onlyRect(g2,900,330, 80, 120, arrowRightRect , true);

		}
		else if(game.localStatus == OponentFirstMove){
			g2.drawSpriter(imageSheet, hudUnits,640,430);
				fontFace.draw(g2,"ENEMY",640,300,1,Center,Center);
				fontFace.draw(g2,"BUILDING",640,350,1,Center,Center);
			fontFace.draw(g2,"FORTRESS",640, 400,1,Center,Center);
		//g2.drawSpriter(imageSheet, unitsindication,770, 410);
		sendUnitsDown=false;

		}
		else if(game.localStatus == SendingUnits){
				g2.drawSpriter(imageSheet, hudUnits,640,430);
				fontFace.draw(g2,"MOVING TO",640,300,1,Center,Center);
				fontFace.draw(g2,"ARENA",640,350,1,Center,Center);
			fontFace.draw(g2,""+numUnitsChosen+"",640, 400,1,Center,Center);
		g2.drawSpriter(imageSheet, unitsindication,770, 410);

		sendUnitsDown=false;
		
		if(panArray.length==0)
		{
			panArray.push(new Units("sending",2,0,240,700,"panther","walkright",0,300,0,800,0,20,10));
		}
		else if( panArray[panArray.length-1].scheme!="sending" )
		{panArray[panArray.length-1].sending();}

		}else if(game.localStatus == NoLocalData){
			fontFace.draw(g2,"NO LOCAL DATA FOUND",640,360,1,Center,Center);
			g2.drawSpriter(imageSheet, quitZone,640,570);
		ScreenUtilities.onlyRect(g2, 640,510, 300, 120, quitRect , false,kha.Color.Red);
		}
		else if(game.localStatus == NobodyJoined){
			fontFace.draw(g2,"NOBODY JOINED YOUR GAME",640,360,1,Center,Center);

			g2.drawSpriter(imageSheet, quitZone,640,570);
		ScreenUtilities.onlyRect(g2, 640,510, 300, 120, quitRect , false,kha.Color.Red);
		}
		

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
fontFace.draw(g2,hog.util.TimeUtil.dhms(game.timeLeft()) + " LEFT",640,140,0.8,Center,Center);

/////////
				g2.drawSpriter(imageSheet,blockyLeft,220, 270);
				var blockyScale =2;

					var blockyL = HogBlocky.get(hogState.registeredAddress);
					blockyL.draw(g2,216, 210,blockyScale, Center,Center);


					g2.drawSpriter(imageSheet,blockyRight,1060, 270);
					var blockyScale =2;
					var blockyR = HogBlocky.get( new Address(game.contractState.otherPlayer) );
					blockyR.draw(g2,1056, 210,blockyScale, Center,Center);

/////////

		for(i in 0 ...panArray.length)
		{
			g2.drawSpriter(imageSheet, panArray[i].units,panArray[i].startx+panArray[i].x,panArray[i].starty+panArray[i].y);
			if(panArray[i].x>1280)
			{
				panArray.remove(panArray[i]);
				break;
			}
		}



		g2.color = Pico.Red;
		g2.drawText(font, 30, "X",width, 0,Right,Top);

		g2.color = Pico.White;

		g2.color = Pico.LightGreen;
		fontFace.draw(g2,""+ game.numUnits+"",215, 205,1,Center,Center);
		g2.drawSpriter(imageSheet, unitsindication,120, 250);
		g2.color = Pico.Red;
		fontFace.draw(g2,""+ game.oponentNumUnits+"",1060, 205,1,Center,Center);
		g2.drawSpriter(imageSheet, unitsindication,1150, 250);
		g2.color = Pico.White;
		//fontFace.draw(g2,""+ game.position+"",width/2, 80,1,Center,Center);
		




		//g2.drawText(font, 30, "" + game.numUnits+"",width/4, 0,Center,Top);
		//g2.drawText(font, 30, "" + game.position,width/2, 0,Center,Top);
		//g2.drawText(font, 30, "" + game.oponentNumUnits,width* 3/4, 0,Center,Top);

		//g2.drawText(font, 30, "" + numUnitsChosen,width/2, 80,Center,Top);

	/*	if(moveAllowed()){
			g2.color = Pico.LightGreen;
			g2.fillRect(width - s - 50, height/2 - s/2, s, s);
		}*/
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