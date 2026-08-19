// Karma configuration — Chrome Headless via Puppeteer
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function (config) {
  'use strict';

  config.set({
    basePath: '../',
    frameworks: ['jasmine'],
    files: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-animate/angular-animate.js',
      'node_modules/angular-cookies/angular-cookies.js',
      'node_modules/angular-resource/angular-resource.js',
      'node_modules/angular-route/angular-route.js',
      'node_modules/angular-sanitize/angular-sanitize.js',
      'node_modules/angular-touch/angular-touch.js',
      'node_modules/angular-local-storage/dist/angular-local-storage.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'app/scripts/services/module.js',
      'app/scripts/services/VideoService.js',
      'app/scripts/model/module.js',
      'app/scripts/model/localStorage.js',
      'app/scripts/app.js',
      'app/scripts/controllers/main.js',
      'test/spec/**/*.js'
    ],
    exclude: [],
    port: 9876,
    browsers: ['ChromeHeadless'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu']
      }
    },
    singleRun: true,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    reporters: ['progress']
  });

  if (process.env.CI) {
    config.browsers = ['ChromeHeadlessCI'];
  }
};
