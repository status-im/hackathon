package hog.util;

class TimeUtil{
	public static function dhms(timeInSeconds : Float, ?numGroupsToShow : Int = 2, ?fullWords : Bool = false, ?colon : Bool) : String{
		var numDays = Std.int(timeInSeconds / (3600*24));
		timeInSeconds -= numDays * (3600*24);
		var numHours = Std.int(timeInSeconds / 3600);
		timeInSeconds -= numHours * 3600;
		var numMinutes = Std.int(timeInSeconds / 60);
		timeInSeconds -= numMinutes * 60;
		var numSeconds = Std.int(timeInSeconds);

		var zeroFound = false;
		var st = "";
		var numGroup: Int = 0;
		if(numDays > 0){
			st += numDays;
			if(!colon){
				st += (fullWords ? " day" + (numDays > 1 ? "s":" ") : " d");
			}
			
			numGroup++;
		}
		if(numGroup < numGroupsToShow && !(numGroup == 0 && numHours == 0)){
			st += (st =="" ? ""  : (colon?":":" ")) + (numHours < 10 ? "0" : "") + numHours;
			if(!colon){
				st += (fullWords ? " hour"+ (numHours > 1 ? "s":" ") : " h");
			}
			numGroup++;
		}
		if(numGroup < numGroupsToShow && !(numGroup == 0 && numMinutes == 0)){
			st += (st =="" ? ""  : (colon?":":" ")) + (numMinutes < 10 ? "0" : "") + numMinutes;
			if(!colon){
				st += (fullWords ? " minute"+ (numMinutes > 1 ? "s":" ") : " m");
			}
			numGroup++;
		}
		if(numGroup < numGroupsToShow && !(numGroup == 0 && numSeconds == 0)){
			st += (st =="" ? ""  : (colon?":":" ")) + (numSeconds < 10 ? "0" : "") + numSeconds;
			if(!colon){
				st += (fullWords ? " second"+ (numSeconds > 1 ? "s":" ") : " s");
			}
			numGroup++;
		}

		return st;
	}
}