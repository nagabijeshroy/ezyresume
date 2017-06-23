/**
 * Created by sharmo on 4/24/17.
 */

var audio = new Audio();

function searchSpotify(searchType, inputText) {
    spotifyEndPoint = "https://api.spotify.com/v1/search?q=";
    spotifyType = "&type=".concat(searchType);
    searchText = inputText.replace(" ", "%20");
    spotifyURL = spotifyEndPoint.concat(searchText).concat(spotifyType);
    // alert(spotifyURL);
    // $.getJSON( spotifyURL, {
    //     format: "json"
    // })
    //     .success(function( response ) {
    //         console.log(response);
    //         if (searchType == 'track'){
    //             var track = response.tracks.items[0];
    //             console.log(track);
    //             if (track != undefined){
    //                 console.log(track.preview_url);
    //                 playAudio(track.preview_url);
    //                 communicateAction('<div>Playing <b>' + track.name + '</b> by <b>' + track.artists[0].name + '</b> from the Album <b>' + track.album.name + '</b></div><img width="150" src="' + track.album.images[1].url + '">');
    //             }
    //             else{
    //                 communicateAction('Could not find track');
    //             }
    //         }
    //
    //     });

    $.ajax({
        url: spotifyURL,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("access_token")
        },
        success: function(response) {
            alert(response);
        }
    });
}

function playAudio(url) {
    audio.src = url;
    audio.play();
}

function stopAudio() {
    audio.pause();
    clearFields();
}

function clearFields() {
    communicateAction(" ");
    document.getElementById('searchTrack').value = '';
    document.getElementById('searchAlbum').value = '';
    document.getElementById('searchArtist').value = '';
}


function playSportifySnippet() {
    trackName = document.getElementById('searchTrack').value;
    albumName = document.getElementById('searchAlbum').value;
    artistName = document.getElementById('searchArtist').value;
    inputText = trackName.concat("+").concat(albumName).concat("+").concat(artistName);
    console.log(inputText);
    searchSpotify('track', inputText);
}

function communicateAction(text) {
    var rec = document.getElementById('conversation');
    rec.innerHTML = '<div class="action">' + text + '</div>';
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
$(function() {
    var availableTags = getCookie('_searches').split(',');
    $("#tags").autocomplete({
        source: availableTags
    });
});