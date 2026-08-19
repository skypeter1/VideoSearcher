'use strict';

/**
 * VideoSearchApp — search YouTube videos by keyword.
 */
angular
  .module('VideoSearchApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'Service',
    'Model',
    'LocalStorageModule'
  ])
  .config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'https://www.googleapis.com/**',
      'https://i.ytimg.com/**'
    ]);
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          VideoGallery: function (VideoService) {
            return VideoService.returnPopularVideos().catch(function (err) {
              return {
                results: [],
                title: 'Unable to load videos',
                error: (err && err.message) || 'Request failed'
              };
            });
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  });
