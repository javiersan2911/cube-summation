angular.module('CubeCtrl', []).controller('CubeController', ['$scope', '$http', '$q', 'Cube', function ($scope, $http, $q, Cube) {

    $scope.entrada = '';

    $scope.updateCubeValue = function (dimUpdate, index) {
        var resultado = false;
        setTimeout(function () {
            Cube.create(dimUpdate);
        }, index * 200);
    };

    $scope.queryCube = function (dimQuery, index) {
        var suma = 0;
        setTimeout(function () {
            Cube.get(dimQuery).then(function (result) {
                result.data.forEach(function (element) {
                    suma += element.coordinate.val;
                }, this);
                var salidaVal = { valor: suma };
                $scope.salida.push(salidaVal);
            })
        }, index * 200);
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
        var operaciones = [];
        var dims = [];
        for (var i = 0; i < testCases.length; i++) {
            var testCase = testCases[i];
            var linesOp = testCase[0].split(' ');
            var N = linesOp[0];
            var M = linesOp[1];
            dims.push(N);

            if (parseInt(N) < 1 || parseInt(N) > 100) {
                $scope.message = 'El valor de N (Dimensión del cubo) debe estar entre 1 y 100.';
                return;
            }

            if (parseInt(M) < 1 || parseInt(M) > 1000) {
                $scope.message = 'El valor de M (Númeor de operaciones) debe estar entre 1 y 1000.';
                return;
            }
            for (var j = 1; j <= M; j++) {
                operaciones.push({ N: N, op: testCase[j] });
            }
        }

        if (operaciones) {
            for (var j = 0; j < operaciones.length; j++) {
                var op = operaciones[j].op.split(' ');
                var N = operaciones[j].N;
                if (op[0] === ('UPDATE')) {
                    if (op[1] > N || op[2] > N || op[3] > N) {
                        $scope.message = 'Coordenada mayor que dimensión de cubo(' + N + ').' + 'Caso de prueba ' + (i + 1) + '. ' + 'Operación ' + j;;
                        $scope.mostrarResultado = false;
                        return;
                    } else if (op[4] > 1000000000 || op[4] < -10000000000) {
                        $scope.message = 'Valor de W fuera de limites.';
                        $scope.mostrarResultado = false;
                        return;
                    } else {
                        $scope.dimUpdate = { dimCube: N, coordinate: { x: parseInt(op[1]), y: parseInt(op[2]), z: parseInt(op[3]), val: parseInt(op[4]) } }
                        $scope.updateCubeValue($scope.dimUpdate, j);
                    }
                } else if (op[0] === ('QUERY')) {
                    if (op[1] > N || op[2] > N || op[3] > N || op[4] > N || op[5] > N || op[6] > N) {
                        $scope.message = 'Coordenada mayor que dimensión de cubo(' + N + '). ' + 'Caso de prueba ' + (i + 1) + '. ' + 'Operación ' + j;
                        $scope.mostrarResultado = false;
                        return;
                    } else if (op[4] < op[1] || op[5] < op[2] || op[6] < op[3]) {
                        $scope.message = 'Coordenada 2 menor que coordenada 1. ' + 'Caso de prueba ' + (i + 1) + '. ' + 'Operación ' + j;
                        $scope.mostrarResultado = false;
                        return;
                    } else {
                        $scope.dimQuery = {
                            dimCube: N, coordinate: {
                                x: parseInt(op[1]),
                                y: parseInt(op[2]),
                                z: parseInt(op[3]),
                                x1: parseInt(op[4]),
                                y1: parseInt(op[5]),
                                z1: parseInt(op[6])
                            }
                        }
                        $scope.queryCube($scope.dimQuery, j);
                    }
                } else {
                    $scope.message = 'Operación no soportada. ' + 'Caso de prueba ' + (i + 1) + '. ' + 'Operación ' + j;
                    $scope.mostrarResultado = false;
                }
            }
        }

        if ($scope.salida) {
            $scope.mostrarResultado = true;
        }
        
        if (dims) {
            dims.forEach(function (dim) {
                Cube.delete(dim);
                console.log('Eliminación: ' + dim)
            }, this);
        }
    };
}]);