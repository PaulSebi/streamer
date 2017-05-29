var socket = io.connect('http://192.168.1.14:3000');
var player;

$(document).ready(function(){

    socket.on('handshake', function(data){
        console.log(data);
        if(sessionStorage.accessToken){
          console.log('Token',sessionStorage.accessToken);
          socket.emit('subscribed', sessionStorage.accessToken);
          socket.on('rejoined', function(data){
            console.log('Received Current List');
              if(sessionStorage.accessAdmin == 'false'){
                addSongToQ(data.queue);
                if(data.current != "")
                  displayCurrentSong(data.current);
              }
          });
        }
        console.log('Done');
    });

    socket.on('songadded', function(data){
        //append new song
        console.log('Song Added');
        addSongToQ(data);
        console.log(data);
    });

    socket.on('nextSong', function(data){
        displayCurrentSong(data);
    });

    socket.on('songControl', function(data){
        if(data == 'play')
          playsong();
        else if (data == 'pause')
          pausesong();
    })

    $('#namesubmit').click(resolveLogin);
    $('#songsubmit').click(addsong);
    $('#logout').click(logout);
    $('#next_song').click(function(){socket.emit('next', sessionStorage.accessToken)});
    $('#play').click(function(){socket.emit('songControl', 'play', sessionStorage.accessToken);});
    $('#pause').click(function(){socket.emit('songControl', 'pause', sessionStorage.accessToken);});

});

    function onYouTubeIframeAPIReady() {
      this.player = new YT.Player('videoplayer', {
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
      });
    }
