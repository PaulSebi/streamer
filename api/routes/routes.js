var jwt = require('jsonwebtoken');

module.exports = function(app){
    var SongController = require('../controllers/SongController');
    var MainController = require('../controllers/MainController');

    app.route('/songs')
      .get(SongController.showAll)
      .post(SongController.create);

    app.route('/songs/:songid')
      .get(SongController.showOne)
      .post(SongController.updateOne)
      .delete(SongController.deleteOne);

    app.route('/')
      .get(function(req,res){
          res.render('login');
      });

    app.route('/admin')
      .get(function(req, res){
          var token = req.query.token;
          if(token){
              jwt.verify(token, app.get('secretkey'), function(err, decoded){
                  if(err)
                    res.json({success: false, message:'no such user'});
                  console.log('Decoded',decoded);
                  if(decoded.data.admin)
                    res.render('admin', {roomName : decoded.data.room});
                  else res.json({message : 'not authorized'});
              });
          }
          else res.json({message: 'please pass token'});
      });

    app.route('/user')
      .get(function(req,res){

          res.render('home');
      });
}
