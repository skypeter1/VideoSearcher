'use strict';

/**
 * @ngdoc overview
 * @name VideoSearchApp
 * @description
 * # This application uses the youtube API
 * # to make a quick research of videos that match the given key words
 *
 * Main module of the application.
 *
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

  .config(function ($routeProvider) {
   $routeProvider
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl',
    resolve: {
      VideoGallery: function($location,$route,VideoService) {
        return VideoService.returnPopularVideos()
        .catch(function() {
            $location.path('/');
          });
      },
    }

  })
  .otherwise({
        redirectTo: '/'
      });
  });
