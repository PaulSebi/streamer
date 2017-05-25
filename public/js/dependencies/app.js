var socket = io.connect('http://192.168.1.28:3000');

$(document).ready(function(){

    socket.on('handshake', function(data){
        console.log(data);
        if(sessionStorage.accessToken){
          console.log('Token',sessionStorage.accessToken);
          socket.emit('subscribed', sessionStorage.accessToken);
          socket.on('rejoined', function(data){
              //render data now
              console.log(data);
              addSongToQ(data.queue);
              socket.emit('next', sessionStorage.accessToken);
          });
        }
        console.log('Done');
    });

    socket.on('songadded', function(data){
        //append new song
        addSongToQ(data);
        console.log(data);
    });

    socket.on('nextSong', function(data){
        displayCurrentSong(data);
    })

    $('#namesubmit').click(resolveLogin);
    $('#songsubmit').click(addsong);
    $('#logout').click(logout);

});

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('videoplayer', {
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
  });
}
