// Ionic Starter App

(function() {
    'use strict';

    var dependencies = [
        'ionic',
        'starter.controllers',
        'BibleDB',
        'BibleControllers'
    ];

    angular.module('starter', dependencies)
        .run(Start)
        .config(Configure);

    function Start($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }

            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    }

    function Configure($stateProvider, $urlRouterProvider) {
        $stateProvider.state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/AppRoot.html',
            controller: 'AppCtrl'
        });

        $stateProvider.state('app.MyBible', {
            url: '/myBible',
            views: {
                'menuContent': {
                    templateUrl: 'templates/BibleView.html',
                    controller: 'PassageCtrl'
                }
            }
        });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/myBible');
    }

})();

