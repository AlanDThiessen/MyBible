

angular.module('starter.controllers', []).controller('AppCtrl', function($scope, $location, $ionicSideMenuDelegate) {
    const tabs = {
        bookSelect: {
            title: 'Select Book',
            path: 'templates/BookSelector.html'
        },

        search: {
            title: 'Search',
            path: 'templates/search.html'
        }
    };

    $scope.currentTab = tabs.bookSelect;

    $scope.OpenSideMenu = function(tab) {
        $scope.currentTab = tabs[tab];
        $ionicSideMenuDelegate.toggleLeft(true);
    };
});

