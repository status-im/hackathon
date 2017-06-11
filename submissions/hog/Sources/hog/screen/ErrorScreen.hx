package hog.screen;

import blip.Shell;
import blip.Data;
import kha.Framebuffer;
import blip.color.Pico;
using hog.util.FontUtil;

import hog.data.HogState;

import kha.math.FastMatrix3;

class ErrorScreen extends BaseScreen implements Screen{
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
		hogState.lastError = null;
		done = Back;
	}

	public function update(elapsedTime : Float, dt : Float) : String{
		return done;
	}

	public function render(elapsedTime : Float, framebuffer : Framebuffer){
		var g2 = framebuffer.g2;

		var width = framebuffer.width;
		var height = framebuffer.height;

		g2.begin(true,Pico.Black);
		g2.color = Pico.Red;

		if(width < height){
			g2.pushTransformation(g2.transformation.multmat(FastMatrix3.translation(width/2, height/2).multmat(FastMatrix3.rotation(Math.PI/2).multmat(FastMatrix3.translation(-width/2, -height/2)))));
		}
		

		g2.drawMultiLineText(font, 12, hogState.lastError ,width/2, height/2,width, Center,Center);

		if(width < height){
			g2.popTransformation();
		}


		g2.end();
	}
}