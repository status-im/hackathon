package hog.screen.play;

import kha.Framebuffer;

import hog.data.GameState;

interface PlayState{
	public function enter(state : GameState) : Void;
	public function exit() : Void;

	public function update(elapsedTime : Float, dt : Float) : String;
	public function render(elapsedTime : Float, framebuffer : Framebuffer) : Void;
}