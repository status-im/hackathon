import _config  from "./app.config.js";

// import DB         from './model/DB/DB'
import Eth        from './model/Eth/Eth'
import Api        from './model/Api'
import firebase         from 'firebase'
import bigInt     from 'big-integer'
import Web3       from 'web3'
const web3 = new Web3()



// web3.setProvider(new web3.providers.HttpProvider("https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl"))

import * as Utils from './model/utils'

export default class Game {
	constructor(params) {
		window.openkey   = params.openkey || false
		window.user_role = params.role    || false

		// Defense
		setTimeout(()=>{
		// console.log(Eth.Wallet)
			this.runConfirm()
		},2000)

		firebase.initializeApp(_config.firebase);
		window.FB = firebase.database()



	}

	getContractMeta(callback){
		Eth.RPC.request('call', [{
			'to':   _config.contract.address,
			'data': '0x' + Eth.hashName('meta_name()')
		}, 'pending'], 0).then( response => {
			var meta_name = web3.toAscii(response.result)
						.replace(/\u0007/g, '')
						.replace(/\u0008/g, '')
						.replace(/\u0025/g, '')
						.replace(/\u0000/g, '')
						.trim()
			callback(meta_name)
		})
	}

	generateSeed(){
		return Utils.makeID()
	}

	createUser(skin, callback){
		console.log( _config.contract.address )


		callback()
// console.log(skin)

// 		Eth.Wallet.signedContractFuncTx(_config.contract.address, _config.contract.address.abi,
// 			'createUser'+[Utils.pad(Utils.numToHex(skin), 64)],
// 			[Utils.pad(Utils.numToHex(skin), 64)],

// 			signedTx => {

// 				Eth.RPC.request('sendRawTransaction', ['0x' + signedTx], 0).then( response => {
// 					console.log(response)
// 				})
// 		})

	}

	getRival(){
		return this.generateSeed()
	}

	battle(skin, callback){
		if (!skin || skin < 1 || skin > 3) { return }
		let seed = this.generateSeed()

		let data = '0x' + Eth.hashName('battle(uint8,bytes32,address)')
			data += Utils.pad(Utils.numToHex(skin), 64)
			data += seed.substr(2)
			data += this.getRival().substr(2)

		// Eth.RPC.request('call', [{
		// 	'to':   _config.contract.address,
		// 	'data': data
		// }, 'pending'], 0).then( response => {
		// 	console.log(response)
		// 	callback(response.result)
		// })
	}


	runConfirm(){
		// seed, skin v,r,s

		console.log('runConfirm', _config.contract.address)

		let filter = web3.eth.filter({fromBlock:1077192, toBlock: 'latest', address: _config.contract.address})
		filter.watch(function(error, result){
		  console.log(result)
		  if (result && result.topics && result.topics[1].indexOf(openkey)>-1 ) {
				//на меня напали!
				console.log(result.data);
				attacker = result.data.substr(26,40);
				seed = result.data.substr(66);
				console.log("attacker",attacker);
				console.log("seed",seed);
			}
		});

	}
}
