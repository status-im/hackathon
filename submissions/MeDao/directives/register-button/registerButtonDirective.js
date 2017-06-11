MeDao.directive('registerButton', ['$mdDialog','$location','MeDaoRegistry','Web3Service',
function($mdDialog,$location,Registry,Web3Service) {
	return {
		restrict: 'E',
		scope: {
            medaoName: '=',
            disabled: '='
		},
		replace: true,
		templateUrl: 'directives/register-button/registerButtonDirective.html',
		controller: function($scope){
            $scope.buttonText = "Register";
            $scope.thinking = 0;
            $scope.waiting = false;
            
            $scope.startThinking = function() {
                $scope.thinking++;
                $scope.buttonText = '.'
                $scope.interval = setInterval(function(){
                    $scope.$apply(function(){
                        $scope.thinking++;
                        $scope.buttonText = $scope.buttonText + '.';
                        if($scope.thinking == 6) {
                            $scope.buttonText = '.'
                            $scope.thinking = 1;
                        }
                    });
                }, 1000);
            }

            $scope.warn = function(ev) {
                $scope.waiting = true;
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'directives/register-button/warning-dialog.template.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    fullscreen: true // Only for -xs, -sm breakpoints.
                }).then(function(answer) {
                    $scope.register();
                }, function() {
                    console.log('You cancelled the dialog.');
                    $scope.waiting = false;
                });
            };

            function DialogController($scope, $mdDialog) {
                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.answer = function(answer) {
                    $mdDialog.hide(answer);
                };
            };

            $scope.goto = function(path){
                $location.path(path);
            }

            $scope.register = function(){

                Registry.register($scope.medaoName).
                then(function(txHash){
                    $scope.startThinking();
                    return Web3Service.getTransactionReceipt(txHash);
                }).then(function(receipt){
                    $scope.thinking = 0;
                    return Web3Service.getCurrentAccount();
                }).then(function(account){
                    $scope.account = account;
                    return Registry.getMeDaoAddress(account);
                }).then(function(medaoAddress){
                    clearInterval($scope.interval);
                    $scope.goto('medao/'+$scope.account);
                }).catch(function(err){
                    clearInterval($scope.interval);
                    console.error(err);
                });
            }
		},
		link : function($scope, $element, $attrs) {
            
		}
	}
}]);