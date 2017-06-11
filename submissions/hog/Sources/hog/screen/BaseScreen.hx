package hog.screen;

import blip.Shell;
import blip.Data;

import hog.data.HogState;

import kha.Assets;
import kha.Image;
import kha.Framebuffer;

import kfont.FontFace;
import kha.math.FastMatrix3;


class BaseScreen{

	// var backgroundImage : Image;
	var width : Float;
	var height : Float;
	var x : Float;
	var y : Float;
	var scale : Float;

	var hogState : HogState;
	var font : kha.Font;

	public function new(hogState : HogState){
		this.hogState = hogState;
	};


	public function onEnter(data : blip.Data) : Void{
		font = kha.Assets.fonts.default_font;
		// backgroundImage = Assets.images.background;
		// width = backgroundImage.width;
		// height = backgroundImage.height;
		width = 1280;
		height = 720;
	}

	function begin(framebuffer : Framebuffer) : kha.graphics2.Graphics{
		var frameWidth : Float = framebuffer.width;
		var frameHeight : Float  = framebuffer.height;

		
		x = 0;
		y = 0;

		var wRatio : Float = frameWidth / width;
		var hRatio : Float = frameHeight / height;
		scale = 1;
		if( wRatio > hRatio ){
			scale = hRatio;
			x = (frameWidth - width*hRatio ) / 2;
		}else{
			scale = wRatio;
			y = (frameHeight - height*wRatio) / 2;
		}
		
	
		var g2 = framebuffer.g2;
		g2.begin();

		g2.color = kha.Color.White;
	
	
		g2.pushTransformation(FastMatrix3.translation(x,y).multmat(FastMatrix3.scale(scale,scale)));

		
		
		return g2;
		
	}

	function end(g2 : kha.graphics2.Graphics){
		g2.popTransformation();
		g2.end();
	}

	
	public function onExit() : Void{
		
	}

	// function drawCenteredButton(g2 : kha.graphics2.Graphics, buttonText : String, rectCenterX : Float, rectCenterY : Float, button : Rect){
	// 	var textWidth = fontFace.draw(g2,buttonText,rectCenterX, rectCenterY,1, Center,Center);
	// 	var rectWidth = textWidth *1.4;
	// 	var rectHeight = fontFace.lineHeight *1.4;
	// 	g2.drawRect(rectCenterX - rectWidth/2, rectCenterY - rectHeight/2, rectWidth, rectHeight, 3);
	// 	button.x = rectCenterX - rectWidth/2;
	// 	button.y = rectCenterY - rectHeight/2;
	// 	button.width = rectWidth;
	// 	button.height = rectHeight;
	// }

	// function drawTriangleButton(g2 : kha.graphics2.Graphics, centerX : Float, centerY : Float, button : Rect, pointingRight : Bool){
	// 	var size = 20;
	// 	var x0 = centerX - size/2;
	// 	var x1 = centerX + size/2;
	// 	var y0 = centerY - size/2;
	// 	var y1 = centerY;
	// 	var y2 = centerY + size/2;

	// 	if(pointingRight){
	// 		g2.drawLine(x1,y0,x0,y1,3);
	// 		g2.drawLine(x0,y1,x1,y2,3);
	// 		g2.drawLine(x1,y2,x1,y0,3);
	// 	}else{
	// 		g2.drawLine(x0,y0,x1,y1,3);
	// 		g2.drawLine(x1,y1,x0,y2,3);
	// 		g2.drawLine(x0,y2,x0,y0,3);
	// 	}
		
		
	// 	button.x = x0;
	// 	button.y = y0;
	// 	button.width = x1 - x0;
	// 	button.height = y2 - y0;
	// }
}