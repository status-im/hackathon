MeDao.service( 'Web3Service',['$q', function ($q) {
    console.log('Loading Web3Service');
    
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
       web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    
    var accounts = {
        current: null
    };
    
    var service = {
		getCurrentAccount: function(){
            var deferred = $q.defer();
            
            var interval = setInterval(function(){
                accounts.current = web3.eth.accounts[0];
                
                if(accounts.current != null && accounts.current != '0x0000000000000000000000000000000000000000'){
                    deferred.resolve(accounts.current);
                    clearInterval(interval);
                }
            }, 100);
            
            return deferred.promise;
        },
        getEtherBalance: function(account){
            var deferred = $q.defer();
            var async_getBalance = web3.eth.getBalance(account, 
            function(err,etherBalanceInWei){
                if(!err){
                    deferred.resolve(etherBalanceInWei);
                } else {
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        },
		getTransactionReceipt: function(txHash){
            var deferred = $q.defer();
            var async_filter = web3.eth.filter('latest', 
            function(err, blockHash) {
                if(!err){
                    var async_reciept = web3.eth.getTransactionReceipt(txHash, 
                    function(err,receipt){
                        if(!err){
                            if(receipt !== null){
                                async_filter.stopWatching();
                                //console.log(receipt);
                                deferred.resolve(receipt);
                            } else {
                                console.log("Tx not included in this block. Waiting for reciept.");
                            }
                        } else {
                            async_filter.stopWatching();
                            deferred.reject(err);
                        } 
                    });
                } else {
                    async_filter.stopWatching();
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        },
        getCurrentBlockNumber: function(){
            var deferred = $q.defer();
            var async_getCurrentBlock = web3.eth.getBlockNumber(
            function(err,number){
                if(!err){
                    deferred.resolve(number);
                } else {
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        },
        getBlock: function(blockNumber){
            var deferred = $q.defer();
            var async_getBlock = web3.eth.getBlock(
            function(err,blockData){
                if(!err){
                    deferred.resolve(blockData);
                } else {
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        },
        getGasPrice: function(gasPrice) {
            var deferred = $q.defer();
            
            web3.eth.getGasPrice(function(err, gasPrice){
                if(!err){
                    var gwei = web3.fromWei(gasPrice,'gwei');
                    if(gwei > 20)
                        gasPrice = web3.toWei(20,'gwei');
                    
                    deferred.resolve(gasPrice);
                }
                else
                    deferred.reject(err);
            });
            
            return deferred.promise;
        }
	};

	return service;
}]);