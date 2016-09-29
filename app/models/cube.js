// grab the mongoose module
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var cubeSchema = new Schema({
    dimCube: Number, coordinate : {x:Number, y:Number, z:Number, val: Number}
});

module.exports = mongoose.model('Cube', cubeSchema);