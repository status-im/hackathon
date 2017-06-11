package hog.screen.play;

import kha.Framebuffer;
import blip.color.Pico;
using hog.util.FontUtil;


import hog.data.GameState;

import hog.data.HogGame;

import hog.screen.Events;
import hog.data.HogState;

import kha.Font;

class BaseStateScreen{

	var done : Events;

	var game : HogGame;
	var hogState : HogState;

	var width = 0;
	var height = 0;

	var font : Font;

	public function new(hogState : HogState, game : HogGame){
		this.hogState = hogState;
		this.game = game;

		font = kha.Assets.fonts.default_font;
	}

	public function update(elapsedTime : Float, dt : Float) : String{
		return done;
	}

	public function render(elapsedTime : Float, framebuffer : Framebuffer){
		
	}
}