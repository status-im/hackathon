/*
 * App settings
 */

let current_network = 'ropsten'
const networks = {
	'custom': {
		enabled:       true,
		name:          'Custom RPC',
		rpc_url:       'http://localhost:8545',
		erc20_address: '0x95a48dca999c89e4e284930d9b9af973a7481287',
		etherscan_url: '#custom_rpc',
	},
	'ropsten': {
		enabled:       true,
		name:          'Ropsten Test Network',
		rpc_url:       'https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl',
		erc20_address: '0x95a48dca999c89e4e284930d9b9af973a7481287',
		etherscan_url: 'https://ropsten.etherscan.io'
	},
	'rinkeby': {
		enabled:       true,
		name:          'Rinkeby Test Network',
		rpc_url:       'https://rinkeby.infura.io/JCnK5ifEPH9qcQkX0Ahl',
		erc20_address: '0xba2f1399df21c75ce578630ff9ed9285b2146b8d',
		etherscan_url: 'https://rinkeby.etherscan.io'
	},

	'mainnet': {
		enabled: false,
		name:    'Main Ethereum Network',
		rpc_url: 'https://infura.io/JCnK5ifEPH9qcQkX0Ahl',
		etherscan_url: 'https://etherscan.io'
	},
}

const firebase = {
	apiKey:            "AIzaSyAz1qr7gngalx-lBka6jWw_dSuEQi-CvcE",
	authDomain:        "bankrollapp-dc105.firebaseapp.com",
	databaseURL:       "https://bankrollapp-dc105.firebaseio.com",
	projectId:         "bankrollapp-dc105",
	storageBucket:     "",
	messagingSenderId: "377080181945"
}

module.exports = {
	firebase        : firebase,
	wallet_pass     : '1234',

	network         : current_network,
	networks        : networks,

	rpc_url         : networks[current_network].rpc_url,

	contract        : require('./contract.js').default,

	confirm_timeout : 7000,
	api_url         : 'https://platform.dao.casino/api/',
}
