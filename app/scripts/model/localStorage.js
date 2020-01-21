'use strict';

/**
 * 
 * @name VideoSearchApp.factory:localStorage
 *
 * @description
 * # This factory stores the keywords introduced by the user 
 * # in a local mode
 *
 */

angular.module('Model')


.factory('localStorage', function () {
	

	return {
		save: function(){
			return 'test';
		}

	};
});