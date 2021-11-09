// Variable
let url_api = "https://617ab8bccb1efe001700ffe6.mockapi.io/player";

// 1. Create iframe
let iframe = document.createElement('div');
iframe.id = 'music_player';
document.body.appendChild(iframe);


Array.prototype.shuffler = function () {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
}

function hasSomeParentTheClass(element, classname) {
    if (element.className.split(' ').indexOf(classname)>=0) return true;
    return element.parentNode && hasSomeParentTheClass(element.parentNode, classname);
}

Number.prototype.toTimer = function () {
    let sec = this.toFixed(0);

    function pad(n) {
        return (n < 10 ? "0" + n : n);
    }
    
    var h = Math.floor(sec / 3600);
    var m = Math.floor(sec / 60) - (h * 60);
    var s = Math.floor(sec - h * 3600 - m * 60);
    
    return pad(h) +":"+ pad(m) +":"+ pad(s);
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

            var volume_player = document.getElementById("volume-player");
            volume_player.value = volume;
            volume_player.addEventListener("input", function () {
                player.setVolume(this.value);   
            });

            var progress_player = document.getElementById("progressbar_player");
            progress_player.addEventListener("change", function() {
                player.seekTo(this.value / 100 * player.getDuration());
            });

            var volume_btn = document.getElementById("volume-btn");
            volume_btn.addEventListener("click", function () {
                if (player.isMuted()) {
                    player.unMute();
                    volume_btn.innerHTML = "<i class=\"fa fa-volume-up\"></i>";
                } else { 
                    player.mute();
                    volume_btn.innerHTML = "<i class=\"fa fa-volume-off\"></i>";
                }
            });
        }
        function onPlayerStateChange(event) {
            document.querySelector("#title_player").innerText =  player.getVideoData().title;
            document.querySelector("#index_player").innerHTML =  "(" + (player.getPlaylistIndex() + 1) + "/" + player.getPlaylist().length + ")";
            if (player.getPlayerState() == 1) {
                document.querySelector("#control-player").innerHTML = "<i class=\"fa fa-pause-circle\"></i>";
            }else{
                document.querySelector("#control-player").innerHTML = "<i class=\"fa fa-play-circle\"></i>";
            }

            
            setInterval(function () {
                document.querySelector("#time_now_player").innerHTML =  player.getCurrentTime().toTimer();
                document.querySelector("#time_total_player").innerHTML =  player.getDuration().toTimer();
                document.querySelector("#progressbar_player").value = (player.getCurrentTime() / player.getDuration()) * 100 ;
            }, 1000);
        }

    })
    .catch(error => console.log(error));

let show_modal = false;
document.querySelector(".bottom-player").addEventListener("click", function () {
    if (show_modal) {
        document.querySelector(".modal-player").style.display = "none";
        show_modal = false;
    } else {
        document.querySelector(".modal-player").style.display = "block";
        show_modal = true;
    }
});
