//--------------Session----------------

function resolveLogin(){
    var value = $('#username').val();
    var name, roomName;
    console.log('Value',value);
    if(value.split(".").length == 2){
        name = value.substring(0, value.indexOf('.'));
        roomName = value.substring(value.indexOf('.')+1);
        console.log(name+" "+roomName);
        var data = {room : roomName, username : name};
        socket.emit('subscribe', data);
        socket.on('joined', function(data){
            console.log(data);
            sessionStorage.accessToken = data.token;
            sessionStorage.accessAdmin = data.admin;
            if(data.admin)
                window.location = "/admin?token="+data.token;
            else window.location = "/user?token="+data.token;
        });
      }
    else alert("Enter as username.roomId");
}

function logout(){
    sessionStorage.accessToken = "";
    window.location = "/";
}

//-------------Songs-------------------

// Client to Server - Send submitted song to room
function addsong(){
    var songurl = $('#songurl').val();
    $('#songurl').val("");
    var data = {
        songurl : songurl,
        token : sessionStorage.accessToken
    };
    console.log('Song Data', data);
    socket.emit('addsong', data);
}

//Server to Client - Add queue to Queue
function addSongToQ(queue){
    _.forEach(queue, function(data){
      $('#queue').append('<div class ="card horizontal lighten-5 grey" >'+
            '<img class = "responsive-img" src="'+ data.thumburl +'" style = "height :10vh">'+
            '<div class = "card-content">'+
              '<a class="waves-effect waves-dark"  style ="color: #32292f"><span class = "title">'+data.title+'</span></a><br>'+
              '<p class = "grey-text">'+data.username+'<p>'+
            '</div>'+
      '</div>');
    });
}

function displayCurrentSong(data){
    console.log('Current Song', data);
    if(document.getElementById('bkdrop'))
      document.getElementById('bkdrop').style.backgroundImage = 'url("'+data.thumburl+'")';
    if(document.getElementById('songName'))
      $('#songName').text(data.title);
    if(document.getElementById('videoplayer')){
        player.loadVideoByUrl(data.link );
        socket.emit("songChanged");
      }
}


function onPlayerReady(event) {
  document.getElementById('videoplayer').style.borderColor = '#FF6D00';
}

function onPlayerStateChange(playState) {
  console.log('State ',playState.data);
  if(playState.data == 0)
      socket.emit('next', sessionStorage.accessToken);
}

function pausesong(){
    console.log('acess',sessionStorage.accessAdmin);
    if(sessionStorage.accessAdmin == 'true')
      player.pauseVideo();
    $('#play_div').show();
    $('#pause_div').hide();
}

function playsong(){
    if(sessionStorage.accessAdmin == 'true'){
      console.log("PLaying Song", player);
      player.playVideo();
    }
    $('#play_div').hide();
    $('#pause_div').show();
}

// function nextSong(){
//   if(sessionStorage.accessAdmin){
//     console.log("PLaying Song", player);
//     player.pauseVideo();
//   }
//   else socket.emit('songControl', 'play', sessionStorage.accessToken);
// }
