'use strict';

/**
 * VideoService — YouTube Data API v3 client.
 */
angular.module('Service').factory('VideoService', function ($http, $q) {
  var API_BASE = 'https://www.googleapis.com/youtube/v3/';

  function apiKey() {
    return (typeof window !== 'undefined' && window.YOUTUBE_API_KEY) || '';
  }

  function ensureKey() {
    if (!apiKey()) {
      return $q.reject(new Error('Missing YOUTUBE_API_KEY. See README.'));
    }
    return $q.resolve();
  }

  function formatDuration(iso) {
    if (!iso || typeof iso !== 'string') {
      return '—';
    }
    var match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) {
      return iso;
    }
    var hours = Number(match[1] || 0);
    var minutes = Number(match[2] || 0);
    var seconds = Number(match[3] || 0);
    var parts = [];
    if (hours) {
      parts.push(hours + 'h');
    }
    if (minutes || hours) {
      parts.push(minutes + 'm');
    }
    parts.push(seconds + 's');
    return parts.join(' ');
  }

  function videoIdFromItem(item) {
    if (!item || !item.id) {
      return '';
    }
    if (typeof item.id === 'string') {
      return item.id;
    }
    return item.id.videoId || '';
  }

  function mapItem(item) {
    var snippet = item.snippet || {};
    var stats = item.statistics || {};
    var details = item.contentDetails || {};
    var thumbs = snippet.thumbnails || {};
    var thumb =
      (thumbs.medium && thumbs.medium.url) ||
      (thumbs.high && thumbs.high.url) ||
      (thumbs.default && thumbs.default.url) ||
      '';
    var id = videoIdFromItem(item);

    return {
      id: id,
      title: snippet.title || 'Untitled',
      author: snippet.channelTitle || 'Unknown',
      published: snippet.publishedAt || '',
      noviews: stats.viewCount || '—',
      duration: formatDuration(details.duration),
      authorURL: snippet.channelId
        ? 'https://www.youtube.com/channel/' + snippet.channelId
        : '',
      url: id ? 'https://www.youtube.com/watch?v=' + id : '',
      thumbnail: thumb
    };
  }

  function wrapResults(items, title) {
    return {
      results: (items || []).map(mapItem),
      title: title
    };
  }

  function getVideoDetails(ids) {
    if (!ids.length) {
      return $q.resolve([]);
    }
    return $http
      .get(API_BASE + 'videos', {
        params: {
          key: apiKey(),
          id: ids.join(','),
          part: 'snippet,statistics,contentDetails',
          maxResults: 50
        }
      })
      .then(function (response) {
        return (response.data && response.data.items) || [];
      });
  }

  return {
    formatDuration: formatDuration,
    mapItem: mapItem,

    returnPopularVideos: function () {
      return ensureKey().then(function () {
        return $http
          .get(API_BASE + 'videos', {
            params: {
              key: apiKey(),
              chart: 'mostPopular',
              part: 'snippet,statistics,contentDetails',
              maxResults: 24,
              regionCode: 'US'
            }
          })
          .then(function (response) {
            return wrapResults(
              (response.data && response.data.items) || [],
              'Popular videos'
            );
          });
      });
    },

    returnMatchedVideos: function (keyWords) {
      var query = (keyWords || '').trim();
      if (!query) {
        return this.returnPopularVideos();
      }

      return ensureKey().then(function () {
        return $http
          .get(API_BASE + 'search', {
            params: {
              key: apiKey(),
              part: 'snippet',
              type: 'video',
              q: query,
              maxResults: 24
            }
          })
          .then(function (response) {
            var items = (response.data && response.data.items) || [];
            var ids = items
              .map(videoIdFromItem)
              .filter(function (id) {
                return !!id;
              });
            return getVideoDetails(ids);
          })
          .then(function (details) {
            return wrapResults(details, 'Results for “' + query + '”');
          });
      });
    }
  };
});
