'use strict';

/**
 * 
 * @name VideoSearchApp.controller:MainCtrl
 *
 * @description
 * # This is the main controller for the app
 * # and has all the functions that we need to provide
 * # the functionality
 * Controller of the VideoSearchApp
 *
 */
angular.module('VideoSearchApp')
.controller('MainCtrl', function ($scope, VideoGallery, VideoService, $location) {

	/**
	 * The video results
	 */
  	$scope.videos = VideoGallery.results;
  	
  	/**
  	 * The general titles
  	 */
  	$scope.Title = VideoGallery.title;

  	/**
   	 * This function open the video in a new tab
   	 */
  	$scope.openInNewTab = function openInNewTab(url) {
    	window.open(url,'_blank');
  	};

  	/**
  	 * This function search videos related to the given keyword
  	 */
	$scope.$watch('search',function(actual, before){
	    if(actual !== before){
	      	VideoService.returnMatchedVideos(actual)
	      	.then(function(response){
	        	$scope.videos = response.results;
	        	$scope.Title = response.title;
	      	});
	    }
	},true);

});

