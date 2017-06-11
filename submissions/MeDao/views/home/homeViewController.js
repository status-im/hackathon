MeDao.controller('HomeViewController', ['$scope','$location','Web3Service','MeDaoRegistry',
function($scope,$location,Web3Service,Registry){
    console.log('Loading Home View');
    
    $scope.loaded = false;
    $scope.hasMedao = false;
    $scope.dotted = true;
    $scope.customFullscreen = false;
    $scope.showInput = false;
    
    $scope.medao = {
        name: 'Enter Your Name',
        valid: false
    };
    
    Web3Service.getCurrentAccount()
    .then(function(account){
        $scope.account = account;
        return Registry.getMeDaoAddress(account);
    }).then(function(medaoAddress){
        //console.log(medaoAddress);
        if(medaoAddress == '0x0000000000000000000000000000000000000000')
            $scope.hasMedao = false;
        else
            $scope.hasMedao = true;
        
        $scope.loaded = true;
    }).catch(function(err){
        console.error(err);
    });
    
    $scope.$watch('medao.name', function(){
        //console.log($scope.medao.name);
        if($scope.medao.name.length > 0 && $scope.medao.name != 'Enter Your Name' && $scope.medao.name != null)
            $scope.medao.valid = true;
        else
            $scope.medao.valid = false;
    });
    
    $scope.goto = function(path){
        $location.path(path);
    }

    $scope.onFocus = function(){
        $scope.dotted = false;
        if($scope.medao.name == 'Enter Your Name')
            $scope.medao.name = '';
    }
    
    $scope.onBlur = function(){
        if($scope.medao.name == '') {
            $scope.dotted = true;
            $scope.medao.name = 'Enter Your Name';
        } else {
            $scope.dotted = false;
        }
    }
}]);