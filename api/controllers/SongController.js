var mongoose = require('mongoose');
Song = mongoose.model('Song');

exports.showAll = function(req, res){
    Song.find({}, function(err, songs){
        if(err)
          res.send(err);
        res.json(songs);
    });
}

exports.create = function(req, res){
    console.log("here with ", req.body);
    var new_song = new Song(req.body);
    new_song.save(function(err, song){
        if(err)
          res.send(err);
        res.json(song);
    });
}

exports.showOne = function(req, res){
   Song.findById(req.params.songId, function(err, song){
      if(err)
        res.send(err);
      res.json(song);
   });
}

exports.updateOne = function(req, res){
    Song.findOneAndUpdate(req.params.songId, req.body, {new:true}, function(err, song){
        if(err)
          res.send(err);
        res.json(task);
    });
}

exports.deleteOne = function(req, res){
    Song.remove({
        _id: req.params.songId
    }, function(err, task){
        if(err)
          res.send(err);
        res.json({message : 'Deleted'});
    })
}
