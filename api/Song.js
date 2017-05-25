var mongooose = require('mongoose');
var Schema = mongoose.schema;

var SongSchema = new Schema({
    playname : {type : String},
    title : {type : String},
    thumburl : {type : String},
    link : {type : String},
    username : {type : String}
});

module.exports = mongoose.model('Song', SongSchema);
