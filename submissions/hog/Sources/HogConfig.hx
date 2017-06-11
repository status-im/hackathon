
import web3.Web3;

typedef Config = {
	contractAddress : String,
	serverUrl : String,
	timestamp : UInt,
	defaultSzaboInPlay : UInt,
	defaultPeriodInMinutes : UInt,
	defaultNumUnits : UInt,
	numGames : UInt,
	defaultAllowance : String,
	networkID : String
}

class HogConfig{

	public static var values : Config;
	public static var timeDelta : UInt;
	
	public static function init(){
		if(untyped js.Browser.window.hog_conf){
			values = untyped js.Browser.window.hog_conf;
			timeDelta = values.timestamp - Std.int(haxe.Timer.stamp());
		}else{
			values = untyped {};
		}
	}
}