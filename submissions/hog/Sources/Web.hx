class Web{
	public static var params : Map<String,String> = new Map();
	//parse get param param
	static public function init(){
		var paramStr = js.Browser.window.location.search.substr(1);
		if(paramStr != ""){
			var paramArray = paramStr.split("&");
			for(param in paramArray) {
				if(param != ""){
					var splitIndex = param.indexOf("=");
					if(splitIndex >= 0){
						var name = param.substr(0,splitIndex);
						var value = param.substr(splitIndex+1);
						params[name] = value;
					}else{
						params[param] = "";
					}
				}
			}
		}
		
	}
}