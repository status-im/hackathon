// 'use strict';

// /**
//  * @ngdoc service
//  * @name dopplerApp.auth
//  * @description
//  * # auth
//  * Service in the dopplerApp.
//  */

// angular.module('DopplrApp')
//     .service('DopplrContracts', ["$q", function($q) {
	
// 	var service = this;
	

// 	// fetching next photos to rate from Ethereum blockchain
// 	service.fetchNextDapplers = function() {
// 	    return $q(function(resolve, reject) {
		
// 		// TODO: remove hardcoded data 
// 		var data = {dapplers: [
// 		    {img: "http://www.lsa.umich.edu/english/graphics/facultyImgs/2015/EmilyMcLaughlin_2015R.jpg", address: "0x298403480"},
// 		    {img: "https://www.lsa.umich.edu/english/graphics/facultyImgs/2015/JohnBuckley_2015R.jpg", address: "0x298403481"},
// 		    {img: "https://www.lifbi.de/UserImages//1412.png", address: "0x298403482"},
// 		    {img: "https://www.engineering.cornell.edu/engineering/customcf/iws_ai_faculty_display/ai_images/caa238-profile.jpg", address: "0x298403483"}
// 		]};
// 		resolve(data);
// 	    });
// 	};

// 	// fetching matches from blockchain
// 	service.fetchMatches = function() {
// 	    return $q(function(resolve, reject) {
		
// 		// TODO: remove hardcoded data 
// 		var data = {
// 		    rankedCount: 23,
// 		    matches: [{ 
// 			username: "Samanthas", 
// 			matchedAt: "1496579553563",
// 			userId: "", // not sure with this
// 			unlockCost: 5,
// 			rating: 5,
// 			profileImg: "",
// 			unlocked: false			
// 		    }, { 
// 			username: "Mary", 
// 			matchedAt: "1496579553563",
// 			userId: "", // not sure with this
// 			unlockCost: 5,
// 			rating: 4,
// 			profileImg: "https://cfl.dropboxstatic.com/static/images/jobs/jobs_2015/profile-home-makers-vflWnMtf7.jpg",
// 			unlocked: true
// 		    },{ 
// 			username: "Mary 2", 
// 			matchedAt: "1496579553563",
// 			userId: "", // not sure with this
// 			unlockCost: 5,
// 			rating: 3,
// 			profileImg: "http://businessinsavannah.com/sites/default/files/field/photos/gratias_113270_blue_3.jpg",
// 			unlocked: true
// 		    }]
// 		};
// 		resolve(data);
// 	    });
// 	};


// 	return service;
//     }]);
