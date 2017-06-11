package hog.screen.play;

import kha.Framebuffer;
import blip.color.Pico;
using hog.util.FontUtil;

import hog.data.HogGame;
import hog.data.GameState;
import hog.data.HogState;


import kfont.FontFace;
import kha.math.FastMatrix4;
import kha.math.FastMatrix3;
import kha.math.FastVector4;
import kha.math.FastVector3;
import kha.math.FastVector2;
import mathtool.RectPoly;


import spriter.Spriter;
import spriter.EntityInstance;
import blip.AudioBox;
//import spriterkha.SpriterG2;
using spriterkha.SpriterG2;
import imagesheet.ImageSheet;

@:access(spriter)
class Units
{
	public static var countstring:Int=0;
	public var timerbegin:Float;
	public var scheme:String;
	public var anim:String;
	public var sprite:String;
	public var units:EntityInstance;

	public var startx:Float;
	public var starty:Float;
	public var endloopx:Float;
	public var endloopy:Float;
	public var startloopx:Float;
	public var startloopy:Float;
	public var x:Float=0;
	public var y:Float=0;
	public var dx:Float;
	public var dy:Float;
	public var vdx:Float=0;
	public var vdy:Float=0;
	public var fxeffect:Bool=false;

	public function new(scheme:String,dx:Float,dy:Float,startx:Float,starty:Float,sprite:String,anim:String,timerbegin:Float,startloopx:Float,startloopy:Float,endloopx:Float,endloopy:Float,randorX:Float,randorY:Float)
	{
		var randx=Math.random()*randorY; 
		var randy=Math.random()*randorX; 
		this.starty = starty+Math.random()*randorY;
		this.startx = startx+Math.random()*randorX;
		this.dy = dy;
		this.dx = dx;
		
		this.startloopy = startloopy+Math.random()*randorY;
		this.startloopx = startloopx+Math.random()*randorX;
		this.endloopy = endloopy+Math.random()*randorY;
		this.endloopx = endloopx+Math.random()*randorX;
		this.anim=anim;
		//this.x=startx;
		//this.y=starty;

		this.units = HogLoadingScreen.spriter.createEntity(sprite);//HogLoadingScreen.pixities[sprite];
		this.units.play(anim);


		this.timerbegin=timerbegin;
		this.vdx=dx;
		this.vdy=dy;
		this.scheme = scheme;
		countstring+=1;

	}

	public function update(elapsedTime : Float, dt : Float)
	{
		units.step(dt);
		if(scheme=="choose")
		{
			x+=vdx;
			if(anim=="walkright")
			{
				if(x>endloopx)
				{
					anim="walkleft";
					units.play(anim);
					vdx=(-dx);
				}
			}
			else if(anim=="walkleft")
			{
				if(x<startloopx)
				{
					anim="walkright";
					units.play(anim);
					vdx=(dx);
				}
			}
		}
		else if(scheme=="sending")
		{
			//anim="walkright"
			x+=vdx;
		}
		else if(scheme=="dead")
		{

		}
		else if(scheme=="win")
		{

		}
		else if(scheme=="arena")
		{
			x+=vdx;
			y+=vdy;
			if(anim=="walkright")
			{
				if(x>endloopx)
				{
					anim="walkleft";
					units.play(anim);
					vdx=(-dx);
				}

				if(y>endloopy)
				{
					vdy=(-dy);
				}

				if(y<startloopy)
				{
					vdy=(dy);
				}

			}
			else if(anim=="walkleft")
			{
				if(x<startloopx)
				{
					anim="walkright";
					units.play(anim);
					vdx=(dx);
				}

				if(y>endloopy)
				{
					vdy=(-dy);
				}

				if(y<startloopy)
				{
					vdy=(dy);
				}


			}
		}
		else if(scheme=="foearena")
		{
			x+=vdx;
			y+=vdy;
			if(anim=="walkleft")
			{
				if(x<endloopx)
				{
					anim="walkright";
					units.play(anim);
					vdx=(-dx);
				}

				if(y>endloopy)
				{
					vdy=(-dy);
				}

				if(y<startloopy)
				{
					vdy=(dy);
				}

			}
			else if(anim=="walkright")
			{
				if(x>startloopx)
				{
					anim="walkleft";
					units.play(anim);
					vdx=(dx);
				}

				if(y>endloopy)
				{
					vdy=(-dy);
				}

				if(y<startloopy)
				{
					vdy=(dy);
				}


			}
		}
		else if(scheme=="fightright")
		{
			if(anim=="walkleft")
			{
				anim="walkright";
					units.play(anim);
					vdx=(dx);
			}

			if(x>endloopx+20)
			{
				if(anim!="fightright")
				{
					anim="fightright";
					units.play(anim);
				}
			}
			else 
			{
				x+=vdx;
				y+=vdy;

				if(y>endloopy)
				{
					vdy=(-dy);
				}

			if(y<startloopy)
				{
					vdy=(dy);
				}

			}
		}
		else if(scheme=="fightleft")
		{
			if(anim=="walkright")
			{
				anim="walkleft";
					units.play(anim);
					vdx=(-dx);
			}

			if(x<(endloopx-20))
			{
				if(anim!="fightleft")
				{
					anim="fightleft";
					units.play(anim);
				}
			}
			else 
			{
				x+=vdx;
				y+=vdy;

				if(y>endloopy)
				{
					vdy=(-dy);
				}

			if(y<startloopy)
				{
					vdy=(dy);
				}

			}
		}


	}

	public function sending()
	{
		anim="walkright";
		vdx=dx;
		scheme="sending";
	}
	public function fight()
	{
		
		vdx=dx;

		if(scheme=="foearena")
		{
			scheme="fightleft";
			anim="walkleft";
			units.play(anim);
		}
		else if(scheme=="arena"){
			scheme="fightright";
			anim="walkright";
			units.play(anim);
		}
		
	}

	public function deadright()
	{
		anim="deadright";
		units.play(anim);

		scheme="dead";
	}

	public function deadleft()
	{
		anim="deadleft";
		units.play(anim);

		scheme="dead";
	}

	public function win()
	{
		anim="win";
		units.play(anim);

		scheme="win";
	}
}