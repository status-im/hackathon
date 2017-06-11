MeDao.service('MeDao', ['$q','Web3Service',
function ($q,Web3Service) {
    //console.log('Loading MeDao Register');
    
    var MeDao = {
        contract: web3.eth.contract(
           [{"constant":false,"inputs":[{"name":"depositAddress","type":"address"}],"name":"acceptHighestBid","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"auction_period","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"burnAmount","type":"uint256"},{"name":"metadataHash","type":"string"}],"name":"submitProofOfWork","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"cooldown_timestamp","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newDepositAddress","type":"address"}],"name":"updateDepositAddress","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"bid_id","type":"uint256"}],"name":"getBidValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"Founder","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"total_teirs","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"reward","type":"uint8"}],"name":"setWeeklyAuctionReward","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"teir","outputs":[{"name":"teir_above","type":"uint256"},{"name":"value","type":"uint256"},{"name":"teir_below","type":"uint256"},{"name":"front_of_line_id","type":"uint256"},{"name":"back_of_line_id","type":"uint256"},{"name":"line_length","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"bottom_teir","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"Token","type":"address"}],"name":"withdrawERC20Token","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bids","outputs":[{"name":"id","type":"uint256"},{"name":"owner","type":"address"},{"name":"value","type":"uint256"},{"name":"cancelled","type":"bool"},{"name":"accepted","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"withdraw_address","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"current_bids_open","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"withdrawAddress","type":"address"},{"name":"CloneableToken","type":"address"},{"name":"_tokenName","type":"string"},{"name":"_decimals","type":"uint8"},{"name":"_symbol","type":"string"},{"name":"_snapshotBlock","type":"uint256"},{"name":"_transfersEnabled","type":"bool"}],"name":"setupToken","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"burnMinimum","type":"uint256"}],"name":"setBurnMinimum","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"startAuction","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdrawEther","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"total_proof_of_work","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"bid_id","type":"uint256"}],"name":"getBidder","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"top_teir","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"touchingTeir","type":"uint256"}],"name":"placeBid","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"total_bids_made","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"bidder","type":"address"}],"name":"getAllBids","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"weekly_auction_reward","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"bid_id","type":"uint256"}],"name":"removeBid","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"Token","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"scheduled_auction_timestamp","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"bidders","outputs":[{"name":"current_bids_open","type":"uint256"},{"name":"total_bids_made","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"founder","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"winner","type":"address"},{"indexed":false,"name":"ether_bid","type":"uint256"}],"name":"AuctionWinner_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"metadataHash","type":"string"}],"name":"ProofOfWork_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"deposit_address","type":"address"}],"name":"NewDepositAddress_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"new_auction_reward","type":"uint256"}],"name":"NewWeeklyAuctionReward_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"bidder","type":"address"},{"indexed":false,"name":"bid_id","type":"uint256"},{"indexed":false,"name":"value","type":"uint256"}],"name":"NewBid_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Payable_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"withdrawAddress","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"WithdrawEther_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"withdrawAddress","type":"address"},{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"WithdrawToken_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"withdraw_address","type":"address"}],"name":"NewWithdrawAddress_event","type":"event"}]
        )
    };
    
    var service = {
        getVersion: function(medaoAddress){
            var deferred = $q.defer();
            var MeDaoInstance = MeDao.contract.at(medaoAddress);
    
            MeDaoInstance.version(
            function(err, tokenAddress){
                if(!err)
                    deferred.resolve(tokenAddress);
                else 
                    deferred.reject(err);
            });
            
            return deferred.promise;
        },
        getToken: function(medaoAddress){
            var deferred = $q.defer();
            var MeDaoInstance = MeDao.contract.at(medaoAddress);
    
            MeDaoInstance.Token(
            function(err, tokenAddress){
                if(!err)
                    deferred.resolve(tokenAddress);
                else 
                    deferred.reject(err);
            });
            
            return deferred.promise;
        },
        startAuction: function(medaoAddress){
            var deferred = $q.defer();
            var MeDaoInstance = MeDao.contract.at(medaoAddress);
            
            Web3Service.getCurrentAccount().then(
            function(account){
                MeDaoInstance.startAuction({from:account},
                function(err, tx){
                    if(!err)
                        deferred.resolve(tx);
                    else 
                        deferred.reject(err);
                });
            }).catch(function(err){
                deferred.reject(err);
            });
            
            return deferred.promise;
        },
        getAuctionReward: function(medaoAddress){
            var deferred = $q.defer();
            var MeDaoInstance = MeDao.contract.at(medaoAddress);
    
            MeDaoInstance.weekly_auction_reward(
            function(err, workHours){
                if(!err)
                    deferred.resolve(workHours);
                else 
                    deferred.reject(err);
            });
            
            return deferred.promise;
        },
        getAuctionTimestamp: function(medaoAddress){
            var deferred = $q.defer();
            var MeDaoInstance = MeDao.contract.at(medaoAddress);
    
            MeDaoInstance.scheduled_auction_timestamp(
            function(err, timestamp){
                if(!err)
                    deferred.resolve(timestamp);
                else 
                    deferred.reject(err);
            });
            
            return deferred.promise;
        },
        getAuctionPeriod: function(medaoAddress){
            var deferred = $q.defer();
            var MeDaoInstance = MeDao.contract.at(medaoAddress);
    
            MeDaoInstance.auction_period(
            function(err, period){
                if(!err)
                    deferred.resolve(period);
                else 
                    deferred.reject(err);
            });
            
            return deferred.promise;
        },
        getProofOfWork: function(medaoAddress){
            var deferred = $q.defer();
            var MeDaoInstance = MeDao.contract.at(medaoAddress);
    
            MeDaoInstance.total_proof_of_work(
            function(err, totalPOW){
                if(!err)
                    deferred.resolve(totalPOW);
                else 
                    deferred.reject(err);
            });
            
            return deferred.promise;
        },
        getHighestBid: function(medaoAddress){
            var deferred = $q.defer();
            var MeDaoInstance = MeDao.contract.at(medaoAddress);
            
            MeDaoInstance.top_teir(
            function(err, highestBid){
                if(!err){
                    //console.log(highestBid.toNumber());
                    deferred.resolve(highestBid);
                } else {
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        },
        getTeirInfo: function(medaoAddress,teir){
            var deferred = $q.defer();
            var MeDaoInstance = MeDao.contract.at(medaoAddress);
            
            MeDaoInstance.teir(teir,
            function(err, teirInfo){
                if(!err){
                    deferred.resolve(teirInfo);
                } else {
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        },
        getTotalTeirs: function(medaoAddress){
            var deferred = $q.defer();
            var MeDaoInstance = MeDao.contract.at(medaoAddress);
            
            MeDaoInstance.total_teirs(
            function(err, total){
                if(!err){
                    deferred.resolve(total);
                } else {
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        },
        getBid: function(medaoAddress,bid_id){
            var deferred = $q.defer();
            var MeDaoInstance = MeDao.contract.at(medaoAddress);
            
            MeDaoInstance.bids(bid_id,
            function(err, bidInfo){
                if(!err){
                    deferred.resolve(bidInfo);
                } else {
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        },
        getAllBids: function(medaoAddress,bidderAddress){
            var deferred = $q.defer();
            var MeDaoInstance = MeDao.contract.at(medaoAddress);
            
            MeDaoInstance.getAllBids(bidderAddress,
            function(err, allBids){
                if(!err){
                    deferred.resolve(allBids);
                } else {
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        },
        placeBid: function(medaoAddress, amountInWei, touchingTeir){
            var deferred = $q.defer();
            var MeDaoInstance = MeDao.contract.at(medaoAddress);
            
            Web3Service.getCurrentAccount()
            .then(function(account){
                //console.log(account,amountInWei,touchingTeir);
                MeDaoInstance.placeBid(touchingTeir, {from:account,value:amountInWei},
                function(err,tx){
                    if(!err){
                        deferred.resolve(tx);
                    } else {
                        deferred.reject(err);
                    }
                })
            });
            
            return deferred.promise;
        },
        removeBid: function(medaoAddress, bid_id){
            var deferred = $q.defer();
            var MeDaoInstance = MeDao.contract.at(medaoAddress);
            
            Web3Service.getCurrentAccount()
            .then(function(account){
                MeDaoInstance.removeBid(bid_id, {from:account},
                function(err,tx){
                    if(!err){
                        deferred.resolve(tx);
                    } else {
                        deferred.reject(err);
                    }
                })
            });
            
            return deferred.promise;
        },
        submitProofOfWork: function(medaoAddress, amountInWei, comment){
            var deferred = $q.defer();
            var MeDaoInstance = MeDao.contract.at(medaoAddress);
            
            Web3Service.getCurrentAccount()
            .then(function(account){
                //console.log(medaoAddress, amountInWei, account);
                MeDaoInstance.submitProofOfWork(amountInWei, comment, {from:account},
                function(err,tx){
                    if(!err){
                        deferred.resolve(tx);
                    } else {
                        deferred.reject(err);
                    }
                })
            });
            
            return deferred.promise;
        },
        setWeeklyAuctionReward: function(medaoAddress,hours) {
            var deferred = $q.defer();
            var MeDaoInstance = MeDao.contract.at(medaoAddress);
            
            Web3Service.getCurrentAccount()
            .then(function(account){
                MeDaoInstance.setWeeklyAuctionReward(hours, {from:account},
                function(err,tx){
                    if(!err){
                        deferred.resolve(tx);
                    } else {
                        deferred.reject(err);
                    }
                })
            });
            
            return deferred.promise;
        }
    }
    
    return service;
}]);