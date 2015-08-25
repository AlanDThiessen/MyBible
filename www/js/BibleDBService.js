/**
 * Created by athiessen on 8/5/15.
 */

angular.module('BibleDB', ['ionic']).factory('BibleDB', ['$rootScope', '$window', function($rootScope, $window) {
    var myBible = {};
    var DB_NAME = "web.db";
    var db;
    var books = [];
    var verses = [];
    var passage = {
        division: 1,
        book: 1,
        chapter: 1,
        index: -1
    };


    var Init = function() {
        if($window.localStorage.division) {
            passage.division = $window.localStorage.division;
        }

        if($window.localStorage.book) {
            passage.book = $window.localStorage.book;
        }

        if($window.localStorage.chapter) {
            passage.chapter = $window.localStorage.chapter;
        }

        UpdateLocalStorage();
    };


    var UpdateLocalStorage = function() {
        $window.localStorage.setItem('division', passage.division);
        $window.localStorage.setItem('book', passage.book);
        $window.localStorage.setItem('chapter', passage.chapter);
    };

    myBible.events = {
        PASSAGE_CHANGED: 'BibleDB.PassageChanged',
        BOOKS_CHANGED: 'BibleDB.BooksChanged',
        BOOK_SELECTED: 'BibleDB.BookSelected',
        CHAPTER_SELECTED: 'BibleDB.ChapterSelected',
        PASSAGE_SELECTED: 'BibleDB.PassageSelected'
    };


    var OpenDB = function() {
        db = $window.sqlitePlugin.openDatabase({name: DB_NAME, createFromLocation: 1});
    };

    var RunQuery = function(query, transaction, callBack) {
        if(db !== null) {
            if(transaction) {
                transaction.executeSql(query, [], callBack);
            }
            else {
                db.transaction(function (tx) {
                    tx.executeSql(query, [], callBack);
                });
            }
        }
        else {
            console.log("Database not opened");
        }
    };

    var RetrieveBookNames = function() {
        RunQuery('SELECT * FROM BookNames ORDER BY Division, Book;', undefined, function(tx, res) {


            books = [];
            for(var cntr = 0; cntr < res.rows.length; cntr++) {
                books.push(res.rows.item(cntr));
            }

            RunQuery('SELECT Division, Book, max(Chapter) AS MaxChapter FROM Content GROUP BY Division, Book ORDER BY Division, Book;', tx, function(tx, res) {
                for(var cntr = 0; cntr < res.rows.length; cntr++) {
                    books[cntr].maxChapters = res.rows.item(cntr).MaxChapter;
                }

                $rootScope.$broadcast(myBible.events.BOOKS_CHANGED, {books: books});
                myBible.SelectBook(passage.division, passage.book);
                myBible.SelectChapter(passage.chapter);
            });
        });
    };

    var FindBook = function(division, book) {
        var foundBook = {
            found: false,
            index: -1,
        };

        for(var cntr = 0; cntr < books.length; cntr++) {
            if((books[cntr].Division == division) && (books[cntr].Book == book)) {
                foundBook.found = true;
                foundBook.index = cntr;
                break;
            }
        }

        return foundBook;
    };


    myBible.SelectBook = function(division, book) {
        var foundBook = FindBook(division, book);

        if(foundBook.found) {
            passage.index = foundBook.index;
            passage.division = books[passage.index].Division;
            passage.book = books[passage.index].Book;
            UpdateLocalStorage();
            $rootScope.$broadcast(myBible.events.BOOK_SELECTED, {index: passage.index});
        }
    };


    myBible.SelectChapter = function(chapter) {
        passage.chapter = chapter;
        UpdateLocalStorage();
        $rootScope.$broadcast(myBible.events.CHAPTER_SELECTED, {chapter: passage.chapter});
    };


    myBible.SelectPassage = function(division, book, chapter) {
        var foundBook = FindBook(division, book);

        if(foundBook.found) {
            passage.index = foundBook.index;
            passage.division = books[passage.index].Division;
            passage.book = books[passage.index].Book;
            passage.chapter = chapter;
            UpdateLocalStorage();
            $rootScope.$broadcast(myBible.events.PASSAGE_SELECTED, {index: passage.index, chapter: passage.chapter});
        }
    };


    var TextLoaded = function(tx, res) {
        verses = [];

        for(var cntr = 0; cntr < res.rows.length; cntr++) {
            verses.push(res.rows.item(cntr));
        }

        $rootScope.$broadcast(myBible.events.PASSAGE_CHANGED, {
            verses: verses,
            bookName: books[passage.index].Name,
            chapter: passage.chapter
        });
    };


    myBible.LoadText = function() {
        var query = "SELECT VerseName,VerseText from Content where Division=" + passage.division+
            " and Book=" + passage.book+
            " and Chapter=" + passage.chapter + ";";
        RunQuery(query, undefined, TextLoaded);
    };

    myBible.GetBook = function(division, book) {
        var foundBook = FindBook(division, book);
        var returnBook;

        if(foundBook.found) {
            returnBook = books[foundBook.index];
        }

        return returnBook;
    };

    ionic.Platform.ready(function() {
        OpenDB();
        RetrieveBookNames();
    });

    Init();

    return myBible;
}]);