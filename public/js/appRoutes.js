angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // nerds page that will use the NerdController
        .when('/cube-summation', {
            templateUrl: 'views/cube.html',
            controller: 'CubeController'
        });

    $locationProvider.html5Mode(true);

}]);