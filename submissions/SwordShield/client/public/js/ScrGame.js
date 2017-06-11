var C_CREATE_USER = "4e832026";
var C_BATTLE = "aa5f4c08";
var C_CONFIRM = "56ca39b5";

var _heroes = ["", "minotaur", "lizard", "druid"];
var _offsetHeroes = [undefined, {x:42, y:-120}, {x:71, y:-86}, {x:44, y:-110}];
var _callback;
var _mouseX;
var _mouseY;
var _deploy;
var _curSkin = 0;
var _countAttackWin = 0;
var _countAttackMax = 0;
var _countDefenseWin = 0;
var _countDefenseMax = 0;
var _this;
var _arcade = true;
var _timeProtect = 3000;
var _initGame = false;
var _bolt;

function ScrGame() {
	PIXI.Container.call( this );
	this.init();
}

ScrGame.prototype = Object.create(PIXI.Container.prototype);
ScrGame.prototype.constructor = ScrGame;

ScrGame.prototype.init = function() {
	this.face_mc = new PIXI.Container();
	this.game_mc = new PIXI.Container();
	this.user_mc = new PIXI.Container();
	this.gfx_mc = new PIXI.Container();

	this.addChild(this.game_mc);
	this.addChild(this.gfx_mc);
	this.addChild(this.user_mc);
	this.addChild(this.face_mc);

	_this = this;

	this.bWindow = false;

	this._arButtons = [];
	_callback = this.response;

	var tfWait = addText("WAIT...", 50, "#000000", undefined, "center", 400)
	tfWait.x = _W/2;
	tfWait.y = 900 - tfWait.height/2;
	tfWait.visible = false;
	this.face_mc.addChild(tfWait);
	this.tfWait = tfWait;

	this.createHero();

	this.interactive = true;
	this.on('mousedown', this.touchHandler);
	this.on('mousemove', this.touchHandler);
	this.on('touchstart', this.touchHandler);
	this.on('touchmove', this.touchHandler);
	this.on('touchend', this.touchHandler);
}

ScrGame.prototype.createHero = function(){
	this.hero = new PIXI.Container();
	this.hero.x = _W/2;
	this.hero.y = _H/2 + 150;
	this.game_mc.addChild(this.hero);
	var shadow = new PIXI.Graphics();
	shadow.beginFill(0x000000)
	shadow.drawCircle(0, 0, 100);
	shadow.endFill();
	shadow.alpha = 0.3;
	shadow.scale.y = 0.5;
	shadow.visible = false;
	this.hero.addChild(shadow);
	this.shadow = shadow;

	var posY = 300;
	var str = "Select unit";
	var tfSelect = addText(str, 50, "#FFFFFF", "#000000", "center", 400, 4)
	tfSelect.x = _W/2;
	tfSelect.y = 150;
	this.user_mc.addChild(tfSelect);

	var icoMinotaur = addButton2("ico_minotaur", _W/2-200, posY);
	this.user_mc.addChild(icoMinotaur);
	this._arButtons.push(icoMinotaur);
	var icoLizard = addButton2("ico_lizard", _W/2, posY);
	this.user_mc.addChild(icoLizard);
	this._arButtons.push(icoLizard);
	var icoDruid = addButton2("ico_druid", _W/2+200, posY);
	this.user_mc.addChild(icoDruid);
	this._arButtons.push(icoDruid);
	var btnReady = addButton2("bntText", _W/2, 1000);
	btnReady.name = "btnReady";
	btnReady.visible = false;
	this.user_mc.addChild(btnReady);
	this._arButtons.push(btnReady);
	icoMinotaur.overSc = true;
	icoLizard.overSc = true;
	icoDruid.overSc = true;
	btnReady.overSc = true;

	var tfReady = addText("READY", 50, "#000000", undefined, "center", 150)
	tfReady.x = 0;
	tfReady.y = -tfReady.height/2;
	btnReady.addChild(tfReady);

	this.btnReady = btnReady;
	this.icoMinotaur = icoMinotaur;
	this.icoLizard = icoLizard;
	this.icoDruid = icoDruid;
}

ScrGame.prototype.createArt = function(){;
	var btnBattle = addButton2("btnAttack", _W/2, 1000);
	this.face_mc.addChild(btnBattle);
	this._arButtons.push(btnBattle);

	btnBattle.overSc = true;
	this.btnBattle = btnBattle;
}

ScrGame.prototype.createText = function(){
	var tfStatAttack = addText("Attack statistics", 35, "#ffffff", "#000000", "center", 100, 3)
	tfStatAttack.x = _W/2-150;
	tfStatAttack.y = 200;
	this.face_mc.addChild(tfStatAttack);
	var tfStatDefense = addText("Protection statistics", 35, "#ffffff", "#000000", "center", 100, 3)
	tfStatDefense.x = _W/2+150;
	tfStatDefense.y = 200;
	this.face_mc.addChild(tfStatDefense);
	var tfCountAttack = addText("0/0", 30, "#ffffff", "#000000", "center", 400, 3)
	tfCountAttack.x = _W/2-150;
	tfCountAttack.y = 300;
	this.face_mc.addChild(tfCountAttack);
	var tfPrcntAttack = addText("(0%)", 30, "#ffffff", "#000000", "center", 400, 3)
	tfPrcntAttack.x = _W/2-150;
	tfPrcntAttack.y = 350;
	this.face_mc.addChild(tfPrcntAttack);
	var tfCountDefense = addText("0/0", 30, "#ffffff", "#000000", "center", 400, 3)
	tfCountDefense.x = _W/2+150;
	tfCountDefense.y = 300;
	this.face_mc.addChild(tfCountDefense);
	var tfPrcntDefense = addText("(0%)", 30, "#ffffff", "#000000", "center", 400, 3)
	tfPrcntDefense.x = _W/2+150;
	tfPrcntDefense.y = 350;
	this.face_mc.addChild(tfPrcntDefense);

	this.tfCountAttack = tfCountAttack;
	this.tfPrcntAttack = tfPrcntAttack;
	this.tfCountDefense = tfCountDefense;
	this.tfPrcntDefense = tfPrcntDefense;
}

ScrGame.prototype.refreshStatAttack = function(){
	var strAttack = _countAttackWin + "/" + _countAttackMax;
	var prcntAttack = "("+Math.ceil((_countAttackWin/_countAttackMax)*100)+"%)";
	this.tfCountAttack.setText(strAttack);
	this.tfPrcntAttack.setText(prcntAttack);
}

ScrGame.prototype.refreshStatDefense = function(){
	var strDefense = _countDefenseWin + "/" + _countDefenseMax;
	var prcntDefense = "("+Math.ceil((_countDefenseWin/_countDefenseMax)*100)+"%)";
	this.tfCountDefense.setText(strDefense);
	this.tfPrcntDefense.setText(prcntDefense);
}

ScrGame.prototype.refreshSkin = function(value){
	if(_curSkin == value){
		return false;
	}
	_curSkin = value;
	var skin = this.hero.skin;
	if(skin){
		this.hero.removeChild(skin);
	}
	this.shadow.visible = true;
	this.btnReady.visible = true;
	var name = _heroes[value];
	var ofs = _offsetHeroes[value];
	var sc = 1.5;
	var skin = addObj(name, ofs.x*sc, ofs.y*sc, sc);
	skin.img.animationSpeed = 0.5;
	this.hero.addChild(skin);
	this.hero.skin = skin;
}

ScrGame.prototype.addRival = function(value){
	this.rival = new PIXI.Container();
	this.rival.x = _W/2 + 150;
	this.rival.y = _H/2 + 150;
	this.game_mc.addChild(this.rival);
	this.game_mc.addChild(this.hero);
	var shadow = new PIXI.Graphics();
	shadow.beginFill(0x000000)
	shadow.drawCircle(0, 0, 100);
	shadow.endFill();
	shadow.alpha = 0.3;
	shadow.scale.y = 0.5;
	this.rival.addChild(shadow);
	this.shadow = shadow;
	value += 1;
	if(value > 3){
		value = 1;
	}

	var name = _heroes[value];
	var ofs = _offsetHeroes[value];
	var sc = 1.5;
	var skin = addObj(name, 0, ofs.y*sc, sc);
	skin.x = -1*ofs.x*sc;
	skin.scale.x = -1*sc;
	skin.img.animationSpeed = 0.5;
	this.rival.addChild(skin);
	this.rival.skin = skin;
	
	if(_curSkin == 3 || value == 3){
		_bolt = addObj("bolt", 0, 0, 1);
		_bolt.img.animationSpeed = 0.5;
		this.game_mc.addChild(_bolt);
		if(_curSkin == 3){
			_bolt.x = this.rival.x;
			_bolt.y = this.rival.y;
		} else {
			_bolt.x = this.hero.x;
			_bolt.y = this.hero.y;
			this.rival.bolt = true;
		}
		_bolt.y -= 200;
		_bolt.visible = false;
	}
}

ScrGame.prototype.createUser = function(){
	console.log("createUser");
	this.user_mc.visible = false;
	this.tfWait.visible = true;
	_initGame = true;

	// Game.createUser( _curSkin, function(data){
		_this.tfWait.visible = false;
		_this.btnReady.visible = false;
		_this.createArt();
		_this.createText();
		_this.icoMinotaur.visible = false;
		_this.icoLizard.visible = false;
		_this.icoDruid.visible = false;
		_this.hero.x = _W/2-150;
		_this.addRival(_curSkin);
	// })
}

ScrGame.prototype.battle = function(){
	console.log("battle");
	this.btnBattle.alpha = 0.5;
	this.hero.skin.img.play();

	// Game.battle(_curSkin, function(data){
	// 	console.log(data)
	// })

	if(_arcade){
		_countAttackMax ++;
		if(Math.random() > 0.5){
			_countAttackWin ++;
		}
		this.refreshStatAttack();
	}
}

ScrGame.prototype.resetTimer = function(){
	// this.timeGetState = TIME_GET_STATE;
}

ScrGame.prototype.update = function(diffTime){
	if(options_pause){
		return false;
	}

	if(_bolt){
		if(_bolt.img.currentFrame >= _bolt.img.totalFrames-2){
			_bolt.visible = false;
			_bolt.img.gotoAndStop(1);
		}
	}
	
	if(this.hero){
		var skin = this.hero.skin;
		if(skin){
			if(skin.img.currentFrame >= skin.img.totalFrames-2){
				this.btnBattle.alpha = 1;
				skin.img.gotoAndStop(1);
				if(_bolt && _curSkin == 3){
					_bolt.visible = true;
					_bolt.img.play();
				}
			}
		}
	}

	if(this.rival){
		var skin2 = this.rival.skin;
		if(skin2){
			if(skin2.img.currentFrame >= skin2.img.totalFrames-2){
				skin2.img.gotoAndStop(1);
				if(_bolt && this.rival.bolt){
					_bolt.visible = true;
					_bolt.img.play();
				}
			}
		}

		if(_arcade && _initGame){
			_timeProtect -= diffTime;
			if(_timeProtect < 0){
				_timeProtect = 1000 + Math.random()*3000;
				_countDefenseMax ++;
				if(Math.random() > 0.5){
					_countDefenseWin ++;
				}
				this.rival.skin.img.play();
				this.refreshStatDefense();
			}
		}
	}
}

ScrGame.prototype.clickCell = function(item_mc) {
	var name = item_mc.name;
	if(item_mc.alpha != 1){
		return;
	}
	if(item_mc.name.search("btn") != -1){
		if(item_mc.over){
			item_mc.over.visible = false;
		}
	}
	if(item_mc.overSc){
		item_mc.scale.x = 1*item_mc.sc;
		item_mc.scale.y = 1*item_mc.sc;
	}

	if(item_mc.name == "btnReady"){
		this.createUser();
	} else if(item_mc.name == "btnAttack"){
		this.battle(_curSkin);
	} else if(item_mc.name == "ico_minotaur"){
		this.refreshSkin(1);
	} else if(item_mc.name == "ico_lizard"){
		this.refreshSkin(2);
	} else if(item_mc.name == "ico_druid"){
		this.refreshSkin(3);
	}
}

ScrGame.prototype.checkButtons = function(evt){
	_mouseX = evt.data.global.x;
	_mouseY = evt.data.global.y;

	for (var i = 0; i < this._arButtons.length; i++) {
		var item_mc = this._arButtons[i];
		if(hit_test_rec(item_mc, item_mc.w, item_mc.h, _mouseX, _mouseY) &&
		item_mc.visible && item_mc.dead != true){
			if(item_mc.disabled != true && item_mc.alpha == 1){
				if(item_mc._selected == false){
					item_mc._selected = true;
					if(item_mc.over){
						item_mc.over.visible = true;
					} else if(item_mc.overSc){
						item_mc.scale.x = 1.1*item_mc.sc;
						item_mc.scale.y = 1.1*item_mc.sc;
					}
				}
			}
		} else {
			if(item_mc._selected){
				item_mc._selected = false;
				if(item_mc.over){
					item_mc.over.visible = false;
				} else if(item_mc.overSc){
					item_mc.scale.x = 1*item_mc.sc;
					item_mc.scale.y = 1*item_mc.sc;
				}
			}
		}
	}
}

ScrGame.prototype.touchHandler = function(evt){
	if(this.bWindow){
		return false;
	}
	var phase = evt.type;

	if(phase=='mousemove' || phase == 'touchmove' || phase == 'touchstart'){
		this.checkButtons(evt);
	} else if (phase == 'mousedown' || phase == 'touchend') {
		for (var i = 0; i < this._arButtons.length; i++) {
			var item_mc = this._arButtons[i];
			if(item_mc._selected){
				this.clickCell(item_mc);
				return;
			}
		}
	}
}

ScrGame.prototype.removeAllListener = function(){
	this.interactive = false;
	this.off('mousedown', this.touchHandler);
	this.off('mousemove', this.touchHandler);
	this.off('touchstart', this.touchHandler);
	this.off('touchmove', this.touchHandler);
	this.off('touchend', this.touchHandler);
}
