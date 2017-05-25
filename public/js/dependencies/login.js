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
    if(document.getElementById('videoplayer'))
        player.loadVideoByUrl(data.link );
}


function onPlayerReady(event) {
  document.getElementById('videoplayer').style.borderColor = '#FF6D00';
}
function onPlayerStateChange(playState) {
  console.log('State ',playState.data);
  if(playState.data == 0)
      socket.emit('next', sessionStorage.accessToken);
}
