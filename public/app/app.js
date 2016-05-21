angular.module( 'App', ['ui.bootstrap', 'file-model', 'ui.router', 'ngResource'])
  .run()
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'mainCtrl'
      });
  }])
  .factory('Message', ['$resource', function($resource) {
    return $resource('/messages/:id', {
      id: '@id'
    });
  }]);
