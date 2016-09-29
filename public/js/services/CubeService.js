angular.module('CubeService', []).factory('Cube', ['$http', function ($http) {

    return {
        // call to get all cubes
        get: function () {
            return $http.get('/api/cubes/');
        },


        // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new cube
        create: function (cubeData) {
            return $http.post('/api/cubes', cubeData);
        },

        // call to DELETE a cube
        delete: function (id) {
            return $http.delete('/api/cubes/' + id);
        }
    }

}]);