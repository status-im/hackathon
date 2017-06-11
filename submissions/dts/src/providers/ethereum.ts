import { Injectable } from '@angular/core';
import Web3 from 'web3'
import { Logger } from "angular2-logger/core";
import { environment }    from '../../environment';

declare var web3: any;

@Injectable()
export class EthereumService {
    
    private web3 : Web3;
    private provider;
    
    constructor(private logger: Logger) {

        if (typeof web3 !== 'undefined') {
            this.provider = web3.currentProvider;
        } else {
            this.provider = new Web3.providers.HttpProvider(environment.rpcurl);
        }
        this.web3 = new Web3(this.provider);
    }
 
    public getAddresses() {
        var self = this;
        
        return new Promise(function(resolve, reject) {
            self.logger.debug("getAddresses(): START");
            
            self.web3.eth.getAccounts(function(err, accs) {
                
                if (err != null) {
                    self.logger.error("getAddresses(): There was an error fetching your accounts : " + err);
                    reject("There was an error fetching your accounts : " + err);
                }

                if (accs.length == 0) {
                    self.logger.error("getAddresses(): Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                    reject("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                }
                
                self.logger.debug("getAddresses(): number of accounts fetched = " + accs.length);

                resolve(accs);
                
            }, function(error) {
                self.logger.error("getAddresses(): error="+error);
                reject(error);
            });
        });
    }
    
        public getBalance = function (address) {
            var self = this;
            
            self.logger.debug("getBalance(address="+address+"): START");
            
            return new Promise(function(resolve, reject) {

                self.web3.eth.getBalance(address, 'latest', function(err, result) {
                    if (err != null) {
                         self.logger.error("getBalance(address="+address+"): There was an error sending a transaction : " + err);
                        reject("There was an error fetching sending your transaction : " + err);
                    }
                            
                    var balance = Number(self.web3.fromWei(result, "ether"));
                    
                    self.logger.debug("getBalance(address="+address+"): balance(ether)="+balance);
                    
                    resolve(balance);
                });
            });
        };
        
        public sendTransaction = function (address, receiver, amount) {
            var self = this;
            self.logger.debug("sendTransaction(address="+address+", receiver="+receiver+", amount="+amount+"): START");
            
            return new Promise(function(resolve, reject) {
                
                self.web3.eth.sendTransaction({from: address, to: receiver, value: self.web3.toWei(amount, "ether")}, function(error) {                   
                    self.loggererror("sendTransaction(address="+address+", receiver="+receiver+", amount="+amount+"): error=" + error);
                    
                    reject(error);
                    
                }, function(err, tx) {
                    if (err != null) {
                        self.logger.error("sendTransaction(address="+address+", receiver="+receiver+", amount="+amount+"): There was an error fetching sending your transaction : " + err);
                        
                        reject("There was an error fetching sending your transaction : " + err);
                    }
                            
                    self.logger.debug("sendTransaction(address="+address+", receiver="+receiver+", amount="+amount+"): transaction=" + tx);
                    
                    resolve(tx);
                });
                
            });
        };
        
        public getNetwork = function () {
            var self = this;
            self.logger.debug("getNetwork(): START");
            
            return new Promise(function(resolve, reject) {
                
                self.web3.version.getNetwork(function(err, result) {
                    if (err != null) {
                        self.logger.error("getNetwork(): There was an error getting the network : " + err);
                        
                        reject("There was an error fetching getting the network : " + err);
                    }
                    
                    var networkInfo = {
                        'id'            : result,
                        //'name'          : ($filter('filter')(NETWORKS, {id: result})[0] === undefined) ? result : $filter('filter')(NETWORKS, {id: result})[0].name,
                        //'eherscan'      : ($filter('filter')(NETWORKS, {id: result})[0] === undefined) ? result : $filter('filter')(NETWORKS, {id: result})[0].eherscan
                        //'api'             : self.web3.version.api,
                        //'ethereum'        : self.web3.version.ethereum,
                        //'node'            : self.web3.version.node,
                        //'isConnected'     : self.web3.isConnected()
                    };

                    self.logger.debug("getNetwork(): result=" + result);
                    
                    resolve(networkInfo);
                    
                }, function(error) {
                    self.logger.error("getNetwork(): error : " + error);
                    
                    reject(error);
                });
                
            });
            
        };
        

        
        public getGasPrice = function () {
            var self = this;
            self.logger.debug("getGasPrice(): START");
            
            return new Promise(function(resolve, reject) {
                
               self.web3.eth.getGasPrice(function(err, result) {
                    if (err != null) {
                        self.logger.error("getGasPrice(): There was an error getting the gas price : " + err);
                        
                        reject("There was an error fetching getting the gas price : " + err);
                    }
                    
                    var gasPrice =  Number(self.web3.fromWei(result, "ether"));

                    self.logger.debug("getGasPrice(): gasPrice=" + gasPrice);
                    
                    resolve(gasPrice);
                    
                });
                
            });
            
        };
        
        public getBlockNumber = function () {
            var self = this;
            self.logger.debug("getBlockNumber(): START");
            
            return new Promise(function(resolve, reject) {
                
               self.web3.eth.getBlockNumber(function(err, result) {
                    if (err != null) {
                        self.logger.error("getBlockNumber(): There was an error getting the blockNumber : " + err);
                        
                        reject("There was an error fetching getting the gas price : " + err);
                    }
                    
                    var blockNumber =  Number(result);

                    self.logger.debug("getBlockNumber(): blockNumber=" + blockNumber);
                    
                    resolve(blockNumber);
                    
                });
                
            });
            
        };
        
        public getTransactionReceipt = function (tx, gasPrice) {
            var self = this;
            
            self.logger.debug("ethereum.js", "getTransactionReceipt(tx="+tx+", gasPrice="+gasPrice+"): START");
            
            return new Promise(function(resolve, reject)     {
                
               self.web3.eth.getTransactionReceipt(tx, function(err, result) {
                    if (err != null) {
                        self.logger.error("getTransactionReceipt(tx="+tx+", gasPrice="+gasPrice+"): There was an error getting the transaction receipt : " + err);
                        
                        reject("There was an error fetching getting the transaction receipt : " + err);
                    }
                    
                    
					var receipt = {
						'transactionID'	: result.transactionHash,
						'blockNo'		: result.blockNumber,
						'gasUsed'		: Number(result.gasUsed) * Number(gasPrice)
					};
					
					self.logger.debug("getTransactionReceipt(tx="+tx+", gasPrice="+gasPrice+"): transactionHash=" + result.transactionHash);
                    
                    resolve(receipt);
                    
                });
                
            });
            
        };
        
        /**
         * Checks if the given string is an address
         *
         * @method isAddress
         * @param {String} address the given HEX adress
         * @return {Boolean}
         * @source http://ethereum.stackexchange.com/questions/1374/how-can-i-check-if-an-ethereum-address-is-valid
        */
        public validateAddress = function(address) {
            var self = this;
            
            self.logger.debug("validateAddress(address="+address+"): START");

            if (!/^(0x)?[0-9a-f]{40}$/i.test(address.toLowerCase())) {
                // check if it has the basic requirements of an address
                return false;
            } else {
                return true;
            }
        };
 
}