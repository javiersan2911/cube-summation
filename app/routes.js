// grab the nerd model we just created
var Cube = require('./models/cube');

module.exports = function (app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // sample api route
    app.get('/api/cubes/:dim/:x/:y/:z/:x1/:y1/:z1/', function (req, res) {
        // use mongoose to get all cube dimensions in the database given the starting and ending coordinates
        Cube.find({ 'dimCube': req.params.dim, 'coordinate.x': { $gte: req.params.x, $lte: req.params.x1 }, 'coordinate.y': { $gte: req.params.y, $lte: req.params.y1 }, 'coordinate.z': { $gte: req.params.z, $lte: req.params.z1 } }, 'coordinate', function (err, cubes) {

            // if there is an error retrieving, send the error. 
            // nothing after res.send(err) will execute
            if (err)
                res.send(err);
            res.json(cubes); // return all cubes in JSON format
        });
    });
    app.get('/api/cubes/:dim', function (req, res) {
        // use mongoose to get all cubes in the database for a given dimension
        Cube.find({ 'dimCube': req.params.dim}, function (err, cubes) {

            // if there is an error retrieving, send the error. 
            // nothing after res.send(err) will execute
            if (err)
                res.send(err);
            res.json(cubes); // return all cubes in JSON format
        });
    });
    // route to handle creating goes here (app.post)
    // create cube dimension value for a coordinate
    app.post('/api/cubes', function (req, res) {

        // create a cube, information comes from AJAX request from Angular
        Cube.create({
            dimCube: req.body.dimCube,
            coordinate: req.body.coordinate,
            done: false
        }, function (err, cube) {
            if (err)
                res.send(err);
            res.json({updated:true});
        });

    });
    // route to handle delete goes here (app.delete)
    // delete a cube given a dimension
    app.delete('/api/cubes/:dim', function (req, res) {
        Cube.remove({
            dimCube: req.params.dim
        }, function (err, cube) {
            if (err)
                res.send(err);
            res.json({deleted:true});    
        });
    });

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function (req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });

};
