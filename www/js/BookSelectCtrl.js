/**
 * Created by athiessen on 9/26/15.
 */


(function() {
    'use strict';

    angular.module('BibleControllers')
        .controller('BookSelectCtrl', BookSelectCtrl);

    BookSelectCtrl.$inject = ['$scope', 'BibleDB', '$ionicScrollDelegate', '$ionicSideMenuDelegate'];

    function BookSelectCtrl($scope, BibleDB, $ionicScrollDelegate, $ionicSideMenuDelegate) {
        $scope.books = BibleDB.GetBooks();
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

        var Init = function() {
            var passage = BibleDB.GetPassage();
            $scope.chapter = passage.chapter;

            if(passage.index != -1) {
                $scope.selectedBook = $scope.books[passage.index];
                $scope.ResetSelect();
            }
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

        Init();
    }

})();
