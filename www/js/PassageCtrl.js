/**
 * Created by athiessen on 8/5/15.
 */


(function() {
    'use strict';

    angular.module('BibleControllers', ['ionic', 'ngSanitize'])
        .controller('PassageCtrl', PassageCtrl);

    PassageCtrl.$inject = ['$scope', 'BibleDB', '$ionicScrollDelegate'];

    function PassageCtrl($scope, BibleDB, $ionicScrollDelegate) {
        $scope.verses = [];
        $scope.bookName = '';
        $scope.chapter = '';

        var VersesUpdated = function(event, data) {
            $scope.verses = data.verses;
            $scope.bookName = data.bookName;
            $scope.chapter = data.chapter;
            $scope.verses.forEach(StyleVerse);
            $ionicScrollDelegate.scrollTop();
            $scope.$apply();
        };

        var StyleVerse = function(verse, index, array) {
            var heading = '';
            var description = '';
            var headingMatches = verse.VerseText.match(/%(.*?)%/);
            var descriptionMatches = verse.VerseText.match(/#(.*?)#/);

            if(headingMatches) {
                heading = headingMatches[0].replace(/%(.*?)%/, '<span class="verseHeader">$1</span>');
            }

            if(descriptionMatches) {
                description = descriptionMatches[0].replace(/#(.*?)#/, '<span class="description">$1</span>');
            }

            var html = verse.VerseText.replace(/(%|#)(.*?)(%|#)\s*/g, '');
            html = html.replace(/{(.*?)}/g, '<span class="implied">$1</span>');
            html = html.replace(/\|(.*?)\|/g, '<span class="wordsOfChrist">$1</span>');
            html = html.replace(/``/g, '&quot;');
            html = html.replace(/`/g, '&#39;');
            verse.html = heading + '<p>' + description + '</p><p><span class="verseNumber">' + verse.VerseName + '</span> ' + html + '</p>';
        };

        $scope.IncrementChapter = function() {
            BibleDB.SelectChapter($scope.chapter + 1);
        };

        $scope.DecrementChapter = function() {
            BibleDB.SelectChapter($scope.chapter - 1);
        };

        $scope.$on(BibleDB.events.PASSAGE_CHANGED, VersesUpdated);

        $scope.$on(BibleDB.events.BOOK_SELECTED, function(event, data){
            BibleDB.LoadText();
        });

        $scope.$on(BibleDB.events.CHAPTER_SELECTED, function(event, data) {
            BibleDB.LoadText();
        });

        $scope.$on(BibleDB.events.PASSAGE_SELECTED, function(event, data) {
            BibleDB.LoadText();
        });
    }

})();


