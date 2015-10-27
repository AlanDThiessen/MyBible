
(function() {
    'use strict';

    angular.module('starter')
        .controller('AppCtrl', AppCtrl);

    AppCtrl.$inject = ['$scope', '$ionicSideMenuDelegate'];

    function AppCtrl($scope, $ionicSideMenuDelegate) {
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
    }

})();

