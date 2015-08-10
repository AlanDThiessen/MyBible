

angular.module('starter.controllers', []).controller('AppCtrl', function($scope, $location, $ionicSideMenuDelegate) {
    $scope.OpenSideMenu = function(url) {
        $location.path(url);
        $ionicSideMenuDelegate.toggleLeft(true);
    };
});

