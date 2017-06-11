
angular.module('VersusApp')   
    .controller('ListCtrl', ['VersusService',  '$scope', '$state','$timeout','AlertSrvc', function(VersusService , $scope , $state, $timeout, AlertSrvc) {
	
	var ctrl = this;
	ctrl.canConfirm = false;
	ctrl.feedMode = true;
	ctrl.feed = [];
	ctrl.fee = 0.01;
	ctrl.ratedCount = 0;


	AlertSrvc.showLoading('Loading...', 'Loading feed... Please wait').then(function() {
	    console.log("feed loaded", ctrl.feed);
	    $scope.$digest();		
	});

	
	var fetchFeed = function() {
	    
	    ctrl.feed = [];
	    ctrl.canConfirm = false;
	    ctrl.feedMode = true;
	    ctrl.ratedCount = 0;
	    var ratedPairs = JSON.parse(localStorage.getItem("pairs")) || [];
		
	    VersusService.getVersuses()
	    	.then(function(result) {
	    	    console.log(result);
	    	    var fromId = result[0].c[0];
	    	    var toId = result[1].c[0];
	    	    var lst = [];
	    	    for (var i=fromId, j=0; i<toId && j<100; i++, j++ ) {
			if (!_.contains(ratedPairs, i)) {			
	    		    lst.push(i);
			} else {
			    j -=1;
			}
	    	    }
	    	    console.log("fromId: ", fromId);
	    	    console.log("toId: ", toId);
	    	    console.log("lst: ", lst);
	    	    return lst;
	    	}).then(function(vIds) {

		    
	    	    var vPromises = _.map(vIds, function(vId) {
			return 	VersusService.getVersus(vId);
		    });
		    Promise.all(vPromises).then(function(versuses) {
			console.log("all promises resolved: ", versuses);
			_.map(versuses, function(d) {
	    		    console.log(d);
	    		    var versus = VersusService.fromContractToVersusObj(d);
	    		    console.log(versus);
			    if (versus.submitter !== VersusService.userAddress 
				&& versus.pollMaxNumber > (versus.imageRatingA + versus.imageRatingB)
				& versus.pollMaxNumber < 100000 // don't show buggy data from blockchain
			       ) {
	    			ctrl.feed.push(versus);
			    }
	    		});
			AlertSrvc.endLoading();
	    	    });
	    	});	    
	};

	
	ctrl.tap = function(versus, side) {
	    if (!versus.selected) {
		var isSelected = true;
		versus.selected = isSelected;
		if (isSelected) {
		    versus.selectedA = "A" === side;
		    versus.unselectedA = ! versus.selectedA;
		    
	            versus.selectedB = "B" === side;
		    versus.unselectedB = ! versus.selectedB;
		    
		    ctrl.canConfirm = true;
		    ctrl.ratedCount += 1;
		}

	    }
	};


	ctrl.submitPolls = function() {
	    
	    var versusIds = [];
	    var chosenA = [];
	    var selectedFeeds = _.filter(ctrl.feed, function(versus) { return versus.selected;});
	    _.map(selectedFeeds, function(feed) {
	    	versusIds.push(feed.pairId);
	    	chosenA.push(feed.selectedA);
	    });
	    
	    
	    ctrl.canConfirm = false;
	    ctrl.feedMode = true;
	    ctrl.feed = [];

	    
	    console.log("ctrl.submitting polls: ", versusIds, chosenA);
	    
	    VersusService.submitPolls(versusIds, chosenA).then(function(data) {
		
	    	console.log("polls submitted");
	    	console.log(data);

	    	AlertSrvc.alert("Success", "Hooray! Payout claimed, check your balance in several minutes. Note that transaction can take some time. Please wait and refresh page later.").then(function() {
	    	    $state.reload();
		});
	    }).catch(function(error) {
		AlertSrvc.alert("Error", "Oops! something went wrong. Here is the error: " + error).then(function() {
	    	    $state.reload();
		});
	    });
	};
	
	
	// initing page
	$timeout(function() {
	    	VersusService.onWeb3Load(fetchFeed);
	}, 500);
	
	
    }]).controller('NavController', ['$state', function($state) {
	navCtrl = this;
	navCtrl.refreshPage = function() {
	    $state.reload();
	};
	

   }]).controller('ProfileCtrl', ['VersusService', '$rootScope', '$scope', function(VersusService, $rootScope, $scope) {
	var ctrl = this;
	ctrl.address = 'dd';
	ctrl.log = 'log inited';
       
       
	$rootScope.$on('gotProfileAddress', function() {
	    var msg = "got address in profile Ctrl <br>" + VersusService.userAddress;
	    console.log(msg);
	    ctrl.log += msg;

	    ctrl.address = VersusService.userAddress;
	});
	$rootScope.$on('gotProfileBalance', function() {
	    var msg = "got balance in profile Ctrl <br>" + VersusService.userBalance;
	    console.log(msg);
	    ctrl.log += msg;

	    ctrl.balance = VersusService.userBalance;
	    $scope.$digest();
	});

	
   }]).controller('NewVersusCtrl', ['$state','VersusService', 'AlertSrvc', function ($state, VersusService, AlertSrvc) {
    	var ctrl = this;
       ctrl.feePerPerson = 0.01;
       ctrl.peopleNum = 10;
       ctrl.error = true;
       ctrl.errorMsg = '';
       
	ctrl.onpeopleNumChange = function(val) {
	    if (val < 10) {
		ctrl.peopleNum = 10;
	    };
	    ctrl.fee = ctrl.peopleNum * ctrl.feePerPerson;
	};

       ctrl.checkUrl = function(val) {
	   if ( (val || "").length < 1 ) {
	       return false;
	   }

	   var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
	   var regex = new RegExp(expression);
	   
	   
	   if ((val || "").length > 0 && val.length > 32) {
	       ctrl.error = true;
	       ctrl.errorMsg = 'Link to image is too big. Only short links are supported at the moment (less than 32 chars)';
	       return false;
	   }
	   console.log(val)
	   if ((val || "").length > 0 && val.match(regex)) {
	       console.log("match ok");
	   } else {
	       if (val) {
		   ctrl.error = true;
		   ctrl.errorMsg = 'Check your image links'
		   return false;
	       } 
	   }
	   return true;
	   
       };

       ctrl.checkTitle = function(val) {

	   if ( (val || "").length < 1 ) {
	       return false;
	   }
	   
	   if ((val || "").length > 0 && val.length > 32) {
	       ctrl.error = true;
	       ctrl.errorMsg = 'Title is too long. Only short titles are supported at the moment (less than 32 chars)';
	       return false
	   }
	   return true;
       }
       
       ctrl.checkForm = function() {
	   ctrl.errorMsg = '';
	   ctrl.error = false;
	   if (!(ctrl.checkTitle(ctrl.title) &&
	       ctrl.checkUrl(ctrl.imageSrcA) &&
	   	 ctrl.checkUrl(ctrl.imageSrcB))) {
	       ctrl.error = true;
	   }
	};

       

       ctrl.submit = function() {
	   if (!ctrl.error) {
	    var versus = {
		title: ctrl.title,		
		imageSrcA: ctrl.imageSrcA,
		imageSrcB: ctrl.imageSrcB,
		pollMaxNumber: ctrl.peopleNum
	    };
	    console.log("submitting versus: ", versus);
	    
	    versus.cost = versus.pollMaxNumber * ctrl.feePerPerson;
	    
	    VersusService.addVersus(versus)
		.then(function(data) {
		    console.log(data);
		    $state.go('myversuses');
		}).catch(function() {
		    $state.go('list');
		});
	   }
	};

	ctrl.onpeopleNumChange();
	

	
    }]).controller('MyVersusCtrl', ['VersusService', '$scope', function(VersusService, $scope) {
	var ctrl = this;
	ctrl.feed = [];
	
	var fetchFeed = function() {
	    VersusService.getUserVersuses()
	    	.then(function(result) {
		    lst = _.map(result, function(r) {
			return r.c[0];
		    });
	    	    return lst;
	    	}).then(function(vIds) {
	    	    _.map(vIds, function(vId) {
			
	    		VersusService.getVersus(vId).then(function(d) {
	    		    console.log(d);
	    		    var versus = VersusService.fromContractToVersusObj(d);
	    		    //console.log("max num", versus.maxPollNumber);
			    
			    // don't show buggy data from smart contract
			    if (versus.pollMaxNumber < 100000) {
	    			ctrl.feed.push(versus);
				$scope.$digest();

			    };
			    
	    		});
	    	    });
	    	});	
	};

	VersusService.onWeb3Load(fetchFeed);

    }]).controller('AppController', ['$rootScope', '$scope', function($rootScope, $scope) {
	var appCtrl = this;
	appCtrl.showAlert = false;
	appCtrl.msg = '';
	appCtrl.title = '';
	appCtrl.showButton = false;

	
	$rootScope.$on('alert', function(event, args) {
	    console.log("got msg in alert: ", args.msg);
	    appCtrl.msg = args.msg;
	    appCtrl.title = args.title;
	    appCtrl.showAlert = true;
	    appCtrl.showButton = true;
	    $scope.$digest();
	});


	$rootScope.$on('loading', function(event, args) {
	    console.log("got msg in loading: ", args.msg);
	    appCtrl.msg = args.msg;
	    appCtrl.title = args.title;
	    appCtrl.showAlert = true;
	    appCtrl.showButton = false;
	    $scope.$digest();
	});


	
	$rootScope.$on('loaded', function() {
	    //console.log("got msg in alert: ", args.msg);
	    appCtrl.msg = '';
	    appCtrl.title = '';
	    appCtrl.showAlert = false;
	    appCtrl.showButton = false;
	    
	    $scope.$digest();
	});
	
	
	appCtrl.dismiss = function() {
	    appCtrl.showAlert = false;
	    appCtrl.msg = '';
	    appCtrl.title = '';
	    $rootScope.$broadcast('alertDismissed');
	    $scope.$digest();
	};
	
	
	
    }]);


	
