var express = require('express'),
expressLayouts = require('express-ejs-layouts'),
app = express(),
port = process.env.PORT || 3000,
mongoose = require('mongoose'),
Song = require('./api/models/Song'),
bodyParser = require('body-parser'),
fs = require('fs'),
jwt = require('jsonwebtoken'),
http = require('http'),
_ = require('lodash');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/streamers');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//set global variables
app.set('secretkey', 'secretss');
app.locals.songs = [];
app.locals.currentsong = -1;
app.locals.stuck = false;

//views config
app.set('view engine', 'ejs');
app.use(expressLayouts)
app.set('views', __dirname + '/public/views');
app.set('view options', {layout : 'layout.ejs'});
app.use(express.static(__dirname + '/public'));

var routes = require('./api/routes/routes');
routes(app);

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(port);
console.log("Listening at ", port);



io.sockets.on('connection', function(socket){
      socket.emit('handshake','welcome');
      socket.on('return handshake', function(data){
          console.log(data);
      });

      // to subscribe to room from login page
      socket.on('subscribe', function(data){
          room = io.sockets.adapter.rooms[data.room];
          console.log('Room',room);
          var admin;
          admin = room ? false : true;

          socket.join(data.room);

          // console.log(JSON.stringify(data.username)+" has entered "+io.sockets.adapter.rooms);
          // console.log(io.sockets.adapter.rooms[data.room]);

          var details = {
              name : data.username,
              room : data.room,
              admin : admin
          }
          var token = jwt.sign({data:details}, app.get('secretkey'), {expiresIn : 60*60*10});

          var data = {
              token : token,
              admin : admin
          }
          socket.emit('joined', data);
      });

      // re-subscribe to the room after page redirect (this is a one-time thing)
      socket.on('subscribed', function(token){
          jwt.verify(token, app.get('secretkey'), function(err, decoded){
              if(err){
                res.json({success: false, message:'An error Occurred at Subscribed'});
                return;
              }
              socket.join(decoded.data.room);

              var queue = [];
              console.log('Songs :');
              _.forEach(app.locals.songs, function(song){
                  console.log(song);
                  if(song.playname == decoded.data.room)
                    queue.push(song);
              });
              if(app.locals.songs.length > app.locals.currentsong+1)
                console.log('New Join ', app.locals.songs[app.locals.currentsong]);
              console.log("current ",(app.locals.songs.length > app.locals.currentsong+1) ? app.locals.songs[app.locals.currentsong] : "");
              var res = {
                  admin : decoded.data.admin,
                  queue : queue,
                  current : (app.locals.songs.length > app.locals.currentsong) ? app.locals.songs[app.locals.currentsong] : ""
              }
              socket.emit('rejoined', res);
          });
      });

      //new song is added by user or admin
      socket.on('addsong', function(data){
          jwt.verify(data.token, app.get('secretkey'), function(err, decoded){
              if(err)
                res.json({success: false, message:'An error Occurred in addsong'});

              var queue = [], exist_flag = 0;
              getSongData(data.songurl, decoded.data, function(songData){
                _.each(app.locals.songs, function(song){
                    if(song.link == songData.link)
                        exist_flag = 1;
                });
                if(exist_flag){
                  socket.emit('error', 'Song Already Exists');
                  return;
                }
                app.locals.songs.push(songData);
                queue.push(songData);
                console.log("Stuck ", app.locals.stuck);
                io.to(decoded.data.room).emit('songadded', queue);
                if(app.locals.stuck == true)  //reload after a gap in the song queue
                    io.to(decoded.data.room).emit('nextSong', app.locals.songs[app.locals.currentsong++]);
              });
          });

      });

      socket.on('next', function(token){
          //next song in the list
          jwt.verify(token, app.get('secretkey'), function(err, decoded){
              if(err)
                console.log({success: false, message:'An error Occurred in Next'});
              console.log('Requesting next song', app.locals.songs, app.locals.songs[app.locals.currentsong]);
              if(app.locals.songs.length > app.locals.currentsong+1){
                  app.locals.currentsong++;
                  console.log('Current',  app.locals.currentsong,app.locals.songs[app.locals.currentsong]);
                  io.to(decoded.data.room).emit('nextSong', app.locals.songs[app.locals.currentsong]);
                  app.locals.stuck = false;
              }
              else app.locals.stuck = true;
          });

      });

      socket.on('songControl', function(payload, token){
        jwt.verify(token, app.get('secretkey'), function(err, decoded){
            if(err)
              console.log({success: false, message:'An error Occurred in SongControl'});
            console.log('Requesting '+payload);
            io.to(decoded.data.room).emit('songControl', payload)
        });
      });
});


function getSongData(songurl, data, cb){
    console.log('getSongData ', 'http://www.youtube.com/oembed?url='+songurl+'&format=json');
    http.get('http://www.youtube.com/oembed?url='+songurl+'&format=json', function(res){
        var body = '';
        res.on("data", function(chunk) {
          body += chunk;
        });
        songurl = 'https://www.youtube.com/embed/'+songurl.split('=')[1]+'?enablejsapi=1&controls=0&autoplay=1';

        res.on("end", function(){
            body = JSON.parse(body);
            // console.log("song data", body);
            data = {
                playname : data.room,
                title : body.title.length > 25 ? body.title.substr(0,25) + '..' : body.title,
                thumburl : body.thumbnail_url,
                link : songurl,
                username : data.name
            }
            console.log('song data', data);
            return cb(data);
        });

    });

}
