'use strict';

/**
 *
 * Main module of the application.
 */


var versusApp = angular.module('VersusApp', ['ui.router', 'mobile-angular-ui']);

versusApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
   // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise(function($injector, $location){
        var loginUrl= '/';
        $injector.invoke(function($window, $timeout, $state) { 
    	    $state.go('list', {}, {reload: true});
        });
        return true;
    });
    
    
    // Now set up the states
    $stateProvider
        .state('list', {
	    url: "/",	    
	    controller: "ListCtrl as ctrl",
	    templateUrl: "js/views/pages/list.html"
	})
    
	.state('newversus', {
	    url: "/new",	    
	    controller: "NewVersusCtrl as ctrl",
	    templateUrl: "js/views/pages/new-versus.html"
	})
    	.state('myversuses', {
	    url: "/my-versuses",
	    controller: "MyVersusCtrl as ctrl",
	    templateUrl: "js/views/pages/my-versuses.html"
	})   
	.state('about', {
	    url: "/about",	    
	    templateUrl: "js/views/pages/about.html"
	});    
    
}]);



versusApp.run(function($rootScope){
   $rootScope.$on('$stateChangeStart', function(){
      $rootScope.$broadcast('$routeChangeStart');
   });
});
// redirect
// versusApp.run(['$rootScope', '$state', function($rootScope, $state) {
//     $rootScope.$on('$stateChangeStart', function(evt, to, params) {
//       if (to.redirectTo) {
//         evt.preventDefault();
//         $state.go(to.redirectTo, params, {location: 'replace', reload: true});
//       }
//     });
// }]);







