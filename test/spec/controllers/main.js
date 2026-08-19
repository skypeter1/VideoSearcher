'use strict';

describe('Controller: MainCtrl', function () {
  var $controller;
  var $rootScope;
  var $q;
  var scope;
  var VideoService;
  var localStorageService;

  beforeEach(module('VideoSearchApp'));

  beforeEach(inject(function (
    _$controller_,
    _$rootScope_,
    _$q_,
    _VideoService_,
    _localStorageService_
  ) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    VideoService = _VideoService_;
    localStorageService = _localStorageService_;
    localStorageService.clearAll();
    scope = $rootScope.$new();
  }));

  function createController(gallery) {
    return $controller('MainCtrl', {
      $scope: scope,
      VideoGallery: gallery || {
        results: [{ title: 'Demo', url: 'https://www.youtube.com/watch?v=abc' }],
        title: 'Popular videos'
      },
      VideoService: VideoService,
      localStorageService: localStorageService
    });
  }

  it('loads gallery data onto the scope', function () {
    createController();
    expect(scope.videos.length).toBe(1);
    expect(scope.Title).toBe('Popular videos');
    expect(scope.error).toBe('');
  });

  it('surfaces resolve errors', function () {
    createController({
      results: [],
      title: 'Unable to load videos',
      error: 'Missing YOUTUBE_API_KEY. See README.'
    });
    expect(scope.error).toContain('YOUTUBE_API_KEY');
    expect(scope.videos.length).toBe(0);
  });

  it('opens video urls in a new tab', function () {
    createController();
    spyOn(window, 'open');
    scope.openInNewTab('https://www.youtube.com/watch?v=abc');
    expect(window.open).toHaveBeenCalledWith(
      'https://www.youtube.com/watch?v=abc',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('ignores empty urls', function () {
    createController();
    spyOn(window, 'open');
    scope.openInNewTab('');
    expect(window.open).not.toHaveBeenCalled();
  });

  it('searches when the query changes and remembers keywords', function () {
    createController();
    scope.$digest();

    spyOn(VideoService, 'returnMatchedVideos').and.returnValue(
      $q.resolve({
        results: [{ title: 'Cats' }],
        title: 'Results for “cats”'
      })
    );

    scope.search = 'cats';
    scope.$digest();

    expect(VideoService.returnMatchedVideos).toHaveBeenCalledWith('cats');
    expect(scope.videos[0].title).toBe('Cats');
    expect(scope.Title).toBe('Results for “cats”');
    expect(scope.words[0]).toBe('cats');
    expect(localStorageService.get('words')[0]).toBe('cats');
  });

  it('applies a recent keyword via useWord', function () {
    createController();
    scope.useWord('guitar');
    expect(scope.search).toBe('guitar');
  });
});
