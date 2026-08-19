'use strict';

/**
 * MainCtrl — search UI and video gallery.
 */
angular
  .module('VideoSearchApp')
  .controller('MainCtrl', function (
    $scope,
    VideoGallery,
    VideoService,
    localStorageService
  ) {
    var wordsInStore = localStorageService.get('words');

    $scope.videos = VideoGallery.results || [];
    $scope.Title = VideoGallery.title || 'Popular videos';
    $scope.error = VideoGallery.error || '';
    $scope.loading = false;
    $scope.words = wordsInStore || [];
    $scope.search = '';

    $scope.openInNewTab = function (url) {
      if (!url) {
        return;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    };

    $scope.useWord = function (word) {
      $scope.search = word;
    };

    function rememberWord(word) {
      var next = ($scope.words || []).filter(function (w) {
        return w !== word;
      });
      next.unshift(word);
      $scope.words = next.slice(0, 8);
      localStorageService.set('words', $scope.words);
    }

    $scope.$watch(
      'search',
      function (actual, previous) {
        if (actual === previous) {
          return;
        }

        var query = (actual || '').trim();
        $scope.loading = true;
        $scope.error = '';

        VideoService.returnMatchedVideos(query)
          .then(function (response) {
            $scope.videos = response.results || [];
            $scope.Title = response.title;
            if (query) {
              rememberWord(query);
            }
          })
          .catch(function (err) {
            $scope.videos = [];
            $scope.Title = 'Search failed';
            $scope.error = (err && err.message) || 'Request failed';
          })
          .finally(function () {
            $scope.loading = false;
          });
      }
    );
  });
