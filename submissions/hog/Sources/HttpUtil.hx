
class HttpUtil{
	static public function post(url : String, dataToSend : String, callback: Dynamic -> String -> Void){
		var http = new haxe.Http(url);
		var statusReceived : Int = 0;
		http.onData = function(data:String){
			if(statusReceived == 200){
				callback(null,data);
			}else{
				callback("wrong status: " + statusReceived,null);
			}
		}
		http.onError = function(msg:String){
			callback(msg,null);
		}
		http.onStatus = function(status:Int){
			statusReceived = status;
		}
		http.setPostData(dataToSend);
		http.request(true);
	}

	static public function get(url : String, callback: Dynamic -> String -> Void){
		var http = new haxe.Http(url);
		var statusReceived : Int = 0;
		http.onData = function(data:String){
			if(statusReceived == 200){
				callback(null,data);
			}else{
				callback("wrong status: " + statusReceived,null);
			}
		}
		http.onError = function(msg:String){
			callback(msg,null);
		}
		http.onStatus = function(status:Int){
			statusReceived = status;
		}
		http.request();
	}
}