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

	// var apiUrl = 'http://gdata.youtube.com/feeds/api/',
  	// parameters = {
    // 	params: { callback:'JSON_CALLBACK', alt:'json'}
	//   };
	  
	//   var apiKey = 'AIzaSyDTHIxJ-BjksN1Xo_F7kKTpBHFqJ6vQlQQ';
	//   var fields = 'fields=items(snippet(title,tags,channelTitle,publishedAt),statistics(viewCount))';
	//   var chart = 'mostPopular';
	//   var part = 'part=snippet,statistics&maxResults=50';
	  var apiUrl = 'https://www.googleapis.com/youtube/v3/videos',
	  parameters = {
	 //	  params: { 
			key:'AIzaSyDTHIxJ-BjksN1Xo_F7kKTpBHFqJ6vQlQQ',
			fields: 'items(snippet(title,tags,channelTitle,publishedAt),statistics(viewCount))',
			part: 'snippet,statistics',
			maxResults: '50',
			chart: 'mostPopular',
			callback: 'JSON_CALLBACK'
			// alt: 'json'
	//	}
	  };

	/**
	 * Make the JSONP Request
	 */
	function jsonpRequest(url,parameters)
	{
		var url = 'https://www.googleapis.com/youtube/v3/videos?key=AIzaSyDTHIxJ-BjksN1Xo_F7kKTpBHFqJ6vQlQQ&chart=mostPopular&part=snippet,statistics&maxResults=50';
		return $http.jsonp(url, {jsonpCallbackParam: 'callback'});
	}

	/*
	 * Populate array with API Data
	 */
	function getData(data)
	{
    
		var result = data.data;
		var videos = result.items
		.map(function(videos){
			console.log('test');
			return	{
			  title: videos.snippet.title,
			  author : videos.snippet.channelId,
			  published : videos.snippet.publishedAt,
			  noviews : videos.statistics.viewCount,
			  duration : videos.statistics.commentCount,
			  authorURL : videos.snippet.channelId,
			  url: videos.snippet.channeId,
			  thumbnail: videos.snippet.thumbnails.default.url
			//   thumbnail: snippet.thumbnails.default.width > 300  ?  snippet.thumbnails.default.url : snippet.thumbnails.medium.url
			//   thumbnail: video.media$group.media$thumbnail[0].height > 300 ? video.media$group.media$thumbnail[0].url : video.media$group.media$thumbnail[1].url
			};
	  });

	    return	{
	      	results: 'result',
	      	title: "title"
	    };
  	}



	return {

	/**
	 * This method returns an array with the information fo the most popular videos
	 */		
    returnPopularVideos: function() {
		return jsonpRequest(apiUrl, parameters)
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
    // returnMatchedVideos: function(keyWords) {
    //   	return jsonpRequest([apiUrl,'videos?q='+keyWords+'&max-results=20&format=5'].join(''), parameters)
    //   	.then(function(data){
    //     	return getData(data);
    //   	})
    //   	.catch(function(){
    //     	$location.path('/');
    //   	});
   	//   }

  	};

});