/**
 * Created by athiessen on 8/5/15.
 */

var bibleMod = angular.module('BibleControllers', ['ionic', 'ngSanitize']);

bibleMod.controller('PassageCtrl', ['$scope', 'BibleDB', '$ionicScrollDelegate', function($scope, BibleDB, $ionicScrollDelegate) {

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
        var matches = verse.VerseText.match(/%(.*)%/);

        if(matches) {
            heading = matches[0].replace(/%(.*)%/, '<span class="verseHeader">$1</span>');
        }

        var html = verse.VerseText.replace(/%(.*)% /, '');
        html = html.replace(/{(.*?)}/g, '<span class="implied">$1</span>');
        html = html.replace(/\|(.*?)\|/g, '<span class="wordsOfChrist">$1</span>');
        html = html.replace(/``/g, '&quot;')
        html = html.replace(/`/g, '&#39;')
        verse.html = heading + '<p><span class="verseNumber">' + verse.VerseName + '</span> ' + html + '</p>';
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
}]);


bibleMod.controller('BookSelectCtrl', ['$scope', 'BibleDB', '$ionicScrollDelegate', '$ionicSideMenuDelegate', function($scope, BibleDB, $ionicScrollDelegate, $ionicSideMenuDelegate) {

    $scope.books = [];
    $scope.maxChapters = 0;
    $scope.chapter = null;
    $scope.selectedBook = null;
    $scope.select = {
        state: "book",
        division: 0,
        book: 0,
        name: '',
        chapter: 0
    };

    var BooksUpdated = function(event, data) {
        $scope.books = data.books;
        $scope.$apply();
    };

    $scope.SelectBook = function(division, book) {
        var theBook = BibleDB.GetBook(division, book);
        if(theBook) {
            $scope.maxChapters = theBook.maxChapters;
            $scope.select.division = theBook.Division;
            $scope.select.book = theBook.Book;
            $scope.select.name = theBook.Name;
            $scope.select.state = "chapter";
            $ionicScrollDelegate.scrollTop();
        }
    };

    $scope.ResetSelect = function() {
        $scope.select.division = $scope.selectedBook.Division;
        $scope.select.book = $scope.selectedBook.Book;
        $scope.select.chapter = $scope.chapter;
        $scope.select.name = $scope.selectedBook.Name;
        $scope.select.state = "book";
        $ionicScrollDelegate.scrollTop();
    };

    $scope.GetMaxChapters = function() {
        return new Array($scope.maxChapters);
    };

    $scope.SelectChapter = function(chapter) {
        $scope.select.chapter = chapter;
        $scope.select.state = "book";
        BibleDB.SelectPassage($scope.select.division, $scope.select.book, $scope.select.chapter);
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.$on(BibleDB.events.BOOKS_CHANGED, BooksUpdated);

    $scope.$on(BibleDB.events.BOOK_SELECTED, function(event, data){
        $scope.selectedBook = $scope.books[data.index];
        $scope.ResetSelect();
    });

    $scope.$on(BibleDB.events.CHAPTER_SELECTED, function(event, data){
        $scope.chapter = data.chapter;
    });

    $scope.$on(BibleDB.events.PASSAGE_SELECTED, function(event, data){
        $scope.selectedBook = $scope.books[data.index];
        $scope.chapter = data.chapter;
        $scope.ResetSelect();
    });
}]);
