package hog.screen;

import haxe.ds.Vector;
import kha.Color;

import web3.Web3;


enum VAlign{
	Top;
	Center;
	Bottom;
}

enum HAlign{
	Left;
	Center;
	Right;
}

class HogBlocky{

	public var imageData(default,null) : Array<Int>;
	public var color(default,null) : Color;
	public var bgcolor(default,null) : Color;
	public var spotcolor(default,null) : Color;
	public var scale(default,null) : Int;
	public var size(default,null) : Int;

	static var blockiesCache : Map<Address,HogBlocky> = new Map();
	static public function get(address : Address) : HogBlocky{
		if(!blockiesCache.exists(address)){
			blockiesCache[address] = new HogBlocky(address, 6);
		}
		return blockiesCache[address];
	}

	private function new(address : String, scale : UInt = 4) {
		this.scale = scale;
		this.size = 8;		
		// if(address == null || address == ""){
		// 	address =  Math.floor((Math.random()*Math.pow(10,16))).toString(16);
		// }

		seedrand(address);

		color = createColor();
		bgcolor = createColor();
		spotcolor = createColor();
		imageData = createImageData(size);
		// var canvas = createCanvas(imageData, color, scale, bgcolor, spotcolor);
	}

	public function draw(g2 : kha.graphics2.Graphics, x : Float, y : Float, furtherScale : Float, halign : HAlign, valign : VAlign){
		var oldColor = g2.color;
		g2.color = bgcolor;
		var appliedScale = scale * furtherScale;
		var appliedSize = size * appliedScale;  
	
		switch(halign){
			case Left: 
			case Center: x -= appliedSize/2;
			case Right: x -= appliedSize;
		}
		switch(valign){
			case Top: 
			case Center: y-= appliedSize/2;
			case Bottom: y-= appliedSize;
		}

		g2.fillRect(x, y, appliedSize, appliedSize);
		for(i in 0...imageData.length){
			var row : Int = Math.floor(i / size);
			var col : Int = i % size;
			// if data is 2, choose spot color, if 1 choose foreground
			g2.color = (imageData[i] == 1) ? color : spotcolor;

			// if data is 0, leave the background
			if(imageData[i] != 0) {
				g2.fillRect(x + col * appliedScale, y + row * appliedScale, appliedScale, appliedScale);
			}
		}
		g2.color = oldColor;
	}

	function seedrand(seed : String) : Void {
		randseed = new Vector(4);
		for (i in 0...randseed.length) {
			randseed[i] = 0;
		}
		for (i in 0...seed.length) {
			randseed[i%4] = ((randseed[i%4] << 5) - randseed[i%4]) + seed.charCodeAt(i);
		}
	}

	function rand() : Float {
		// based on Java's String.hashCode(), expanded to 4 32bit values
		var t = randseed[0] ^ (randseed[0] << 11);

		randseed[0] = randseed[1];
		randseed[1] = randseed[2];
		randseed[2] = randseed[3];
		randseed[3] = (randseed[3] ^ (randseed[3] >> 19) ^ t ^ (t >> 8));

		return (randseed[3]>>>0) / untyped __js__("((1 << 31)>>>0)");
	}

	function createColor() : kha.Color {
		// //saturation is the whole color spectrum
		// var h = Math.floor(rand() * 360);
		// //saturation goes from 40 to 100, it avoids greyish colors
		// var s = ((rand() * 60) + 40) + '%';
		// //lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
		// var l = ((rand()+rand()+rand()+rand()) * 25) + '%';

		// var color = 'hsl(' + h + ',' + s + ',' + l + ')';

		//saturation is the whole color spectrum
		var h : Float = rand();
		//saturation goes from 40 to 100, it avoids greyish colors
		var s : Float = ((rand() * 60) + 40) / 100;
		//lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
		var l : Float = ((rand()+rand()+rand()+rand()) * 25) / 100;
		
		
		var r : Float = 0;
		var g : Float = 0;
		var b : Float = 0;

		if(s == 0){
			r = g = b = l; // achromatic
		}else{
			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}

		return Color.fromFloats(r,g,b);
	}

	function hue2rgb(p : Float, q : Float, t : Float) : Float{
		if(t < 0) t += 1;
		if(t > 1) t -= 1;
		if(t < 1/6) return p + (q - p) * 6 * t;
		if(t < 1/2) return q;
		if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
		return p;
	}


	function createImageData(size) {
		var width = size; // Only support square icons for now
		var height = size;

		var dataWidth = Math.ceil(width / 2);
		var mirrorWidth = width - dataWidth;

		var data = [];
		for(y in 0...height) {
			var row = [];
			for(x in 0...dataWidth) {
				// this makes foreground and background color to have a 43% (1/2.3) probability
				// spot color has 13% chance
				row[x] = Math.floor(rand()*2.3);
			}
			var r = row.slice(0, mirrorWidth);
			r.reverse();
			row = row.concat(r);

			for(i in 0...row.length) {
				data.push(row[i]);
			}
		}

		return data;
	}

	// function createCanvas(imageData, color, scale, bgcolor, spotcolor) {
	// 	var c = document.createElement('canvas');
	// 	var width = Math.sqrt(imageData.length);
	// 	c.width = c.height = width * scale;

	// 	var cc = c.getContext('2d');
	// 	cc.fillStyle = bgcolor;
	// 	cc.fillRect(0, 0, c.width, c.height);
	// 	cc.fillStyle = color;

	// 	for(var i = 0; i < imageData.length; i++) {
	// 		var row = Math.floor(i / width);
	// 		var col = i % width;
	// 		// if data is 2, choose spot color, if 1 choose foreground
	// 		cc.fillStyle = (imageData[i] == 1) ? color : spotcolor;

	// 		// if data is 0, leave the background
	// 		if(imageData[i]) {
	// 			cc.fillRect(col * scale, row * scale, scale, scale);
	// 		}
	// 	}

	// 	return c;
	// }

	var randseed : Vector<Int>;
	
}