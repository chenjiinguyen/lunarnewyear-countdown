// Variable
let url_api = "https://617ab8bccb1efe001700ffe6.mockapi.io/player";

// 1. Create iframe
let iframe = document.createElement('div');
iframe.id = 'music_player';
document.body.appendChild(iframe);

// 2. This code loads the IFrame Player API code asynchronously.
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

Array.prototype.shuffler = function () {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
}


fetch(url_api)
    .then(response => response.json())
    .then(data => {
        data = data[0];
        let playlist = data.playlist;
        let volume = data.volume;
        var player;

        window.YT.ready(function() {
            player = new YT.Player('music_player', {
                height: '0',
                width: '0',
                playerVars: {
                    controls: 0,
                    autoplay: 1,
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        });

        function onPlayerReady(event) {
            player.loadPlaylist({
                playlist: playlist.shuffler(),
            });
            player.setLoop(true);

            player.addEventListener('onStateChange', 'onPlayerStateChange');

            player.setVolume(volume);

            player.playVideo();

            var next = document.getElementById("next");
            next.addEventListener("click", function () {
                player.nextVideo();
            });
            var previous = document.getElementById("previous");
            previous.addEventListener("click", function () {
                player.previousVideo();
            });

            var control_player = document.getElementById("control-player");
            control_player.addEventListener("click", function () {
                if (player.getPlayerState() == 1) {
                    player.pauseVideo();
                    // document.querySelector("#index_player").innerHTML =  "<i class=\"fa fa-play-circle\"></i> (" + (player.getPlaylistIndex() + 1) + "/" + player.getPlaylist().length + ") ";
                } else {
                    // document.querySelector("#index_player").innerHTML =  "<i class=\"fa fa-pause-circle\"></i> (" + (player.getPlaylistIndex() + 1) + "/" + player.getPlaylist().length + ") ";
                    player.playVideo();
                }
            });

        }
        function onPlayerStateChange(event) {
            document.getElementById("title_player").innerText =  player.getVideoData().title;
            if (player.getPlayerState() == 1) {
                document.querySelector("#index_player").innerHTML =  "<i class=\"fa fa-play-circle\"></i> (" + (player.getPlaylistIndex() + 1) + "/" + player.getPlaylist().length + ") ";
            }else{
                document.querySelector("#index_player").innerHTML =  "<i class=\"fa fa-pause-circle\"></i> (" + (player.getPlaylistIndex() + 1) + "/" + player.getPlaylist().length + ") ";
            }
        }

    })
    .catch(error => console.log(error));
