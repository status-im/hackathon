package hog.screen;

import blip.Shell;
import blip.Data;
import kha.Framebuffer;
import blip.Input;
import kha.Color;
import blip.AudioBox;
import kha.Assets;
import spriter.Spriter;
import spriter.EntityInstance;

import imagesheet.ImageSheet;

import spriterkha.SpriterG2;

import hog.HogAssetLoader;

typedef LoadingScreenParams = {
	?minTime : Float,
	?foregroundColor : Color,
	?backgroundColor : Color,
	?onLoaded : Void -> Void
}
@:access(spriter)
class  HogLoadingScreen implements Screen{
	public static var pixities : Map<String, EntityInstance>;
	var done : Bool;
	var _minTime : Float;
	
	var foregroundColor : Color;
	var backgroundColor : Color;
	var onLoaded : Void -> Void;
	var imageSheet : ImageSheet;
	public static var spriter: Spriter;
	
	public function new(?params : LoadingScreenParams){
		_minTime = params != null && params.minTime != null ? params.minTime : 0.5;
		this.foregroundColor = params != null && params.foregroundColor != null ? params.foregroundColor : 0xffffffff;
		this.backgroundColor = params != null && params.backgroundColor != null ? params.backgroundColor : 0xff000000;
		this.onLoaded = params != null ? params.onLoaded : null;
	}
	
	
	public function enter(data : Data){
		done = false;
		pixities = new Map();
		HogAssetLoader.loadEverything(everythingIsLoaded);
	}
	
	function everythingIsLoaded(){
		if(onLoaded != null){
			onLoaded();
		}
		imageSheet = ImageSheet.fromTexturePackerJsonArray(Assets.blobs.testtex01_json.toString());
		spriter = Spriter.parseScml(Assets.blobs.testtex01_scml.toString());

		for( entities in spriter.entities)
		{
			pixities.set(entities.name,spriter.createEntity(entities.name));
			// trace(entities.name);
		}

		pixities.set("hudrequest",spriter.createEntity("hudraw"));
		pixities.set("hudhome",spriter.createEntity("hudraw"));
		pixities.set("hudgames",spriter.createEntity("hudraw"));
		pixities.set("hudnew",spriter.createEntity("hudraw"));

		pixities.set("gamecentral",spriter.createEntity("hudgame"));
		pixities.set("gameleft",spriter.createEntity("hudtruc"));
		pixities.set("gameright",spriter.createEntity("hudtruc"));

		pixities.set("arrowleft",spriter.createEntity("arrowleft"));
		pixities.set("arrowright",spriter.createEntity("arrowright"));
		//pixities.set("arena",spriter.createEntity("arena"));
		//pixities.set("arinniti",spriter.createEntity("arinniti"));
		//trace(spriter.folders[0].id);	
		//pixities.push(spriter.createEntity("arena"));
		done = true;
	}
	
	
	public function exit(elapsedTime : Float) : Void{
		
	}
	
	public function update(elapsedTime : Float, dt : Float) : String{
		return done && elapsedTime > _minTime ? "Next" : null;
	}
	
	public function render(elapsedTime : Float, framebuffer : Framebuffer){
		
		var g2 = framebuffer.g2;
		
		var w = framebuffer.width;
		var h = framebuffer.height;
		var s = Math.min(h,w)/4;
		
		g2.begin(true,backgroundColor);
		g2.color = foregroundColor;
		
		
		g2.pushRotation(elapsedTime* 10,w/2,h/2);
		g2.drawRect(w/2 - s/2,h/2 -s/2, s, s,3);
		g2.popTransformation();
		
		g2.end();
	}
	
	
}