package hog.screen;

@:enum
abstract Events(String) to(String){
	var Next = "Next";
	var Back = "Back";
	var PlayGame = "PlayGame";
	var NewGame = "NewGame";
	var Error = "Error";
}