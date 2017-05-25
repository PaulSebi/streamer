var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SongSchema = new Schema({
    playname : {type : String},
    title : {type : String},
    thumburl : {type : String},
    link : {type : String},
    username : {type : String}
});

module.exports = mongoose.model('Song', SongSchema);
