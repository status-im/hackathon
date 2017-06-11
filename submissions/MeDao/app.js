var MeDao = angular.module('MeDao',['ngRoute','ngMaterial','ngMessages','material.svgAssetsCache','ngSanitize']);

MeDao.config(function ($routeProvider) {
	$routeProvider.
    when('/home', {
        templateUrl: 'views/home/homeView.html',
        controller: 'HomeViewController'
    }).
    when('/medao/:medaoAddress', {
        templateUrl: 'views/medao/medaoView.html',
        controller: 'MeDaoViewController'
    }).
    when('/empty', {
        templateUrl: 'views/empty/emptyView.html',
        controller: 'EmptyViewController'
    }).
	otherwise({
      redirectTo: '/home'
    });
});

MeDao.run(function() {
    console.log('MeDao loading...');
});

MeDao.filter('fromWei', [function() {
    return function(value, convertTo) {
        return web3.fromWei(value,convertTo);
    };
}]);