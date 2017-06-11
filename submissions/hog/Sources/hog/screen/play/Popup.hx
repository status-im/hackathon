package hog.screen.play;

import kha.Framebuffer;
import blip.color.Pico;
using hog.util.FontUtil;

import hog.data.HogGame;
import hog.data.GameState;
import hog.data.HogState;

class Popup implements PlayState extends BaseStateScreen{

	var text : String = "";

	public function new(hogState : HogState, game : HogGame){
		super(hogState, game);
	}

	public function enter(state : GameState){
		text = switch(state){
			case NoLocalData: "No Data found for the game, You need to use the same device where you started the game.";
			default: state + " Please Click to go back";
		}
		kha.input.Mouse.get(0).notify(down,null,null,null);
	}

	public function exit(){
		kha.input.Mouse.get(0).remove(down,null,null,null);
	}

	function down(button : Int, x : Float, y : Float){
		done = Back;
	}

	override public function update(elapsedTime : Float, dt : Float) : String{
		super.update(elapsedTime,dt);

		return done;
	}

	override public function render(elapsedTime : Float, framebuffer : Framebuffer){
		super.render(elapsedTime,framebuffer);
		var g2 = framebuffer.g2;

		g2.begin(true,Pico.White);
		g2.color = Pico.Black;

		//TODO
		width = framebuffer.width;
		height = framebuffer.height;

		g2.drawMultiLineText(font, 30, text,width/2, height/2,width, Center,Center);

		g2.end();
	}
}