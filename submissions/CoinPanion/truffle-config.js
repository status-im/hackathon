var bip39 = require('bip39')
var hdkey = require('ethereumjs-wallet/hdkey')
var ProviderEngine = require('web3-provider-engine')
var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js')
var Web3Subprovider = require('web3-provider-engine/subproviders/web3.js')
var Web3 = require('web3')

// Get our mnemonic and create an hdwallet
var mnemonic = 'twin junior hazard whisper organ floor teach radar van element obvious bless'
var hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))

// Get the first account using the standard hd path.
var wallet_hdpath = "m/44'/60'/0'/0/"
var wallet = hdwallet.derivePath(wallet_hdpath + '0').getWallet()
var address = '0x' + wallet.getAddress().toString('hex')

var providerUrl = 'https://ropsten.infura.io/Px0Sd1VhuxzHGf6jD4pg'
var engine = new ProviderEngine()
engine.addProvider(new WalletSubprovider(wallet, {}))
engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl)))
// engine.start() // Required by the provider engine.

module.exports = {
  migrations_directory: './migrations',
  networks: {
    development: {
      host: 'localhost',
      port: 8546,
      network_id: '*'
    },
    ropsten: {
      network_id: 3, // Official ropsten network id
      provider: engine, // Use our custom provider
      from: address // Use the address we derived
    }
  }
}
