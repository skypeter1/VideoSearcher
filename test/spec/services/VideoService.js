'use strict';

describe('Factory: VideoService', function () {
  var VideoService;
  var $httpBackend;
  var $rootScope;

  beforeEach(module('Service'));

  beforeEach(inject(function (_VideoService_, _$httpBackend_, _$rootScope_) {
    VideoService = _VideoService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    window.YOUTUBE_API_KEY = 'test-key';
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    delete window.YOUTUBE_API_KEY;
  });

  it('formats ISO-8601 durations', function () {
    expect(VideoService.formatDuration('PT1H2M3S')).toBe('1h 2m 3s');
    expect(VideoService.formatDuration('PT15M')).toBe('15m 0s');
    expect(VideoService.formatDuration('PT45S')).toBe('45s');
    expect(VideoService.formatDuration('')).toBe('—');
  });

  it('maps video list items to gallery cards', function () {
    var mapped = VideoService.mapItem({
      id: 'abc123',
      snippet: {
        title: 'Hello',
        channelTitle: 'Channel',
        channelId: 'UC123',
        publishedAt: '2024-01-01T00:00:00Z',
        thumbnails: {
          medium: { url: 'https://i.ytimg.com/vi/abc123/mqdefault.jpg' }
        }
      },
      statistics: { viewCount: '42' },
      contentDetails: { duration: 'PT1M1S' }
    });

    expect(mapped.title).toBe('Hello');
    expect(mapped.author).toBe('Channel');
    expect(mapped.noviews).toBe('42');
    expect(mapped.duration).toBe('1m 1s');
    expect(mapped.url).toBe('https://www.youtube.com/watch?v=abc123');
    expect(mapped.thumbnail).toContain('mqdefault.jpg');
  });

  it('rejects popular video requests when the API key is missing', function () {
    delete window.YOUTUBE_API_KEY;
    var rejected;
    VideoService.returnPopularVideos().catch(function (err) {
      rejected = err;
    });
    $rootScope.$digest();
    expect(rejected.message).toContain('YOUTUBE_API_KEY');
  });

  it('fetches popular videos', function () {
    $httpBackend
      .expectGET(
        /https:\/\/www\.googleapis\.com\/youtube\/v3\/videos\?.*chart=mostPopular/
      )
      .respond({
        items: [
          {
            id: 'pop1',
            snippet: {
              title: 'Popular',
              channelTitle: 'News',
              channelId: 'UCnews',
              publishedAt: '2024-02-01T00:00:00Z',
              thumbnails: { default: { url: 'https://example.com/t.jpg' } }
            },
            statistics: { viewCount: '1000' },
            contentDetails: { duration: 'PT10M' }
          }
        ]
      });

    var result;
    VideoService.returnPopularVideos().then(function (response) {
      result = response;
    });
    $httpBackend.flush();

    expect(result.title).toBe('Popular videos');
    expect(result.results.length).toBe(1);
    expect(result.results[0].title).toBe('Popular');
    expect(result.results[0].url).toBe('https://www.youtube.com/watch?v=pop1');
  });

  it('searches then hydrates video details', function () {
    $httpBackend
      .expectGET(
        /https:\/\/www\.googleapis\.com\/youtube\/v3\/search\?.*q=drums/
      )
      .respond({
        items: [{ id: { videoId: 'vid9' }, snippet: { title: 'Drums' } }]
      });

    $httpBackend
      .expectGET(
        /https:\/\/www\.googleapis\.com\/youtube\/v3\/videos\?.*id=vid9/
      )
      .respond({
        items: [
          {
            id: 'vid9',
            snippet: {
              title: 'Drums Solo',
              channelTitle: 'Beats',
              channelId: 'UCbeats',
              publishedAt: '2024-03-01T00:00:00Z',
              thumbnails: { medium: { url: 'https://example.com/d.jpg' } }
            },
            statistics: { viewCount: '9' },
            contentDetails: { duration: 'PT3M' }
          }
        ]
      });

    var result;
    VideoService.returnMatchedVideos('drums').then(function (response) {
      result = response;
    });
    $httpBackend.flush();

    expect(result.title).toBe('Results for “drums”');
    expect(result.results[0].title).toBe('Drums Solo');
    expect(result.results[0].noviews).toBe('9');
  });
});
