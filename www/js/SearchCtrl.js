/**
 * Created by athiessen on 9/26/15.
 */

(function() {
    'use strict';

    angular.module('BibleControllers')
        .controller('SearchCtrl', SearchCtrl);


    SearchCtrl.$inject = ['BibleDB', '$ionicScrollDelegate'];

    function SearchCtrl(BibleDB, $ionicScrollDelegate) {
        var vm = this;

    }

})();

