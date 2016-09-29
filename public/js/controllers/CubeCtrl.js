angular.module('CubeCtrl', []).controller('CubeController', function ($scope, $http, $q) {

    $scope.entrada = '';

    $scope.createDim = function (dimension) {
        var def = $q.defer();

        $http.post('/api/cubes', dimension)
            .success(function (data) {
                $scope.dimension = {};
                def.resolve(data);
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
                def.reject('Error: ' + data);
            });
        return def.promise;
    };

    $scope.getDimVal = function (dim) {
        var def = $q.defer();
        $http.get('/api/cubes/' + dim.dimCube + '/' + dim.coordinate.x + '/' + dim.coordinate.y + '/' + dim.coordinate.z)
            .success(function (data) {
                def.resolve(data);
                $scope.val = 0;
                if (data.coordinate && data.coordinate.val) {
                    $scope.val = data.coordinate.val;
                }
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
                def.reject('Error: ' + data);
            });
        return def.promise;
    }


    $scope.deleteDim = function (id) {
        $http.delete('/api/cubes/' + id)
            .success(function (data) {
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    $scope.ejecutar = function () {
        $scope.message = '';
        $scope.mostrarResultado = false;
        $scope.salida = [];
        var lines = $scope.entrada.split('\n');
        var testCaseNumber = lines[0];

        var testCases = [];
        for (var index = 1; index < lines.length; index++) {
            var line = lines[index];
            if (line.split(' ').length === 2) {
                testCases.push(lines.slice(index, index + parseInt(line.split(' ')[1]) + 1))
            }
        }

        if (testCases.length !== parseInt(testCaseNumber)) {
            $scope.message = 'Número de casos de prueba diferente del indicado.';
            return;
        }

        for (var i = 0; i < testCases.length; i++) {
            var testCase = testCases[i];
            var linesOp = testCase[0].split(' ');
            var N = linesOp[0];
            var M = linesOp[1];

            if (parseInt(N) < 1 || parseInt(N) > 100) {
                $scope.message = 'El valor de N debe estar entre 1 y 100.';
                return;
            }

            if (parseInt(M) < 1 || parseInt(M) > 1000) {
                $scope.message = 'El valor de M debe estar entre 1 y 1000.';
                return;
            }

            for (var j = 1; j <= M; j++) {
                //code here using lines[i] which will give you each line
                var op = testCase[j].split(' ');
                if (op[0] === ('UPDATE')) {
                    if (op[1] > N || op[2] > N || op[3] > N) {
                        $scope.message = 'Coordenada mayor que dimensión de cubo.';
                        return;
                    } else if (op[4] > 1000000000 || op[4] < -10000000000) {
                        $scope.message = 'Valor de W fuera de limites.';
                    } else {
                        var dim = { dimCube: N, coordinate: { x: parseInt(op[1]), y: parseInt(op[2]), z: parseInt(op[3]), val: parseInt(op[4]) } }
                        $scope.dimension = $scope.createDim(dim);
                    }
                } else if (op[0] === ('QUERY')) {
                    if (op[1] > N || op[2] > N || op[3] > N || op[4] > N || op[5] > N || op[6] > N) {
                        $scope.message = 'Coordenada mayor que dimensión de cubo. ' + 'Caso de prueba ' + (i + 1) + '. ' + 'Operación ' + j;
                        return;
                    } else if (op[4] < op[1] || op[5] < op[2] || op[6] < op[3]) {
                        $scope.message = 'Coordenada 2 menor que coordenada 1. ' + 'Caso de prueba ' + (i + 1) + '. ' + 'Operación ' + j;
                        return;
                    } else {

                        var suma = 0;

                        for (var k = parseInt(op[1]); k <= parseInt(op[4]); k++) {
                            for (var l = parseInt(op[2]); l <= parseInt(op[5]); l++) {
                                for (var m = parseInt(op[3]); m <= parseInt(op[6]); m++) {
                                    var dim = { dimCube: N, coordinate: { x: k, y: l, z: m } }
                                    $scope.getDimVal(dim);
                                    suma += $scope.val;
                                }
                            }
                        }

                        var salidaVal = {
                            valor: suma
                        };
                        $scope.salida.push(salidaVal);
                        $scope.mostrarResultado = true;
                    }
                } else {
                    $scope.message = 'Operación no soportada. ' + 'Caso de prueba ' + (i + 1) + '. ' + 'Operación ' + j;
                    return;
                }
            }
        }
    };
});