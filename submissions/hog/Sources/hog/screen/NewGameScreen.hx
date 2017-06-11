package hog.screen;

import blip.Shell;
import blip.Data;
import kha.Framebuffer;
import blip.color.Pico;
using hog.util.FontUtil;

import hog.data.HogState;

class NewGameScreen extends BaseScreen implements Screen{
	var done : Events = null;

	public function new(hogState : HogState){
		super(hogState);
	}

	public function enter(data : Data){
		onEnter(data);
		done = null;
		kha.input.Mouse.get(0).notify(down,null,null,null);
	}
	public function exit(elapsedTime : Float){
		kha.input.Mouse.get(0).remove(down,null,null,null);
		onExit();
	}

	function down(button : Int, x : Float, y : Float){
		if(button == 0){
			//create game
			hogState.createGame(
				HogConfig.values.defaultSzaboInPlay
				,HogConfig.values.defaultPeriodInMinutes
				,HogConfig.values.defaultNumUnits
				,function(err, slot){}
				); 
		}
		done = Back;
	}

	public function update(elapsedTime : Float, dt : Float) : String{
		return done;
	}

	public function render(elapsedTime : Float, framebuffer : Framebuffer){
		var g2 = framebuffer.g2;

		var width = framebuffer.width;
		var height = framebuffer.height;

		g2.begin(true,Pico.White);
		g2.color = Pico.Black;

		//TODO
		width = framebuffer.width;
		height = framebuffer.height;

		g2.drawMultiLineText(font, 30, "NewGame",width/2, height/2,width, Center,Center);

		g2.end();
	}
}