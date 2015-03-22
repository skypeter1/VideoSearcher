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

	var apiUrl = 'http://gdata.youtube.com/feeds/api/',
  	parameters = {
    	params: { callback:'JSON_CALLBACK', alt:'json'}
  	};

	/**
	 * Make the JSONP Request
	 */
	function jsonpRequest(url,parameters)
	{
		return $http.jsonp(url,parameters);
	}

	/*
	 * Populate array with API Data
	 */
	function getData(data)
	{
    
    	var result = data.data.feed;
    	var videos = (result.entry)
    	.map(function(video){
	      	return	{
		        title: video.title.$t,
			    author : video.author[0].name.$t,
		        published : video.published.$t,
		        noviews : video.yt$statistics.viewCount,
		        duration : video.media$group.yt$duration.seconds,
		        authorURL : video.author[0].uri.$t,
		        url: video.link[0].href,
		        thumbnail: video.media$group.media$thumbnail[0].height > 300 ? video.media$group.media$thumbnail[0].url : video.media$group.media$thumbnail[1].url
	      	};
    	});

	    	return	{
	      		results: videos,
	      		title: result.title.$t
	    	};
  	}



	return {

	/**
	 * This method returns an array with the information fo the most popular videos
	 */		
    returnPopularVideos: function() {
      	return jsonpRequest([apiUrl,'standardfeeds/most_popular?v=2'].join(''), parameters)
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
	 */    
    returnMatchedVideos: function(keyWords) {
      	return jsonpRequest([apiUrl,'videos?q='+keyWords+'&max-results=20&format=5'].join(''), parameters)
      	.then(function(data){
        	return getData(data);
      	})
      	.catch(function(){
        	$location.path('/');
      	});
   	  }

  	};

});