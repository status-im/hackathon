package hog.screen;

import kha.Assets;
import kha.Image;
import kha.Framebuffer;


import mathtool.RectPoly;
import kha.Font;
import kha.Color;

import kha.graphics2.Graphics;



class ScreenUtilities
{
	

	public static function onlyRect(g2 : Graphics, x : Float, y : Float, mWidth:Float, mHeight:Float, rect : RectPoly, showpoly:Bool,color:kha.Color=kha.Color.Red)
	{

		rect.x = x;
		rect.y = y;
		rect.width =mWidth;
		rect.height =mHeight;
		g2.color=color;	
		if(showpoly==true){g2.drawRect(x-mWidth/2,y-mHeight/2, mWidth, mHeight );}
		g2.color=kha.Color.White;
	}

}