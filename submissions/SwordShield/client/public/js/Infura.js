/**
 * Created by Sergey Pomorin on 07.03.2017.
 * v 1.0.3
 */
 
var urlInfura = "https://mainnet.infura.io/JCnK5ifEPH9qcQkX0Ahl";
var gThis;
var repeatRequest = 0;

var nameCall = {getState:"09648a9d"}

var Infura = function() {
	gThis = this;
	if(options_rpc){
		urlInfura = "http://46.101.244.101:8545";
    } else if(options_ropsten){
		urlInfura = "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl";
    } else if(options_rinkeby){
		urlInfura = "https://rinkeby.infura.io/JCnK5ifEPH9qcQkX0Ahl";
	}
};

Infura.prototype.makeID = function(count){
	if(count){}else{count = 64}
    var str = "0x";
    var possible = "abcdef0123456789";
	var t = String(getTimer());
	count -= t.length;
	str += t;

    for( var i=0; i < count; i++ ){
		str += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	str = numToHex(str);
	
    return str;
}

Infura.prototype.sendRequest = function(name, params, callback, seed){
	if(openkey){
		var method = name;
		var arParams = [params, "latest"]; // latest, pending
		
		switch(name){
			case "createUser":
			case "battle":
			case "confirm":
				method = "eth_getTransactionCount";
				break;
			case "gameTxHash":
			case "sendRaw":
				method = "eth_sendRawTransaction";
				arParams = [params];
				break;
			case "getBalance":
			case "getBalanceBank":
				method = "eth_getBalance";
				break;
			case "getBlockNumber":
				method = "eth_blockNumber";
				arParams = [];
				break;
			case "getLogs":
				method = "eth_getLogs";
				arParams = [params];
				break;
			default:
				method = "eth_call";
				break;
		}
		
		$.ajax({
			url: urlInfura,
			type: "POST",
			async: false,
			dataType: 'json',
			data: JSON.stringify({"jsonrpc":'2.0',
									"method":method,
									"params":arParams,
									"id":1}),
			success: function (d) {
				if(method == "eth_sendRawTransaction" && d.result){
					gThis.sendRequestServer("responseServer", d.result, callback, seed);
				}
				callback(name, d.result, d.error);
			},
			error: function(jQXHR, textStatus, errorThrown)
			{
				alert("An error occurred whilst trying to contact the server: " + 
						jQXHR.status + " " + textStatus + " " + errorThrown);
			}
		})
	}
};

Infura.prototype.ethCall = function(name, callback, type, val){
	if(type){} else {type = "latest"};
	
	if(openkey == undefined){
		return false;
	}
	
	if(openkey){
		var method = "eth_call";
		var data = nameCall[name];
		
		var key = openkey.substr(2);
		if(val != undefined){
			data = "0x" + data + pad(numToHex(val), 64) + pad(key, 64);
		} else {
			data = "0x" + data + pad(key, 64);
		}
		
		var params = {"from":openkey,
				"to":addressStorage,
				"data":data};
		var arParams = [params, type]; // latest, pending
		
		$.ajax({
			url: urlInfura,
			type: "POST",
			async: false,
			dataType: 'json',
			data: JSON.stringify({"jsonrpc":'2.0',
									"method":method,
									"params":arParams,
									"id":1}),
			success: function (d) {
				callback(name, d.result);
			},
			error: function(jQXHR, textStatus, errorThrown)
			{
				alert("An error occurred whilst trying to contact the server: " + 
						jQXHR.status + " " + textStatus + " " + errorThrown);
			}
		})
	}
}

Infura.prototype.sendRequestServer = function(name, txid, callback, seed){
	if(txid == undefined){
		return false;
	}
	if(options_rpc){
		callback(name, gThis.makeID());
	} else {
		repeatRequest = 0;
		var url = "https://platform.dao.casino/api/proxy.php?a=roll&";
		$.get(url+"txid="+txid+"&vconcat="+seed+"&address="+addressContract, 
			function(d){
				gThis.checkJson(name, seed, callback);
			}
		);
	}
}

Infura.prototype.checkJson = function(name, seed, callback){
	$.ajax({
		url: "https://platform.dao.casino/api/proxy.php?a=get&vconcat="+seed+"&address="+addressContract,
		type: "POST",
		async: false,
		//dataType: 'json',
		success: function (obj) {
			if(obj && (''+obj).substr(0,2)=='0x'){
				repeatRequest = 0;
				callback(name, obj);
			} else {
				setTimeout(function () {
					if(repeatRequest < 20){
						repeatRequest++;
						gThis.checkJson(name, seed, callback);
					}
				}, 1000);
			}
		}
	})
}