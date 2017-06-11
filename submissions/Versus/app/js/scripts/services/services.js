var web3;

angular.module('VersusApp')   
    .service('VersusService', ['$rootScope', '$timeout', 'VersusContract_',  function($rootScope, $timeout, VersusContract_) {
	
	var service = this;	
	service.userAddress = '';
	
	
	var setup = function() {
	    

	    $timeout(function() {

		web3.eth.getAccounts(function(err, result) {
		    if (!err && result !== undefined) {
			console.log("got address", result);
			service.userAddress = result[0];
			web3.eth.defaultAccount = result[0];
			$rootScope.$broadcast("gotProfileAddress");
			service.getBalance();
		    }
		});

		service.getBalance = function() {
		    web3.eth.getBalance(service.userAddress, function(err, result) {
			if (!err && result !== undefined) {
			    console.log("got balance", result);
			    
			    service.userBalance = web3.fromWei(result.toNumber().toPrecision(6), 'ether');

			    $rootScope.$broadcast("gotProfileBalance", service.userBalance);
			}
		    });
		};
	    },1000);

	    
	    
	    VersusContract_.init();
	    
	    service.getVersuses = VersusContract_.getVersuses;
	    service.getVersus = VersusContract_.getVersus;
	    service.submitPolls = VersusContract_.submitPolls;
	    service.getUserVersuses =  VersusContract_.getUserVersuses;
	    service.addVersus = VersusContract_.addVersus;
	    
	};

	
	service.onWeb3Load = function(cb) {
	    
	    console.log("checking  web3");
	    if (web3 !== undefined) {
		cb();
		return null;
	    };
	    $timeout(function() {
		service.onWeb3Load(cb);
	    }, 500);
	};


	
	service.fromContractToVersusObj = function(obj) {
	    var res;
	    try {
		res = {
		    pairId: obj[0].toNumber(),
		    title:  web3.toUtf8(obj[1]),
		    imageSrcA: web3.toUtf8(obj[2]),
		    imageSrcB: web3.toUtf8(obj[3]),
		    imageRatingA: obj[4].toNumber(),
		    imageRatingB: obj[5].toNumber(),
		    pollMaxNumber: obj[6].toNumber(),
		    submitter: obj[7]
		};
	    }	catch(err) {
		console.log("error when parsing from smart contracts: ", err);
		res = {};
	    }
	    return res;
	};
	


	service.onWeb3Load(setup);
	
	return service; 
    }]).service('VersusContract_', ['AlertSrvc', function(AlertSrvc) {

	// address of contract
	//
	var CONTRACT_ADDRESS = '0x9684744c20734d370C9232f7E47B17E8Fcc11FFE';  // Ropsten NET

	var CONTRACT_ABI = JSON.parse('[{"constant":true,"inputs":[],"name":"likeFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getUserVersuses","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"pairId","type":"uint256"}],"name":"getVersus","outputs":[{"name":"","type":"uint256"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"versusIds","type":"uint256[]"},{"name":"chosenA","type":"bool[]"}],"name":"submitPolls","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"feedIds","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getVersuses","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"pairCounter","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"title","type":"bytes32"},{"name":"imageSrcA","type":"bytes32"},{"name":"imageSrcB","type":"bytes32"},{"name":"pollMaxNumber","type":"uint256"}],"name":"addVersus","outputs":[{"name":"","type":"uint256[]"}],"payable":true,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}]');
	
	var service = this;

	service.init = function() {
	    service.contract = web3.eth.contract(CONTRACT_ABI).at(CONTRACT_ADDRESS);
	};

	service.getVersuses = function() {
	    return new Promise(function(resolve, reject) {
		service.contract.getVersuses({},function(error, result){
		    if(!error) {
			console.log(result);
			resolve(result);
		    } else {
			console.error(error);
		    }
		});
		
	    });
	};

	service.getUserVersuses = function() {
	    return new Promise(function(resolve, reject) {
		service.contract.getUserVersuses({},function(error, result){
		    if(!error) {
			console.log(result);
			resolve(result);
		    } else {
			console.error(error);
		    }
		});
		
	    });
	};

	
	service.getVersus = function(id) {
	    return new Promise(function(resolve, reject) {
		service.contract.getVersus(id,function(error, result){
		    if(!error) {
			console.log(result);
			resolve(result);
		    } else {
			console.error(error);
		    }
		});
		
	    });
	};


	service.submitPolls = function(ids, bools) {
	    return new Promise(function(resolve, reject) {
		console.log(ids, bools);
		AlertSrvc.showLoading("Submitting transaction...", "Submitting transaction to blockchain. It can take several minutes...Please wait.");
		var ratedPairs = JSON.parse(localStorage.getItem("pairs")) || [];
		try {
		    service.contract.submitPolls(ids, bools, {gas: 1000000}, function(error, result){
			AlertSrvc.endLoading();
			if(!error) {
			    console.log(result);
			    
			    _.map(ids, function(id) {
				ratedPairs.push(id);
			    });
			    
			    localStorage.setItem("pairs", JSON.stringify(ratedPairs));
			    
			    
			    resolve(result);
			} else {
			    reject(error);
			}
		    });
		} catch(err) {
		    reject(err);		    
		}
		
		
		
	    });
	};
	

	
	
	service.addVersus = function(versus )  {
	    return new Promise(function(resolve, reject) {
		AlertSrvc.alert("Submitting transaction...", "Submitting transaction to blockchain. It can take several minutes...Please wait.").then(function() {
		    try {
			service.contract.addVersus.sendTransaction(versus.title, versus.imageSrcA, versus.imageSrcB, versus.pollMaxNumber, {value:web3.toWei(versus.cost,'ether'), gas: 1329176}, function(err, result) {
			    
			    if(err) {
			    AlertSrvc.alert('Error', err).then(function() {
				reject(err);
			    });
			} else {
			    
			    AlertSrvc.alert("Submitting transaction...", "Submitting transaction to blockchain. It can take several minutes...Please wait. Result from blockchain: " + result ).then(function() {
				resolve(result);
			    });
			}
		    });
		} catch(err) {
		    AlertSrvc.alert('Error', err).then(function() {
			reject(err);
		    });
		}

		});
		
		
		    
		});
	};
	
	
	
	return service;
	    
    }]).service('AlertSrvc', ['$rootScope', function($rootScope) {
	var service = this;
	
	service.alert = function(title, msg) {
	    return new Promise(function(resolve, reject) {
		console.log("invoking alert with:", msg);
		$rootScope.$broadcast('alert',{msg: msg, title: title});
		$rootScope.$on('alertDismissed', function() {
		    resolve();
		});
	    });
	};

	service.showLoading = function(title, msg) {
	    return new Promise(function(resolve, reject) {
		console.log("invoking showLoading with:", msg);
		$rootScope.$broadcast('loading',{msg: msg, title: title});
		$rootScope.$on('loaded', function() {
		    console.log("service got loaded");
		    resolve();
		});
	    });
	};

	service.endLoading = function() {
	    console.log("service invoking endLoading");
	    $rootScope.$broadcast('loaded');
	};

    }]);
