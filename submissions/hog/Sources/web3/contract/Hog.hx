package web3.contract;

import web3.Web3;

class Hog{

	public var address(default,null) : Address;

	public static function at(web3 : Web3, address : Address) : Hog{
		setup(web3);
		return new Hog(web3,address);
	}

	#if web3_allow_deploy
	public static function deploy(web3 : Web3, option:TransactionInfo, callback : Error -> Dynamic -> Void, mineCallback : Error -> Dynamic -> Void) : Void{ //TODO arguments + type of callback
		var mining = false;
		setup(web3);
		factory["new"]({ //TODO arguments
			from: option.from,
			gas : option.gas, 
			value : option.value,
			gasPrice : option.gasPrice,
			data: code
		}, function(err, deployedContract){
			if(err != null){
				if(mining){
					mineCallback(err, null);
				}else{
					callback(err, null);
				}
			}else{
				if(deployedContract.address != null){
					mineCallback(null, new Hog(web3,deployedContract.address));
				}else{
					if(mining){
						mineCallback("no address", null);
					}else{
						callback(null,deployedContract);
					}
				}
			}
			mining = true;
		});
	}
	#end

	#if web3_allow_privateKey
	public function sendRawData(data : String, option : {from : Address, privateKey : Dynamic, ?nonce:UInt, gasPrice : web3.Web3.Wei, gas : UInt, value : web3.Web3.Wei},
	callback:Error->TransactionHash->Void,
	?mineCallback:Error->String->TransactionReceipt->Void,
	?timeout : UInt){
		var rawTx = {
			from : option.from,
			nonce: "0x"+StringTools.hex(option.nonce),
			gasPrice: option.gasPrice == null ? "0x" + new bignumberjs.BigNumber("20000000000").toString(16) : "0x" + option.gasPrice.toString(16), 
			gasLimit: "0x" + StringTools.hex(option.gas),
			to: this.address, 
			value: option.value == null ? "0x0" :"0x" + option.value.toString(16), 
			data: data
		};
		var tx = new ethereumjs.Tx(rawTx);
		tx.sign(option.privateKey);
		var serializedTx = tx.serialize();
		_web3.eth.sendRawTransaction("0x" + serializedTx.toString('hex'), function(err, txHash) {
			callback(err,txHash);
			if(err == null && mineCallback != null){
				if(timeout != null){
					web3.Web3Util.waitForTransactionReceipt(_web3,txHash,mineCallback, timeout);
				}else{
					web3.Web3Util.waitForTransactionReceipt(_web3,txHash,mineCallback);
				}
			}
		});
	}
	#end

	public function commit_to_create_game_invite(
	params:{  slotIndex: UInt,  otherPlayer: web3.Web3.Address,  minSzabo: UInt,  maxSzabo: UInt,  numUnits: UInt,  periodInMinutes: UInt,  shadow: web3.Web3.Address,  allowance: String  },
	option:TransactionInfo,
	callback:Error->TransactionHash->Void,
	?mineCallback:Error->String->TransactionReceipt->Void,
	?timeout : UInt
	):Void{

		#if web3_allow_privateKey
		if(option.privateKey != null){
			var data = this.get_data_for_create_game_invite(params);
			if(option.nonce != null){
				sendRawData(data,{
					from:option.from,
					privateKey : option.privateKey,
					nonce : option.nonce,
					gasPrice : option.gasPrice,
					gas : option.gas,
					value: option.value
				},callback,mineCallback,timeout);
			}else{
				_web3.eth.getTransactionCount(option.from, function(err, nonce){
					if(err != null){
						callback(err,null);
					}else{
						sendRawData(data,{
							from:option.from,
							privateKey : option.privateKey,
							nonce : nonce,
							gasPrice : option.gasPrice,
							gas : option.gas,
							value: option.value
						},callback,mineCallback,timeout);
					}
					
				});
			}
		}else{
		#end
			// untyped __js__("
			_instance.create_game_invite.sendTransaction(
				 params.slotIndex, params.otherPlayer, params.minSzabo, params.maxSzabo, params.numUnits, params.periodInMinutes, params.shadow, params.allowance,
				option,
				function(err,txHash){
					callback(err,txHash);
					if(err == null && mineCallback != null){
						if(timeout != null){
							web3.Web3Util.waitForTransactionReceipt(_web3,txHash,mineCallback, timeout);
						}else{
							web3.Web3Util.waitForTransactionReceipt(_web3,txHash,mineCallback);
						}
					}
				}
			);
			// ");
		#if web3_allow_privateKey
		}
		#end

	}
	public function commit_to_create_game(
	params:{  slotIndex: UInt,  minSzabo: UInt,  maxSzabo: UInt,  numUnits: UInt,  periodInMinutes: UInt,  shadow: web3.Web3.Address,  allowance: String  },
	option:TransactionInfo,
	callback:Error->TransactionHash->Void,
	?mineCallback:Error->String->TransactionReceipt->Void,
	?timeout : UInt
	):Void{

		#if web3_allow_privateKey
		if(option.privateKey != null){
			var data = this.get_data_for_create_game(params);
			if(option.nonce != null){
				sendRawData(data,{
					from:option.from,
					privateKey : option.privateKey,
					nonce : option.nonce,
					gasPrice : option.gasPrice,
					gas : option.gas,
					value: option.value
				},callback,mineCallback,timeout);
			}else{
				_web3.eth.getTransactionCount(option.from, function(err, nonce){
					if(err != null){
						callback(err,null);
					}else{
						sendRawData(data,{
							from:option.from,
							privateKey : option.privateKey,
							nonce : nonce,
							gasPrice : option.gasPrice,
							gas : option.gas,
							value: option.value
						},callback,mineCallback,timeout);
					}
					
				});
			}
		}else{
		#end
			// untyped __js__("
			_instance.create_game.sendTransaction(
				 params.slotIndex, params.minSzabo, params.maxSzabo, params.numUnits, params.periodInMinutes, params.shadow, params.allowance,
				option,
				function(err,txHash){
					callback(err,txHash);
					if(err == null && mineCallback != null){
						if(timeout != null){
							web3.Web3Util.waitForTransactionReceipt(_web3,txHash,mineCallback, timeout);
						}else{
							web3.Web3Util.waitForTransactionReceipt(_web3,txHash,mineCallback);
						}
					}
				}
			);
			// ");
		#if web3_allow_privateKey
		}
		#end

	}
	public function commit_to_start_game(
	params:{  slotIndex: UInt,  otherSlot: Dynamic,  numUnits: UInt,  periodInMinutes: UInt,  shadow: web3.Web3.Address,  allowance: String  },
	option:TransactionInfo,
	callback:Error->TransactionHash->Void,
	?mineCallback:Error->String->TransactionReceipt->Void,
	?timeout : UInt
	):Void{

		#if web3_allow_privateKey
		if(option.privateKey != null){
			var data = this.get_data_for_start_game(params);
			if(option.nonce != null){
				sendRawData(data,{
					from:option.from,
					privateKey : option.privateKey,
					nonce : option.nonce,
					gasPrice : option.gasPrice,
					gas : option.gas,
					value: option.value
				},callback,mineCallback,timeout);
			}else{
				_web3.eth.getTransactionCount(option.from, function(err, nonce){
					if(err != null){
						callback(err,null);
					}else{
						sendRawData(data,{
							from:option.from,
							privateKey : option.privateKey,
							nonce : nonce,
							gasPrice : option.gasPrice,
							gas : option.gas,
							value: option.value
						},callback,mineCallback,timeout);
					}
					
				});
			}
		}else{
		#end
			// untyped __js__("
			_instance.start_game.sendTransaction(
				 params.slotIndex, params.otherSlot, params.numUnits, params.periodInMinutes, params.shadow, params.allowance,
				option,
				function(err,txHash){
					callback(err,txHash);
					if(err == null && mineCallback != null){
						if(timeout != null){
							web3.Web3Util.waitForTransactionReceipt(_web3,txHash,mineCallback, timeout);
						}else{
							web3.Web3Util.waitForTransactionReceipt(_web3,txHash,mineCallback);
						}
					}
				}
			);
			// ");
		#if web3_allow_privateKey
		}
		#end

	}
	public function commit_to_move_reveal(
	params:{  slot: String,  move: UInt  },
	option:TransactionInfo,
	callback:Error->TransactionHash->Void,
	?mineCallback:Error->String->TransactionReceipt->Void,
	?timeout : UInt
	):Void{

		#if web3_allow_privateKey
		if(option.privateKey != null){
			var data = this.get_data_for_move_reveal(params);
			if(option.nonce != null){
				sendRawData(data,{
					from:option.from,
					privateKey : option.privateKey,
					nonce : option.nonce,
					gasPrice : option.gasPrice,
					gas : option.gas,
					value: option.value
				},callback,mineCallback,timeout);
			}else{
				_web3.eth.getTransactionCount(option.from, function(err, nonce){
					if(err != null){
						callback(err,null);
					}else{
						sendRawData(data,{
							from:option.from,
							privateKey : option.privateKey,
							nonce : nonce,
							gasPrice : option.gasPrice,
							gas : option.gas,
							value: option.value
						},callback,mineCallback,timeout);
					}
					
				});
			}
		}else{
		#end
			// untyped __js__("
			_instance.move_reveal.sendTransaction(
				 params.slot, params.move,
				option,
				function(err,txHash){
					callback(err,txHash);
					if(err == null && mineCallback != null){
						if(timeout != null){
							web3.Web3Util.waitForTransactionReceipt(_web3,txHash,mineCallback, timeout);
						}else{
							web3.Web3Util.waitForTransactionReceipt(_web3,txHash,mineCallback);
						}
					}
				}
			);
			// ");
		#if web3_allow_privateKey
		}
		#end

	}
	public function commit_to_collect(
	params:{  slot: String  },
	option:TransactionInfo,
	callback:Error->TransactionHash->Void,
	?mineCallback:Error->String->TransactionReceipt->Void,
	?timeout : UInt
	):Void{

		#if web3_allow_privateKey
		if(option.privateKey != null){
			var data = this.get_data_for_collect(params);
			if(option.nonce != null){
				sendRawData(data,{
					from:option.from,
					privateKey : option.privateKey,
					nonce : option.nonce,
					gasPrice : option.gasPrice,
					gas : option.gas,
					value: option.value
				},callback,mineCallback,timeout);
			}else{
				_web3.eth.getTransactionCount(option.from, function(err, nonce){
					if(err != null){
						callback(err,null);
					}else{
						sendRawData(data,{
							from:option.from,
							privateKey : option.privateKey,
							nonce : nonce,
							gasPrice : option.gasPrice,
							gas : option.gas,
							value: option.value
						},callback,mineCallback,timeout);
					}
					
				});
			}
		}else{
		#end
			// untyped __js__("
			_instance.collect.sendTransaction(
				 params.slot,
				option,
				function(err,txHash){
					callback(err,txHash);
					if(err == null && mineCallback != null){
						if(timeout != null){
							web3.Web3Util.waitForTransactionReceipt(_web3,txHash,mineCallback, timeout);
						}else{
							web3.Web3Util.waitForTransactionReceipt(_web3,txHash,mineCallback);
						}
					}
				}
			);
			// ");
		#if web3_allow_privateKey
		}
		#end

	}
	public function commit_to_quit(
	params:{  slot: String,  force: Bool  },
	option:TransactionInfo,
	callback:Error->TransactionHash->Void,
	?mineCallback:Error->String->TransactionReceipt->Void,
	?timeout : UInt
	):Void{

		#if web3_allow_privateKey
		if(option.privateKey != null){
			var data = this.get_data_for_quit(params);
			if(option.nonce != null){
				sendRawData(data,{
					from:option.from,
					privateKey : option.privateKey,
					nonce : option.nonce,
					gasPrice : option.gasPrice,
					gas : option.gas,
					value: option.value
				},callback,mineCallback,timeout);
			}else{
				_web3.eth.getTransactionCount(option.from, function(err, nonce){
					if(err != null){
						callback(err,null);
					}else{
						sendRawData(data,{
							from:option.from,
							privateKey : option.privateKey,
							nonce : nonce,
							gasPrice : option.gasPrice,
							gas : option.gas,
							value: option.value
						},callback,mineCallback,timeout);
					}
					
				});
			}
		}else{
		#end
			// untyped __js__("
			_instance.quit.sendTransaction(
				 params.slot, params.force,
				option,
				function(err,txHash){
					callback(err,txHash);
					if(err == null && mineCallback != null){
						if(timeout != null){
							web3.Web3Util.waitForTransactionReceipt(_web3,txHash,mineCallback, timeout);
						}else{
							web3.Web3Util.waitForTransactionReceipt(_web3,txHash,mineCallback);
						}
					}
				}
			);
			// ");
		#if web3_allow_privateKey
		}
		#end

	}
	public function commit_to_move(
	params:{  slot: String,  hash: String  },
	option:TransactionInfo,
	callback:Error->TransactionHash->Void,
	?mineCallback:Error->String->TransactionReceipt->Void,
	?timeout : UInt
	):Void{

		#if web3_allow_privateKey
		if(option.privateKey != null){
			var data = this.get_data_for_move(params);
			if(option.nonce != null){
				sendRawData(data,{
					from:option.from,
					privateKey : option.privateKey,
					nonce : option.nonce,
					gasPrice : option.gasPrice,
					gas : option.gas,
					value: option.value
				},callback,mineCallback,timeout);
			}else{
				_web3.eth.getTransactionCount(option.from, function(err, nonce){
					if(err != null){
						callback(err,null);
					}else{
						sendRawData(data,{
							from:option.from,
							privateKey : option.privateKey,
							nonce : nonce,
							gasPrice : option.gasPrice,
							gas : option.gas,
							value: option.value
						},callback,mineCallback,timeout);
					}
					
				});
			}
		}else{
		#end
			// untyped __js__("
			_instance.move.sendTransaction(
				 params.slot, params.hash,
				option,
				function(err,txHash){
					callback(err,txHash);
					if(err == null && mineCallback != null){
						if(timeout != null){
							web3.Web3Util.waitForTransactionReceipt(_web3,txHash,mineCallback, timeout);
						}else{
							web3.Web3Util.waitForTransactionReceipt(_web3,txHash,mineCallback);
						}
					}
				}
			);
			// ");
		#if web3_allow_privateKey
		}
		#end

	}
	public function commit_to_reveal_move(
	params:{  slot: String,  move: UInt,  secret: String,  hash: String  },
	option:TransactionInfo,
	callback:Error->TransactionHash->Void,
	?mineCallback:Error->String->TransactionReceipt->Void,
	?timeout : UInt
	):Void{

		#if web3_allow_privateKey
		if(option.privateKey != null){
			var data = this.get_data_for_reveal_move(params);
			if(option.nonce != null){
				sendRawData(data,{
					from:option.from,
					privateKey : option.privateKey,
					nonce : option.nonce,
					gasPrice : option.gasPrice,
					gas : option.gas,
					value: option.value
				},callback,mineCallback,timeout);
			}else{
				_web3.eth.getTransactionCount(option.from, function(err, nonce){
					if(err != null){
						callback(err,null);
					}else{
						sendRawData(data,{
							from:option.from,
							privateKey : option.privateKey,
							nonce : nonce,
							gasPrice : option.gasPrice,
							gas : option.gas,
							value: option.value
						},callback,mineCallback,timeout);
					}
					
				});
			}
		}else{
		#end
			// untyped __js__("
			_instance.reveal_move.sendTransaction(
				 params.slot, params.move, params.secret, params.hash,
				option,
				function(err,txHash){
					callback(err,txHash);
					if(err == null && mineCallback != null){
						if(timeout != null){
							web3.Web3Util.waitForTransactionReceipt(_web3,txHash,mineCallback, timeout);
						}else{
							web3.Web3Util.waitForTransactionReceipt(_web3,txHash,mineCallback);
						}
					}
				}
			);
			// ");
		#if web3_allow_privateKey
		}
		#end

	}

	public function get_data_for_create_game_invite(
	params:{  slotIndex: UInt,  otherPlayer: web3.Web3.Address,  minSzabo: UInt,  maxSzabo: UInt,  numUnits: UInt,  periodInMinutes: UInt,  shadow: web3.Web3.Address,  allowance: String  }
	):String{

		// untyped __js__("
		return _instance.create_game_invite.getData(
			 params.slotIndex, params.otherPlayer, params.minSzabo, params.maxSzabo, params.numUnits, params.periodInMinutes, params.shadow, params.allowance
		);
		// ");
	}
	public function get_data_for_create_game(
	params:{  slotIndex: UInt,  minSzabo: UInt,  maxSzabo: UInt,  numUnits: UInt,  periodInMinutes: UInt,  shadow: web3.Web3.Address,  allowance: String  }
	):String{

		// untyped __js__("
		return _instance.create_game.getData(
			 params.slotIndex, params.minSzabo, params.maxSzabo, params.numUnits, params.periodInMinutes, params.shadow, params.allowance
		);
		// ");
	}
	public function get_data_for_start_game(
	params:{  slotIndex: UInt,  otherSlot: Dynamic,  numUnits: UInt,  periodInMinutes: UInt,  shadow: web3.Web3.Address,  allowance: String  }
	):String{

		// untyped __js__("
		return _instance.start_game.getData(
			 params.slotIndex, params.otherSlot, params.numUnits, params.periodInMinutes, params.shadow, params.allowance
		);
		// ");
	}
	public function get_data_for_move_reveal(
	params:{  slot: String,  move: UInt  }
	):String{

		// untyped __js__("
		return _instance.move_reveal.getData(
			 params.slot, params.move
		);
		// ");
	}
	public function get_data_for_collect(
	params:{  slot: String  }
	):String{

		// untyped __js__("
		return _instance.collect.getData(
			 params.slot
		);
		// ");
	}
	public function get_data_for_quit(
	params:{  slot: String,  force: Bool  }
	):String{

		// untyped __js__("
		return _instance.quit.getData(
			 params.slot, params.force
		);
		// ");
	}
	public function get_data_for_move(
	params:{  slot: String,  hash: String  }
	):String{

		// untyped __js__("
		return _instance.move.getData(
			 params.slot, params.hash
		);
		// ");
	}
	public function get_data_for_reveal_move(
	params:{  slot: String,  move: UInt,  secret: String,  hash: String  }
	):String{

		// untyped __js__("
		return _instance.reveal_move.getData(
			 params.slot, params.move, params.secret, params.hash
		);
		// ");
	}

	public function probe_create_game_invite(
	params:{  slotIndex: UInt,  otherPlayer: web3.Web3.Address,  minSzabo: UInt,  maxSzabo: UInt,  numUnits: UInt,  periodInMinutes: UInt,  shadow: web3.Web3.Address,  allowance: String  },
	option:CallInfo,
	callback:Error
	->Void
	):Void{
		_instance.create_game_invite.call(
			 params.slotIndex, params.otherPlayer, params.minSzabo, params.maxSzabo, params.numUnits, params.periodInMinutes, params.shadow, params.allowance,
			option,
			function(err,result){
				if(err != null){
					callback(err);
				}else{
					callback(null					);
				}
			}
		);
	}
	public function probe_create_game(
	params:{  slotIndex: UInt,  minSzabo: UInt,  maxSzabo: UInt,  numUnits: UInt,  periodInMinutes: UInt,  shadow: web3.Web3.Address,  allowance: String  },
	option:CallInfo,
	callback:Error
	->Void
	):Void{
		_instance.create_game.call(
			 params.slotIndex, params.minSzabo, params.maxSzabo, params.numUnits, params.periodInMinutes, params.shadow, params.allowance,
			option,
			function(err,result){
				if(err != null){
					callback(err);
				}else{
					callback(null					);
				}
			}
		);
	}
	public function probe_start_game(
	params:{  slotIndex: UInt,  otherSlot: Dynamic,  numUnits: UInt,  periodInMinutes: UInt,  shadow: web3.Web3.Address,  allowance: String  },
	option:CallInfo,
	callback:Error
	->Void
	):Void{
		_instance.start_game.call(
			 params.slotIndex, params.otherSlot, params.numUnits, params.periodInMinutes, params.shadow, params.allowance,
			option,
			function(err,result){
				if(err != null){
					callback(err);
				}else{
					callback(null					);
				}
			}
		);
	}
	public function probe_getGame(
	params:{  slot: String  },
	option:CallInfo,
	callback:Error->{  period: UInt,  szaboPaid: UInt,  p1NumUnits: UInt,  p2NumUnits: UInt,  position: Int,  turn: UInt,  otherPlayer: web3.Web3.Address,  otherSlotIndex: UInt,  move1: UInt,  move2: UInt,  hash: String,  lastTime: bignumberjs.BigNumber,  creationTime: bignumberjs.BigNumber,  gameSlot: bignumberjs.BigNumber  }
	->Void
	):Void{
		_instance.getGame.call(
			 params.slot,
			option,
			function(err,result){
				if(err != null){
					callback(err,null);
				}else{
					callback(null,
						{
							period: cast result[0],
							szaboPaid: cast result[1].toNumber(),
							p1NumUnits: cast result[2].toNumber(),
							p2NumUnits: cast result[3].toNumber(),
							position: cast result[4].toNumber(),
							turn: cast result[5].toNumber(),
							otherPlayer: cast result[6],
							otherSlotIndex: cast result[7].toNumber(),
							move1: cast result[8].toNumber(),
							move2: cast result[9].toNumber(),
							hash: cast result[10],
							lastTime: cast result[11],
							creationTime: cast result[12],
							gameSlot: cast result[13]
						}
					);
				}
			}
		);
	}
	public function probe_move_reveal(
	params:{  slot: String,  move: UInt  },
	option:CallInfo,
	callback:Error
	->Void
	):Void{
		_instance.move_reveal.call(
			 params.slot, params.move,
			option,
			function(err,result){
				if(err != null){
					callback(err);
				}else{
					callback(null					);
				}
			}
		);
	}
	public function probe_getOccupancy(
	
	option:CallInfo,
	callback:Error->{  occup: bignumberjs.BigNumber  }
	->Void
	):Void{
		_instance.getOccupancy.call(
			
			option,
			function(err,result){
				if(err != null){
					callback(err,null);
				}else{
					callback(null,
						{
							occup: cast result
						}
					);
				}
			}
		);
	}
	public function probe_collect(
	params:{  slot: String  },
	option:CallInfo,
	callback:Error
	->Void
	):Void{
		_instance.collect.call(
			 params.slot,
			option,
			function(err,result){
				if(err != null){
					callback(err);
				}else{
					callback(null					);
				}
			}
		);
	}
	public function probe_quit(
	params:{  slot: String,  force: Bool  },
	option:CallInfo,
	callback:Error
	->Void
	):Void{
		_instance.quit.call(
			 params.slot, params.force,
			option,
			function(err,result){
				if(err != null){
					callback(err);
				}else{
					callback(null					);
				}
			}
		);
	}
	public function probe_move(
	params:{  slot: String,  hash: String  },
	option:CallInfo,
	callback:Error
	->Void
	):Void{
		_instance.move.call(
			 params.slot, params.hash,
			option,
			function(err,result){
				if(err != null){
					callback(err);
				}else{
					callback(null					);
				}
			}
		);
	}
	public function probe_reveal_move(
	params:{  slot: String,  move: UInt,  secret: String,  hash: String  },
	option:CallInfo,
	callback:Error
	->Void
	):Void{
		_instance.reveal_move.call(
			 params.slot, params.move, params.secret, params.hash,
			option,
			function(err,result){
				if(err != null){
					callback(err);
				}else{
					callback(null					);
				}
			}
		);
	}

	// 
	// public function get_data_to_create_game_invite(
	// params:{  slotIndex: UInt,  otherPlayer: web3.Web3.Address,  minSzabo: UInt,  maxSzabo: UInt,  numUnits: UInt,  periodInMinutes: UInt,  shadow: web3.Web3.Address,  allowance: String  },
	// option:CallInfo,
	// callback:Error->String
	// ->Void
	// ):Void{
	// 	_instance.create_game_invite.getData(
	// 		 params.slotIndex, params.otherPlayer, params.minSzabo, params.maxSzabo, params.numUnits, params.periodInMinutes, params.shadow, params.allowance,
	// 		option,
	// 		function(err,data : String){
	// 			if(err != null){
	// 				callback(err, null);
	// 			}else{
	// 				callback(null,data);
	// 			}
	// 		}
	// 	);
	// }
	// 
	// public function get_data_to_create_game(
	// params:{  slotIndex: UInt,  minSzabo: UInt,  maxSzabo: UInt,  numUnits: UInt,  periodInMinutes: UInt,  shadow: web3.Web3.Address,  allowance: String  },
	// option:CallInfo,
	// callback:Error->String
	// ->Void
	// ):Void{
	// 	_instance.create_game.getData(
	// 		 params.slotIndex, params.minSzabo, params.maxSzabo, params.numUnits, params.periodInMinutes, params.shadow, params.allowance,
	// 		option,
	// 		function(err,data : String){
	// 			if(err != null){
	// 				callback(err, null);
	// 			}else{
	// 				callback(null,data);
	// 			}
	// 		}
	// 	);
	// }
	// 
	// public function get_data_to_start_game(
	// params:{  slotIndex: UInt,  otherSlot: Dynamic,  numUnits: UInt,  periodInMinutes: UInt,  shadow: web3.Web3.Address,  allowance: String  },
	// option:CallInfo,
	// callback:Error->String
	// ->Void
	// ):Void{
	// 	_instance.start_game.getData(
	// 		 params.slotIndex, params.otherSlot, params.numUnits, params.periodInMinutes, params.shadow, params.allowance,
	// 		option,
	// 		function(err,data : String){
	// 			if(err != null){
	// 				callback(err, null);
	// 			}else{
	// 				callback(null,data);
	// 			}
	// 		}
	// 	);
	// }
	// 
	// public function get_data_to_getGame(
	// params:{  slot: String  },
	// option:CallInfo,
	// callback:Error->String
	// ->Void
	// ):Void{
	// 	_instance.getGame.getData(
	// 		 params.slot,
	// 		option,
	// 		function(err,data : String){
	// 			if(err != null){
	// 				callback(err, null);
	// 			}else{
	// 				callback(null,data);
	// 			}
	// 		}
	// 	);
	// }
	// 
	// public function get_data_to_move_reveal(
	// params:{  slot: String,  move: UInt  },
	// option:CallInfo,
	// callback:Error->String
	// ->Void
	// ):Void{
	// 	_instance.move_reveal.getData(
	// 		 params.slot, params.move,
	// 		option,
	// 		function(err,data : String){
	// 			if(err != null){
	// 				callback(err, null);
	// 			}else{
	// 				callback(null,data);
	// 			}
	// 		}
	// 	);
	// }
	// 
	// public function get_data_to_getOccupancy(
	// 
	// option:CallInfo,
	// callback:Error->String
	// ->Void
	// ):Void{
	// 	_instance.getOccupancy.getData(
	// 		
	// 		option,
	// 		function(err,data : String){
	// 			if(err != null){
	// 				callback(err, null);
	// 			}else{
	// 				callback(null,data);
	// 			}
	// 		}
	// 	);
	// }
	// 
	// public function get_data_to_collect(
	// params:{  slot: String  },
	// option:CallInfo,
	// callback:Error->String
	// ->Void
	// ):Void{
	// 	_instance.collect.getData(
	// 		 params.slot,
	// 		option,
	// 		function(err,data : String){
	// 			if(err != null){
	// 				callback(err, null);
	// 			}else{
	// 				callback(null,data);
	// 			}
	// 		}
	// 	);
	// }
	// 
	// public function get_data_to_quit(
	// params:{  slot: String,  force: Bool  },
	// option:CallInfo,
	// callback:Error->String
	// ->Void
	// ):Void{
	// 	_instance.quit.getData(
	// 		 params.slot, params.force,
	// 		option,
	// 		function(err,data : String){
	// 			if(err != null){
	// 				callback(err, null);
	// 			}else{
	// 				callback(null,data);
	// 			}
	// 		}
	// 	);
	// }
	// 
	// public function get_data_to_move(
	// params:{  slot: String,  hash: String  },
	// option:CallInfo,
	// callback:Error->String
	// ->Void
	// ):Void{
	// 	_instance.move.getData(
	// 		 params.slot, params.hash,
	// 		option,
	// 		function(err,data : String){
	// 			if(err != null){
	// 				callback(err, null);
	// 			}else{
	// 				callback(null,data);
	// 			}
	// 		}
	// 	);
	// }
	// 
	// public function get_data_to_reveal_move(
	// params:{  slot: String,  move: UInt,  secret: String,  hash: String  },
	// option:CallInfo,
	// callback:Error->String
	// ->Void
	// ):Void{
	// 	_instance.reveal_move.getData(
	// 		 params.slot, params.move, params.secret, params.hash,
	// 		option,
	// 		function(err,data : String){
	// 			if(err != null){
	// 				callback(err, null);
	// 			}else{
	// 				callback(null,data);
	// 			}
	// 		}
	// 	);
	// }
	// 

	public function estimateGas_for_create_game_invite(
	params:{  slotIndex: UInt,  otherPlayer: web3.Web3.Address,  minSzabo: UInt,  maxSzabo: UInt,  numUnits: UInt,  periodInMinutes: UInt,  shadow: web3.Web3.Address,  allowance: String  },
	option:CallInfo,
	callback:Error->Float
	->Void
	):Void{
		_instance.create_game_invite.estimateGas(
			 params.slotIndex, params.otherPlayer, params.minSzabo, params.maxSzabo, params.numUnits, params.periodInMinutes, params.shadow, params.allowance,
			option,
			function(err,gas : Float){
				if(err != null){
					callback(err, 0);
				}else{
					callback(null,gas);
				}
			}
		);
	}
	public function estimateGas_for_create_game(
	params:{  slotIndex: UInt,  minSzabo: UInt,  maxSzabo: UInt,  numUnits: UInt,  periodInMinutes: UInt,  shadow: web3.Web3.Address,  allowance: String  },
	option:CallInfo,
	callback:Error->Float
	->Void
	):Void{
		_instance.create_game.estimateGas(
			 params.slotIndex, params.minSzabo, params.maxSzabo, params.numUnits, params.periodInMinutes, params.shadow, params.allowance,
			option,
			function(err,gas : Float){
				if(err != null){
					callback(err, 0);
				}else{
					callback(null,gas);
				}
			}
		);
	}
	public function estimateGas_for_start_game(
	params:{  slotIndex: UInt,  otherSlot: Dynamic,  numUnits: UInt,  periodInMinutes: UInt,  shadow: web3.Web3.Address,  allowance: String  },
	option:CallInfo,
	callback:Error->Float
	->Void
	):Void{
		_instance.start_game.estimateGas(
			 params.slotIndex, params.otherSlot, params.numUnits, params.periodInMinutes, params.shadow, params.allowance,
			option,
			function(err,gas : Float){
				if(err != null){
					callback(err, 0);
				}else{
					callback(null,gas);
				}
			}
		);
	}
	public function estimateGas_for_getGame(
	params:{  slot: String  },
	option:CallInfo,
	callback:Error->Float
	->Void
	):Void{
		_instance.getGame.estimateGas(
			 params.slot,
			option,
			function(err,gas : Float){
				if(err != null){
					callback(err, 0);
				}else{
					callback(null,gas);
				}
			}
		);
	}
	public function estimateGas_for_move_reveal(
	params:{  slot: String,  move: UInt  },
	option:CallInfo,
	callback:Error->Float
	->Void
	):Void{
		_instance.move_reveal.estimateGas(
			 params.slot, params.move,
			option,
			function(err,gas : Float){
				if(err != null){
					callback(err, 0);
				}else{
					callback(null,gas);
				}
			}
		);
	}
	public function estimateGas_for_getOccupancy(
	
	option:CallInfo,
	callback:Error->Float
	->Void
	):Void{
		_instance.getOccupancy.estimateGas(
			
			option,
			function(err,gas : Float){
				if(err != null){
					callback(err, 0);
				}else{
					callback(null,gas);
				}
			}
		);
	}
	public function estimateGas_for_collect(
	params:{  slot: String  },
	option:CallInfo,
	callback:Error->Float
	->Void
	):Void{
		_instance.collect.estimateGas(
			 params.slot,
			option,
			function(err,gas : Float){
				if(err != null){
					callback(err, 0);
				}else{
					callback(null,gas);
				}
			}
		);
	}
	public function estimateGas_for_quit(
	params:{  slot: String,  force: Bool  },
	option:CallInfo,
	callback:Error->Float
	->Void
	):Void{
		_instance.quit.estimateGas(
			 params.slot, params.force,
			option,
			function(err,gas : Float){
				if(err != null){
					callback(err, 0);
				}else{
					callback(null,gas);
				}
			}
		);
	}
	public function estimateGas_for_move(
	params:{  slot: String,  hash: String  },
	option:CallInfo,
	callback:Error->Float
	->Void
	):Void{
		_instance.move.estimateGas(
			 params.slot, params.hash,
			option,
			function(err,gas : Float){
				if(err != null){
					callback(err, 0);
				}else{
					callback(null,gas);
				}
			}
		);
	}
	public function estimateGas_for_reveal_move(
	params:{  slot: String,  move: UInt,  secret: String,  hash: String  },
	option:CallInfo,
	callback:Error->Float
	->Void
	):Void{
		_instance.reveal_move.estimateGas(
			 params.slot, params.move, params.secret, params.hash,
			option,
			function(err,gas : Float){
				if(err != null){
					callback(err, 0);
				}else{
					callback(null,gas);
				}
			}
		);
	}


	static var factory : haxe.DynamicAccess<Dynamic>;
	static var code : String;

	static function setup(_web3 : web3.Web3){
		if(factory == null){
			#if web3_allow_deploy
			code = "0x" + "6060604052341561000c57fe5b5b611caf8061001c6000396000f300606060405236156100a15763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166364b18bc781146100a35780636e116196146100e95780639939864e14610127578063a2f77bcc14610160578063a53b543814610211578063b16afc741461022c578063ce3f865f1461024e578063d040a75614610263578063d8fa19821461027d578063ea0bf5c714610295575bfe5b6100e760ff600435811690600160a060020a0360243581169163ffffffff60443581169260643590911691608435169061ffff60a435169060c4351660e4356102b6565b005b6100e760ff60043581169063ffffffff602435811691604435909116906064351661ffff60843516600160a060020a0360a4351660c43561066d565b005b6100e760ff600435811690600160a860020a0360243516906044351661ffff60643516600160a060020a036084351660a435610a18565b005b341561016857fe5b610173600435610e2c565b6040805161ffff909f168f5263ffffffff909d1660208f015260ff9b8c168e8e0152998b1660608e0152600098890b90980b60808d015295891660a08c0152600160a060020a0390941660c08b015291871660e08a0152861661010089015290941661012087015261014086019390935267ffffffffffffffff9283166101608601529091166101808401526101a083015251908190036101c00190f35b341561021957fe5b6100e760043560ff60243516610fa9565b005b341561023457fe5b61023c61113c565b60408051918252519081900360200190f35b341561025657fe5b6100e7600435611159565b005b341561026b57fe5b6100e7600435602435151561128c565b005b341561028557fe5b6100e760043560243561134b565b005b341561029d57fe5b6100e760043560ff60243516604435606435611457565b005b3481900360006102c6338b611934565b60008181526020819052604090206001015490915060c060020a900460ff16158061030c5750600081815260208190526040902060019081015460c060020a900460ff16145b80156103215750637fffffff8763ffffffff16105b801561033a57508663ffffffff1664e8d4a51000028210155b8015610349575060058660ff16115b80156103585750607f8660ff16105b1561065a57604080516101e0810190915260006060820190815267ffffffffffffffff4216608083015263ffffffff808b1660a0840152891660c0830152819060e0820164e8d4a51000865b0463ffffffff1681526020018861ffff168152602001603260ff168152602001603260ff168152602001600160ff168152602001600060000b8152602001600060ff168152602001600060ff16815250815260200185600160a060020a031681526020016104138b6000611934565b815250600060008381526020019081526020016000206000820151816000016000820151816000019060001916905560208201518160010160006101000a81548167ffffffffffffffff021916908367ffffffffffffffff16021790555060408201518160010160086101000a81548163ffffffff021916908363ffffffff160217905550606082015181600101600c6101000a81548163ffffffff021916908363ffffffff16021790555060808201518160010160106101000a81548163ffffffff021916908363ffffffff16021790555060a08201518160010160146101000a81548161ffff021916908361ffff16021790555060c08201518160010160166101000a81548160ff021916908360ff16021790555060e08201518160010160176101000a81548160ff021916908360ff1602179055506101008201518160010160186101000a81548160ff021916908360ff1602179055506101208201518160010160196101000a81548160ff021916908360000b60ff16021790555061014082015181600101601a6101000a81548160ff021916908360ff16021790555061016082015181600101601b6101000a81548160ff021916908360ff160217905550505060208201518160020160006101000a815481600160a060020a030219169083600160a060020a03160217905550604082015181600301559050508960ff1660020a6001600033600160a060020a0316600160a060020a03168152602001908152602001600020600082825417925050819055506106558484611944565b610660565b60006000fd5b5b50505050505050505050565b34819003600061067d338a611934565b60008181526020819052604090206001015490915060c060020a900460ff1615806106c35750600081815260208190526040902060019081015460c060020a900460ff16145b80156106d85750637fffffff8763ffffffff16105b80156106f157508663ffffffff1664e8d4a51000028210155b8015610700575060058660ff16115b801561070f5750607f8660ff16105b1561065a57604080516101e0810190915260006060820190815267ffffffffffffffff4216608083015263ffffffff808b1660a0840152891660c0830152819060e0820164e8d4a51000865b0463ffffffff1681526020018861ffff1681526020018960ff1681526020018960ff168152602001600160ff168152602001600060000b8152602001600060ff168152602001600060ff16815250815260200185600160a060020a031681526020016000815250600060008381526020019081526020016000206000820151816000016000820151816000019060001916905560208201518160010160006101000a81548167ffffffffffffffff021916908367ffffffffffffffff16021790555060408201518160010160086101000a81548163ffffffff021916908363ffffffff160217905550606082015181600101600c6101000a81548163ffffffff021916908363ffffffff16021790555060808201518160010160106101000a81548163ffffffff021916908363ffffffff16021790555060a08201518160010160146101000a81548161ffff021916908361ffff16021790555060c08201518160010160166101000a81548160ff021916908360ff16021790555060e08201518160010160176101000a81548160ff021916908360ff1602179055506101008201518160010160186101000a81548160ff021916908360ff1602179055506101208201518160010160196101000a81548160ff021916908360000b60ff16021790555061014082015181600101601a6101000a81548160ff021916908360ff16021790555061016082015181600101601b6101000a81548160ff021916908360ff160217905550505060208201518160020160006101000a815481600160a060020a030219169083600160a060020a03160217905550604082015181600301559050508860ff1660020a6001600033600160a060020a0316600160a060020a0316815260200190815260200160002060008282541792505081905550610a018484611944565b610a0c565b60006000fd5b5b505050505050505050565b3481900360008080610a2a338b611934565b925088915033600160a060020a031682600160a060020a031614158015610a765750600160a860020a038916600090815260208190526040902060019081015460c060020a900460ff16145b8015610a9b575060008381526020819052604090206001015460c060020a900460ff16155b8015610afa5750600160a860020a0389166000908152602081905260409020600301541580610afa575033600160a060020a0316600060008b600160a860020a0316815260200190815260200160002060030154600160a060020a0316145b5b8015610b2e5750600160a860020a03891660009081526020819052604090206001015460ff89811660b060020a90920416145b8015610b625750600160a860020a03891660009081526020819052604090206001015461ffff88811660a060020a90920416145b8015610ba6575064e8d4a51000845b600160a860020a038b166000908152602081905260409020600101549190046801000000000000000090910463ffffffff1611155b8015610bee575064e8d4a51000845b600160a860020a038b166000908152602081905260409020600101549190046c0100000000000000000000000090910463ffffffff1610155b8015610c325750600160a860020a03891660009081526020819052604090206001015460a060020a810461ffff908116603c021667ffffffffffffffff9091164203105b1561065a5750600082815260208190526040808220600160a860020a038b16600382018190556001808301805478ff00000000000000000000000000000000000000000000000060c060020a60ff02199091161780825592865293909420909301805467ffffffffffffffff1667ffffffffffffffff1990941693909317909155600201805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a03881617905554608060020a900463ffffffff1664e8d4a510000283811115610d2757604051600160a060020a0383169085830380156108fc02916000818181858888f193505050501515610d2757fe5b5b600160a860020a0389166000908152602081905260409020600181018054600390920185905567ffffffffffffffff199091164267ffffffffffffffff161760c060020a60ff021916780200000000000000000000000000000000000000000000000017905564e8d4a51000845b600160a860020a038b166000908152602081815260408083206001908101805473ffffffff000000000000000000000000000000001916608060020a97909604600290810263ffffffff16979097029590951790945533600160a060020a0316835292905220805460ff8d1690920a90911790556106558686611944565b610660565b60006000fd5b5b50505050505050505050565b600081815260208190526040812060018101548291829182918291829182918291829182918291829182918f919060ff60c060020a90910481161415610e82576003015460008181526020819052604090209091505b600381015460008181526020819052604090206001015490995067ffffffffffffffff16925060a060020a895b04975080600001600101601a9054906101000a900460ff16965080600001600101601b9054906101000a900460ff169550806000016000015494508060000160010160149054906101000a900461ffff169e508060000160010160109054906101000a900463ffffffff169d508060000160010160169054906101000a900460ff169c508060000160010160179054906101000a900460ff169b508060000160010160199054906101000a900460000b9a508060000160010160189054906101000a900460ff1699508060000160010160009054906101000a900467ffffffffffffffff1693505b5091939597999b9d5091939597999b9d565b60008281526020819052604090206001810154600360c060020a90910460ff1610801590610fe65750600181015460ff60c060020a909104811614155b80156110085750600181015460029060c060020a900460ff165b0660ff166001145b801561103f575033600160a060020a031683600160a060020a0316148061103f5750600281015433600160a060020a039081169116145b5b801561106d5750600181015460a060020a810461ffff908116603c021667ffffffffffffffff9091164203105b1561065a576001810154600060b060020a90910460ff16118015611092575060ff8216155b806110ae5750600181015460ff60b060020a9091048116908316115b156110b95760006000fd5b6001818101805460c060020a60ff02197aff00000000000000000000000000000000000000000000000000001990911660d060020a60ff878116919091029190911791821660c060020a92839004821690940116029190911767ffffffffffffffff19164267ffffffffffffffff16179055611136565b60006000fd5b5b505050565b600160a060020a0333166000908152600160205260409020545b90565b6000818152602081905260409020600181015460a060020a810461ffff908116603c021667ffffffffffffffff9091164203111561065a576001810154600460c060020a90910460ff16108015906111c75750600181015460029060c060020a900460ff165b0660ff166000145b806111df575060018181015460c060020a900460ff16145b806111f85750600181015460c060020a900460ff166002145b1561120c576112078283611980565b61127b565b6001810154600360c060020a90910460ff161080159061123b5750600181015460ff60c060020a909104811614155b801561125d5750600181015460029060c060020a900460ff165b0660ff166001145b1561065a57611207828260030154611980565b61127b565b60006000fd5b5b611287565b60006000fd5b5b5050565b6000828152602081905260409020600181015460a060020a810461ffff908116603c021667ffffffffffffffff909116420311156112d2576112cd83611159565b611136565b811561065a5733600160a060020a031683600160a060020a0316141561130557611300838260030154611980565b6112cd565b33600160a060020a03168160030154600160a060020a0316141561065a576113008384611980565b6112cd565b60006000fd5b5b611136565b60006000fd5b5b5b505050565b6000828152602081905260409020600181015460c060020a900460ff1660021480156113b8575033600160a060020a03168160030154600160a060020a031614806113b85750600381015460009081526020819052604090206002015433600160a060020a039081169116145b5b80156113e65750600181015460a060020a810461ffff908116603c021667ffffffffffffffff9091164203105b1561065a576001818101805460c060020a60ff0219167803000000000000000000000000000000000000000000000000179055600084815260208190526040902083815501805467ffffffffffffffff19164267ffffffffffffffff16179055611136565b60006000fd5b5b505050565b60008481526020819052604081206001810154909190600460c060020a90910460ff161080159061149e5750600182015460029060c060020a900460ff165b0660ff166000145b80156114eb575033600160a060020a03168260030154600160a060020a031614806114eb5750600382015460009081526020819052604090206002015433600160a060020a039081169116145b5b80156115195750600182015460a060020a810461ffff908116603c021667ffffffffffffffff9091164203105b801561159757506000868152602081815260409182902054600385015483518881526c01000000000000000000000000600160a060020a0390921691909102928101929092527f010000000000000000000000000000000000000000000000000000000000000060ff89160260348301529151908190036035019020145b1561065a576001828101805460c060020a60ff0219811660c060020a9182900460ff90811690940184169091021767ffffffffffffffff19164267ffffffffffffffff161790819055600060b860020a9091049091161180156115fb575060ff8516155b806116175750600182015460ff60b860020a9091048116908616115b156116225760006000fd5b5060018101805483835577ff00000000000000000000000000000000000000000000001976ff00000000000000000000000000000000000000000000197bff000000000000000000000000000000000000000000000000000000199092167b0100000000000000000000000000000000000000000000000000000060ff8981169182029290921793841660d060020a8504831660b060020a95869004841681900384169095021792831660b860020a9384900483168a9003909216909202179092559081101561171f5760018201805460c860020a60ff0219811660ff60c860020a92839004600090810b60001901900b16909102179055611760565b8460ff168160ff161115611760576001808301805460c860020a808204600090810b90940190930b60ff1690920260c860020a60ff02199092169190911790555b5b600182015460b060020a900460ff1615801561178c57506001820154600060b860020a90910460ff16115b156117ce5760018201805460ff60b860020a8204811660c860020a808404600090810b9290920390910b9091160260c860020a60ff0219909116179055611835565b6001820154600060b060020a90910460ff161180156117f95750600182015460b860020a900460ff16155b156118355760018201805460c860020a808204600090810b60ff60b060020a850481169190910190910b160260c860020a60ff02199091161790555b5b600182015460011960c860020a909104600090810b900b121561186657611861868360030154611980565b61191b565b6001820154600260c860020a909104600090810b900b1315611891576118618687611980565b61191b565b600182015460b860020a900460ff161580156118b95750600182015460b060020a900460ff16155b1561191b576001820154600060c860020a909104810b810b12156118ea57611861868360030154611980565b61191b565b6001820154600060c860020a909104810b810b1315611912576118618687611980565b61191b565b61191b866119e0565b5b5b5b5b5b61192b565b60006000fd5b5b505050505050565b60a060020a810282015b92915050565b600081111561128757604051600160a060020a0383169082156108fc029083906000818181858888f19350505050151561128757fe5b5b5b5050565b600082815260208190526040808220600181015491519092600160a060020a0385169264e8d4a5100063ffffffff608060020a909204919091160280156108fc02929091818181858888f193505050505061113683611a94565b5b505050565b60008181526020819052604081206003810154600182015491928492600290608060020a900463ffffffff1664e8d4a51000025b6040519190049150600160a060020a0383169082156108fc029083906000818181858888f1505050506001850154604051600160a060020a03861692506108fc608060020a90920463ffffffff1664e8d4a510000284900380159290920291906000818181858888f1935050505050611a8c85611a94565b5b5050505050565b6000818152602081905260408082206001808201805460c060020a60ff021990811682556003840180548752858720840180549092169091558154815487528587208401805476ff00000000000000000000000000000000000000000000191660ff60b860020a93849004811660b060020a90810292909217909255845484548a52888a208701805477ff0000000000000000000000000000000000000000000000191692909104831690930217909155825482548852868820850180547aff000000000000000000000000000000000000000000000000000019167b0100000000000000000000000000000000000000000000000000000092839004841660d060020a90810291909117909155845484548a52888a20870180547bff0000000000000000000000000000000000000000000000000000001916929091048416909202179055915490548652938520909101805460c860020a60ff02191660c860020a94859004860b8603860b909216909302179091559060a060020a835b600160a060020a038516600090815260016020526040902080549290910460ff811660020a9092179055600383015490915060a060020a905b6003840154600160a060020a0316600090815260016020526040902080549290910460ff811660020a19909216905590505b5050505600a165627a7a7230582079d10b53941cf574851a9a30d8f47a798b93a7d1ec798c2b81e65b06523079a30029";
			#end
			factory = _web3.eth.contract(haxe.Json.parse('[{"constant":false,"inputs":[{"name":"slotIndex","type":"uint8"},{"name":"otherPlayer","type":"address"},{"name":"minSzabo","type":"uint32"},{"name":"maxSzabo","type":"uint32"},{"name":"numUnits","type":"uint8"},{"name":"periodInMinutes","type":"uint16"},{"name":"shadow","type":"address"},{"name":"allowance","type":"uint256"}],"name":"create_game_invite","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"slotIndex","type":"uint8"},{"name":"minSzabo","type":"uint32"},{"name":"maxSzabo","type":"uint32"},{"name":"numUnits","type":"uint8"},{"name":"periodInMinutes","type":"uint16"},{"name":"shadow","type":"address"},{"name":"allowance","type":"uint256"}],"name":"create_game","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"slotIndex","type":"uint8"},{"name":"otherSlot","type":"uint168"},{"name":"numUnits","type":"uint8"},{"name":"periodInMinutes","type":"uint16"},{"name":"shadow","type":"address"},{"name":"allowance","type":"uint256"}],"name":"start_game","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[{"name":"slot","type":"uint256"}],"name":"getGame","outputs":[{"name":"period","type":"uint16"},{"name":"szaboPaid","type":"uint32"},{"name":"p1NumUnits","type":"uint8"},{"name":"p2NumUnits","type":"uint8"},{"name":"position","type":"int8"},{"name":"turn","type":"uint8"},{"name":"otherPlayer","type":"address"},{"name":"otherSlotIndex","type":"uint8"},{"name":"move1","type":"uint8"},{"name":"move2","type":"uint8"},{"name":"hash","type":"bytes32"},{"name":"lastTime","type":"uint64"},{"name":"creationTime","type":"uint64"},{"name":"gameSlot","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"slot","type":"uint256"},{"name":"move","type":"uint8"}],"name":"move_reveal","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getOccupancy","outputs":[{"name":"occup","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"slot","type":"uint256"}],"name":"collect","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"slot","type":"uint256"},{"name":"force","type":"bool"}],"name":"quit","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"slot","type":"uint256"},{"name":"hash","type":"bytes32"}],"name":"move","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"slot","type":"uint256"},{"name":"move","type":"uint8"},{"name":"secret","type":"bytes32"},{"name":"hash","type":"bytes32"}],"name":"reveal_move","outputs":[],"payable":false,"type":"function"}]'));
		}
	}

	var _web3 : web3.Web3;
	var _instance : Dynamic;

	private function new(_web3 : web3.Web3,address : web3.Web3.Address) { 
		this._web3 = _web3;
		_instance = factory["at"](address);
		this.address = address;
	}
}
