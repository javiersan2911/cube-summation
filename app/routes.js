// grab the nerd model we just created
var Cube = require('./models/cube');

module.exports = function (app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // sample api route
    app.get('/api/cubes/:dim/:x/:y/:z', function (req, res) {
        // use mongoose to get all cubes in the database
        Cube.findOne({ 'dimCube': req.params.dim, 'coordinate.x': req.params.x, 'coordinate.y': req.params.y, 'coordinate.z': req.params.z }, 'coordinate', function (err, cubes) {

            // if there is an error retrieving, send the error. 
            // nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(cubes); // return all cubes in JSON format
        });
    });

    // route to handle creating goes here (app.post)
    // create cube and send back all cubes after creation
    app.post('/api/cubes', function(req, res) {

        // create a cube, information comes from AJAX request from Angular
        Cube.create({
            dimCube : req.body.dimCube,
            coordinate : req.body.coordinate,
            done : false
        }, function(err, cube) {
            if (err)
                res.send(err);

            // get and return all the cubes after you create another
            Cube.find(function(err, cubes) {
                if (err)
                    res.send(err)
                res.json(cubes);
            });
        });

    });
    // route to handle delete goes here (app.delete)
    // delete a cube
    app.delete('/api/cubes/:dim', function(req, res) {
        Cube.remove({
            dimCube : req.params.dim
        }, function(err, cube) {
            if (err)
                res.send(err);

            // get and return all the cubes after you create another
            Cube.find(function(err, cubes) {
                if (err)
                    res.send(err)
                res.json(cubes);
            });
        });
    });

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function (req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });

};
