'use strict';

/**
 * 
 * @name VideoSearchApp.factory:VideoService
 *
 * @description
 * # This file contains the definition for the factory 
 * # that makes the queries at the Youtube API
 *
 */

angular.module('Service')
.factory('VideoService', function($http,$location) {
	  var apiUrl = 'https://www.googleapis.com/youtube/v3/',
	  parameters = {
			key:'AIzaSyDTHIxJ-BjksN1Xo_F7kKTpBHFqJ6vQlQQ',
			fields: 'items(snippet(title,tags,channelTitle,publishedAt),statistics(viewCount))',
			part: 'snippet,statistics',
			maxResults: '50',
			chart: 'mostPopular'
	  };

	/**
	 * Make the JSONP Request
	 */
	function jsonpRequest(url,parameters)
	{
		parameters = '';
		return $http.jsonp(url, {jsonpCallbackParam: 'callback'});
	}

	/*
	 * Populate array with API Data
	 */
	function getData(data)
	{
		var result = data.data;
		var videos = result.items
		.map(function(result){
			return	{
			  title: result.snippet.title,
			  author : result.snippet.channelId,
			  published : result.snippet.publishedAt,
			  noviews : '100',
			  duration : '1200',
			  authorURL : result.snippet.channelId,
			  url: result.snippet.channelId,
		     thumbnail: result.snippet.thumbnails.default.width > 300  ?  result.snippet.thumbnails.default.url : result.snippet.thumbnails.medium.url
			};
	  });
	    return	{
	      	results: videos,
	      	title: 'My Awesome Videos'
	    };
  	}

	return {

	/**
	 * This method returns an array with the information fo the most popular videos
	 * TO-DO: Change the url to accept an array with parameters  
	 */		
    returnPopularVideos: function() {
		return jsonpRequest('https://www.googleapis.com/youtube/v3/videos?key=AIzaSyDTHIxJ-BjksN1Xo_F7kKTpBHFqJ6vQlQQ&chart=mostPopular&part=snippet,statistics&maxResults=50', parameters)
      	.then(function(data){
        	return getData(data);
      	})
      	.catch(function(){
        	$location.path('/');
      });
    },
	
	/**
	 * This method return an array with the video information of the videos that match the selected key word
	 * @keyWords A text field that's been used as filter
	 * TO-DO: Change the url to accept an array with parameters 
	 */    
    returnMatchedVideos: function(keyWords) {
      	return jsonpRequest([apiUrl,'search?key=AIzaSyDTHIxJ-BjksN1Xo_F7kKTpBHFqJ6vQlQQ&chart=mostPopular&part=snippet,id&maxResults=50&type=video&q='+keyWords].join(''), parameters)
      	.then(function(data){
        	return getData(data);
      	})
      	.catch(function(){
        	$location.path('/');
      	});
   	  }
  	};
});