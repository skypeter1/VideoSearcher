'use strict';

/**
 * Thin wrapper kept for module completeness; the app uses angular-local-storage.
 */
angular.module('Model').factory('localStorage', function (localStorageService) {
  return {
    get: function (key) {
      return localStorageService.get(key);
    },
    set: function (key, value) {
      return localStorageService.set(key, value);
    }
  };
});
