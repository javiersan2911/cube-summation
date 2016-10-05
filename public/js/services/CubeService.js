angular.module('CubeService', []).factory('Cube', ['$http', function ($http) {

    return {
        // call to get all cubes
        getAll: function (dim) {
            return $http.get('/api/cubes');
        },
        get: function (dim) {
            return $http.get('/api/cubes/' + dim.dimCube + '/' + dim.coordinate.x + '/' + dim.coordinate.y + '/' + dim.coordinate.z + '/' + dim.coordinate.x1 + '/' + dim.coordinate.y1 + '/' + dim.coordinate.z1+ '/');
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