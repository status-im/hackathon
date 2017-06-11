var _W = 720;
var _H = 1280;
var version = "v. 1.0.0";
var metaCode = "swordshield_v1";
var login_obj = {};
var dataAnima = [];
var dataMovie = [];
var openkey, privkey, mainet;
var currentScreen, scrContainer, LoadBack;
var ScreenMenu, ScreenGame;
var LoadPercent = null;
var startTime;
var renderer, stage, preloader; // pixi;

var sprites_loaded = false;
var fontMain = "Arial";
var stats;

// main
var addressContract = "";
// testrpc
var	addressRpcContract = "0x09720df949d447ed7669479786d4c7d19279bbb0";
// testnet
var	addressTestContract = "0x2bf355d0dc360e87a321599796b09e930bc3cf6f";

var options_mainet = false;
var options_testnet = false;
var options_rpc = false;
var options_music = true;
var options_sound = true;
var options_mobile = true;
var options_pause = false;
var options_fullscreen = false;


var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(callback) { return window.setTimeout(callback, 1000 / 60); };



function initGame() {
	if(window.orientation == undefined){
		options_mobile = false;
	} else {
		options_mobile = true;
	}

	if(typeof console === "undefined"){ console = {}; }

	if(options_rpc){
		addressContract = addressRpcContract;
	}else if(options_testnet){
		addressContract = addressTestContract;
	}

	// random BG
	var rndBg = Math.ceil(Math.random()*3);
	$('body').css({'background-image':'url("/images/bg/bgArena_'+rndBg+'.jpg")'})

    //initialize the stage
	renderer = PIXI.autoDetectRenderer(_W, _H,  {antialias: false, transparent: true, resolution: 1});
	// renderer = PIXI.autoDetectRenderer(_W, _H);

    stage = new PIXI.Container();
    document.body.appendChild(renderer.view);
    preloader = new PIXI.loaders.Loader();

    window.addEventListener("resize", onResize, false);

	startTime = getTimer();
    onResize();

    // update();
	var ticker = PIXI.ticker.shared;
	ticker.add(function (time) {
		renderer.render(stage);

		var diffTime = getTimer() - startTime;
		if(diffTime > 29){
			if (ScreenGame) {
				ScreenGame.update(diffTime);
			}

			startTime = getTimer();
		}

	});


	// // Set this to prevent starting this ticker when listeners are added.
	// // By default this is true only for the PIXI.ticker.shared instance.
	// ticker.autoStart = false;
	// // FYI, call this to ensure the ticker is stopped. It should be stopped
	// // if you have not attempted to render anything yet.
	// ticker.stop();
	// // Call this when you are ready for a running shared ticker.
	// ticker.start();


	LoadBack = new PIXI.Container();
	stage.addChild(LoadBack);
	scrContainer = new PIXI.Container();
	stage.addChild(scrContainer);

	var w = 400;
	LoadPercent = addText("Game loading", 30, "#FFFFFF", "#000000", "center", w, 2.5);
	LoadPercent.x = _W/2;
	LoadPercent.y = _H/2 + 120;
	LoadBack.addChild(LoadPercent);
	var tfVersion = addText(version, 16, "#000000", undefined, "right", 400)
	tfVersion.x = _W-20;
	tfVersion.y = _H-24;
	LoadBack.addChild(tfVersion);

	loadManifest();
}

function loadManifest(){
	preloader = new PIXI.loaders.Loader();

	preloader.add("bntText", "images/items/bntText.png");
	preloader.add("btnAttack", "images/items/btnAttack.png");
	preloader.add("btnDefense", "images/items/btnDefense.png");
	preloader.add("btnBattle", "images/items/btnBattle.png");
	preloader.add("btnSelect", "images/items/btnSelect.png");
	// preloader.add("druid", "images/items/druid.png");
	// preloader.add("lizard", "images/items/lizard.png");
	// preloader.add("minotaur", "images/items/minotaur.png");
	preloader.add("ico_druid", "images/items/ico_druid.png");
	preloader.add("ico_lizard", "images/items/ico_lizard.png");
	preloader.add("ico_minotaur", "images/items/ico_minotaur.png");

	preloader.add("images/texture/UnitsTexture.json");

	preloader.on("progress", handleProgress);
	preloader.load(handleComplete);
}

function spritesLoad() {
	if(sprites_loaded){
		return true;
	}
	sprites_loaded = true;

	var img, data;
}

function textureLoad() {
	iniSet("images/texture/UnitsTexture.json");
}

function iniSet(set_name) {
	var json = preloader.resources[set_name]
	if(json){}else{
		console.log("ERROR: " + set_name + " is undefined");
		return;
	}
	json = json.data;

	var jFrames = json.frames;
	var data = preloader.resources[set_name].textures;
	var dataTexture = [];
	var animOld = "";
	// console.log("set_name:", set_name);

	if(data && jFrames){
		for (var namePng in jFrames) {
			var index = namePng.indexOf(".png");
			var nameFrame = namePng;
			if (index > 1) {
				nameFrame = namePng.slice(0, index);
			}
			// console.log("nameFrame:", nameFrame, index2);

			var index2 = nameFrame.indexOf("/");
			if (index2 > 1) {
				var type = nameFrame.slice(0, index2); // тип анимации
				var anim = type; // имя сета
				if(anim != animOld){
					animOld = anim;
					dataTexture[anim] = [];
				}
				dataTexture[anim].push(PIXI.Texture.fromFrame(namePng));
				// console.log(nameFrame + ": ", anim, namePng);
			}
		}

		for (var name in dataTexture) {
			var arrayFrames = dataTexture[name]; // какие кадры используются в сети
			dataMovie[name] = arrayFrames;
			// console.log(name + ": ", arrayFrames);
			// console.log(name);
		}
	}
}

function iniSetArt(set_name) {
	var json = preloader.resources[set_name]
	if(json){}else{
		console.log("ERROR: " + set_name + " is undefined");
		return;
	}
	json = json.data;

	var frames = json.frames;
	var data = preloader.resources[set_name].textures;
	// console.log("set_name:", set_name);

	if(data && frames){
		for (var namePng in frames) {
			var index = namePng.indexOf(".png");
			var nameFrame = namePng;
			if (index > 1) {
				nameFrame = namePng.slice(0, index);
			}
			dataAnima[nameFrame] = data[namePng];
			// console.log("nameFrame:", nameFrame);
		}
	}
}

function handleProgress(){
	var percent = Math.ceil(preloader.progress)

	if(LoadPercent){
		LoadPercent.setText("Game loading: " + percent + "%");
	}
}

function handleComplete(evt) {
	loadData();
	spritesLoad();
	textureLoad();
    onResize();

	options_testnet = !options_mainet;
	if(options_rpc){
		version = version + " testrpc"
	} else if(options_testnet){
		version = version + " testnet"
	}

	start();
}

function getTimer(){
	var d = new Date();
	var n = d.getTime();
	return n;
}

function refreshTime(){
	startTime = getTimer();
}



function update() {
	raf(update);
	renderer.render(stage);
	if(options_pause){
		return;
	}
	var diffTime = getTimer() - startTime;
	if(diffTime > 29){
		if (ScreenGame) {
			ScreenGame.update(diffTime);
		}

		startTime = getTimer();
	}
}

function saveData() {
	if(isLocalStorageAvailable()){
		var login_str = JSON.stringify(login_obj);
		localStorage.setItem('daocasino_swordshield', login_str);
		localStorage.setItem('options_music', options_music);
		localStorage.setItem('options_sound', options_sound);
		// console.log("Saving: ok!");
	}
}

function loadData() {
	if(isLocalStorageAvailable()){
		if(options_rpc){
			openkey = "0xf1f42f995046e67b79dd5ebafd224ce964740da3";
			privkey = "d3b6b98613ce7bd4636c5c98cc17afb0403d690f9c2b646726e08334583de101";
		} else {
			// openkey = localStorage.getItem('openkey')
			// privkey = localStorage.getItem('privkey')
		}
		if (localStorage.getItem('daocasino_swordshield')){
			var login_str = localStorage.getItem('daocasino_swordshield')
			login_obj = JSON.parse(login_str);
			options_music = localStorage.getItem('options_music')=='true';
			options_sound = localStorage.getItem('options_sound')=='true';
			checkData();
			// console.log("Loading: ok!");
		} else {
			checkData();
			// console.log("Loading: fail!");
		}
	}
}

function checkData() {

}

function resetData() {
	login_obj = {};
	saveData();
}

function isLocalStorageAvailable() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
		console.log("localStorage_failed:",e);
        return false;
    }
}

function start() {
	if(LoadBack){
		stage.removeChild(LoadBack);
	}
	addScreen("game");
}

function showGame() {
	addScreen("game");
}

function removeAllScreens() {
	if(ScreenGame){
		scrContainer.removeChild(ScreenGame);
		ScreenGame = null;
	}
	if(currentScreen){
		scrContainer.removeChild(currentScreen);
		currentScreen = null;
	}
}

function addScreen(name) {
	removeAllScreens();

	if(name == "game"){
		ScreenGame = new ScrGame();
		scrContainer.addChild(ScreenGame);
		currentScreen = ScreenGame;
	}
	currentScreen.name = name;
}

function addButton(name, _x, _y, _scGr, _scaleX, _scaleY) {
	if(_x){}else{_x = 0};
	if(_y){}else{_y = 0};
	if(_scGr){}else{_scGr = 1};
	if(_scaleX){}else{_scaleX = 1};
	if(_scaleY){}else{_scaleY = 1};
	var obj = new PIXI.Container();

	var objImg = null;
	obj.setImg = function(name){
		objImg = addObj(name);
		obj.addChild(objImg);
		obj.over = addObj(name + "Over");
		if(obj.over){
			obj.over.visible = false;
			obj.addChild(obj.over);
		} else {
			obj.over = null;
		}
		obj.lock = addObj(name + "Lock");
		if(obj.lock){
			obj.lock.visible = false;
			obj.addChild(obj.lock);
		} else {
			obj.lock = null;
		}

		obj.sc = _scGr;
		obj.scale.x = _scGr*_scaleX;
		obj.scale.y = _scGr*_scaleY;
		obj.vX = _scaleX;
		obj.vY = _scaleY;
		obj.x = _x;
		obj.y = _y;
		obj.w = objImg.width*_scGr;
		obj.h = objImg.height*_scGr;
		obj.r = obj.w/2;
		obj.rr = obj.r*obj.r;
		obj.name = name;
		obj._selected = false;
		if(obj.w < 50){
			obj.w = 50;
		}
		if(obj.h < 50){
			obj.h = 50;
		}
	}

	obj.setImg(name);

	return obj;
}

function addButton2(name, _x, _y, _scGr, _scaleX, _scaleY) {
	if(_x){}else{_x = 0};
	if(_y){}else{_y = 0};
	if(_scGr){}else{_scGr = 1};
	if(_scaleX){}else{_scaleX = 1};
	if(_scaleY){}else{_scaleY = 1};
	var obj = new PIXI.Container();

	var data = preloader.resources[name];
	var objImg = null;
	if(data){
		objImg = new PIXI.Sprite(data.texture);
		objImg.anchor.x = 0.5;
		objImg.anchor.y = 0.5;
		obj.addChild(objImg);
	} else {
		return null;
	}

	data = preloader.resources[name + "Over"];
	if(data){
		obj.over = new PIXI.Sprite(data.texture);
		obj.over.anchor.x = 0.5;
		obj.over.anchor.y = 0.5;
		obj.over.visible = false;
		obj.addChild(obj.over);
	} else {
		obj.over = null;
	}

	data = preloader.resources[name + "Lock"];
	if(data){
		obj.lock = new PIXI.Sprite(data.texture);
		obj.lock.anchor.x = 0.5;
		obj.lock.anchor.y = 0.5;
		obj.lock.visible = false;
		obj.addChild(obj.lock);
	} else {
		obj.lock = null;
	}
	obj.sc = _scGr;
	obj.scale.x = _scGr*_scaleX;
	obj.scale.y = _scGr*_scaleY;
	obj.vX = _scaleX;
	obj.vY = _scaleY;
	obj.x = _x;
	obj.y = _y;
	obj.w = objImg.width*_scGr;
	obj.h = objImg.height*_scGr;
	obj.r = obj.w/2;
	obj.rr = obj.r*obj.r;
	obj.name = name;
	obj._selected = false;
	if(obj.w < 50){
		obj.w = 50;
	}
	if(obj.h < 50){
		obj.h = 50;
	}

	return obj;
}

function addObj(name, _x, _y, _scGr, _scaleX, _scaleY, _anchor) {
	if(_x){}else{_x = 0};
	if(_y){}else{_y = 0};
	if(_scGr){}else{_scGr = 1};
	if(_scaleX){}else{_scaleX = 1};
	if(_scaleY){}else{_scaleY = 1};
	if(_anchor){}else{_anchor = 0.5};
	var obj = new PIXI.Container();
	obj.scale.x = _scGr*_scaleX;
	obj.scale.y = _scGr*_scaleY;

	var objImg = null;
	if(dataAnima[name]){
		objImg = new PIXI.Sprite(dataAnima[name]);
	} else if(dataMovie[name]){
		objImg = new PIXI.extras.MovieClip(dataMovie[name]);
		objImg.stop();
	}else{
		var data = preloader.resources[name];
		if(data){
			objImg = new PIXI.Sprite(data.texture);
		} else {
			return null;
		}
	}
	obj.sc = _scGr;
	objImg.anchor.x = _anchor;
	objImg.anchor.y = _anchor;
	obj.w = objImg.width*obj.scale.x;
	obj.h = objImg.height*obj.scale.y;
	obj.addChild(objImg);
	obj.x = _x;
	obj.y = _y;
	obj.name = name;
	obj.img = objImg;
	obj.r = obj.w/2;
	obj.rr = obj.r*obj.r;
    //установим точку регистрации в 0 0
    obj.setReg0 = function () {
        objImg.anchor.x = 0;
        objImg.anchor.y = 0;
    }
    obj.setRegX = function (procx) {
        objImg.anchor.x = procx;
    }
    obj.setRegY = function (procy) {
        objImg.anchor.y = procy;
    }

	return obj;
}

function addText(str, size, color, glow, _align, width, px, font){
	if(size){}else{size = 24};
	if(color){}else{color = "#FFFFFF"};
	if(glow){}else{glow = undefined};
	if(_align){}else{_align = "center"};
	if(width){}else{width = 600};
	if(px){}else{px = 2};
	if(font){}else{font = fontMain};

	var style;

	if(glow){
		style = {
			font : size + "px " + font,
			fill : color,
			align : _align,
			stroke : glow,
			strokeThickness : px,
			wordWrap : true,
			wordWrapWidth : width
		};
	} else {
		style = {
			font : size + "px " + font,
			fill : color,
			align : _align,
			wordWrap : true,
			wordWrapWidth : width
		};
	}

	var obj = new PIXI.Container();

	var tfMain = new PIXI.Text(str, style);
	tfMain.y = 0;
	obj.addChild(tfMain);
	if(_align == "left"){
		tfMain.x = 0;
	} else if(_align == "right"){
		tfMain.x = -tfMain.width;
	} else {
		tfMain.x = - tfMain.width/2;
	}

	obj.width = Math.ceil(tfMain.width);
	obj.height = Math.ceil(tfMain.height);

	obj.setText = function(value){
		tfMain.text = value;
		if(_align == "left"){
			tfMain.x = 0;
		} else if(_align == "right"){
			tfMain.x = -tfMain.width;
		} else {
			tfMain.x = - tfMain.width/2;
		}
	}

	obj.getText = function(){
		return tfMain.text;
	}

	return obj;
}

// standart method
function hit_test_rec(mc, w, h, tx, ty) {
	if(tx>mc.x-w/2 && tx<mc.x+w/2){
		if(ty>mc.y-h/2 && ty<mc.y+h/2){
			return true;
		}
	}
	return false;
}

function visGame() {
	//play
	options_pause = false;
	refreshTime();

	if(currentScreen){
		if(ScreenGame){
			ScreenGame.resetTimer();
		}
	}
}

function hideGame() {
	//pause
	options_pause = true;
	// music_stop();
	refreshTime();
}

visibly.onVisible(visGame)
visibly.onHidden(hideGame)

document.addEventListener('DOMContentLoaded', initGame)
