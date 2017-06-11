MeDao.directive('bid', ['MeDao',
function(MeDao) {
	return {
		restrict: 'E',
		scope: {
            id: '=',
            medao: '='
		},
		replace: true,
		templateUrl: 'directives/bid/bidDirective.html',
		controller: function($scope){
            MeDao.getBid($scope.medao,$scope.id)
            .then(function(array){
                $scope.cancelled = array[3];
                $scope.accepted = array[4];
            });
		},
		link : function($scope, $element, $attrs) {
            
		}
	}
}]);