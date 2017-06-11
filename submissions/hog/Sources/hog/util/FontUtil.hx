package hog.util; //TODO share

import kha.Font;

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

class FontUtil{
	public static function drawText(g2 : kha.graphics2.Graphics,  font : Font, size : Int, text : String, x : Float, y : Float, halign : HAlign, valign : VAlign) : Float{
		g2.font = font;
		g2.fontSize = size;
		var fHeight = font.height(size);
		var fWidth = font.width(size, text);
		switch(halign){
			case Left: 
			case Center: x -= fWidth/2;
			case Right: x -= fWidth;
		}
		switch(valign){
			case Top: 
			case Center: y-= fHeight/2;
			case Bottom: y-= fHeight;
		}
		g2.drawString(text,x,y);
		return fWidth;
	}

	public static function drawMultiLineText(g2 : kha.graphics2.Graphics,  font : Font, size : Int, text : String, x : Float, y : Float, maxWidth : Float, halign : HAlign, valign : VAlign) : Float{
		var fWidth = font.width(size, text);
		if(fWidth <= maxWidth){
			return drawText(g2,font,size,text,x,y,halign,valign);
		}else{
			var subTexts = [];
			var fHeight = font.height(size);
			while(maxWidth < fWidth){
				var lastSpaceIndex = text.lastIndexOf(" ");
				if(lastSpaceIndex >= 0){
					var subText = text.substr(0,lastSpaceIndex);
					fWidth = font.width(size, subText);
					while(maxWidth < fWidth){
						lastSpaceIndex = subText.lastIndexOf(" ");
						if(lastSpaceIndex >= 0){
							subText = subText.substr(0,lastSpaceIndex);
							fWidth = font.width(size, subText);
						}else{
							subText = text;
							break;
						}
					}
					subTexts.push(subText);
					text = text.substr(lastSpaceIndex);
					fWidth = font.width(size, text);
					if(maxWidth >= fWidth){
						subTexts.push(text);
					}
				}else{
					subTexts.push(text);
					break;
				}
			}

			var maxFWidth = 0.0; 
			var counter = 0;
			for(subText in subTexts){
				var fWidth = font.width(size, text);
				if(fWidth > maxFWidth){
					maxFWidth = fWidth;
				}
				drawText(g2,font,size,subText,x,y - ((subTexts.length - counter*2) * fHeight / 2)  ,halign,valign); //TODO valign
				counter++;
			}
			return maxFWidth; 
		}
	}
}