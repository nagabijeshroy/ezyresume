/**
 * Created by sharmo on 4/27/17.
 */
isPopUpCloseClicked = false;

function openPopUpFunction(element) {
    var el_id = $(element).attr("id");
    var btn_nbr = el_id[el_id.length - 1];
    if (isPopUpCloseClicked == false) {
        var el = document.getElementById("toolTipForm_".concat(btn_nbr));
        if (el != null){
            el.className = el.className.replace('invisible', 'visible');
        }
    }
    else {
        isPopUpCloseClicked = false;
    }
}

function saveButtonProperties(element) {
    var el_id = $(element).attr("id");
    var btn_nbr = el_id[el_id.length - 1];
    var newBtnText = document.getElementById("newBtnText_".concat(btn_nbr)).value;
    if (newBtnText!= ''){
        document.getElementById("btnName_".concat(btn_nbr)).innerText = newBtnText;
    }
}

function closeToolTip(element) {
    var parentId = $(element).closest("span").attr("id");
    var el = document.getElementById(parentId);
    el.className = el.className.replace('visible', 'invisible');
    isPopUpCloseClicked = true;
}

function buttonNameOnKeyUp(element) {
    var el_id = $(element).attr("id");
    var btn_nbr = el_id[el_id.length - 1];
    var btnNameId = "btnName_" + btn_nbr;
    var textEntered = document.getElementById("newBtnText_".concat(btn_nbr)).value;
    if (textEntered!= ''){
        var button_html = '<span id=' + btnNameId + '><img src="img/play_icon.jpg" id="music_btn_img" style="width: 20px;height: 20px; vertical-align: middle"/>&nbsp;'+textEntered+'</span>';
        document.getElementById("newBtnActionText_".concat(btn_nbr)).value = textEntered;
        document.getElementById("btnName_".concat(btn_nbr)).innerHTML = button_html;
    }

}

function colorRadioButtonOnChange(element){
    var el_id = $(element).attr("id");
    var btn_nbr = el_id[el_id.length - 1];
    var radio_btn_name = 'newBtnColor_'+btn_nbr;
    var color=$('[name='+radio_btn_name+']:checked').val();
    // console.log(color);
    var class_name = document.getElementById("btn_".concat(btn_nbr)).className;
    var change_flag = false;
    buttonColors.forEach(function (btn_color_option){
        if (class_name.indexOf(btn_color_option.concat("Button")) != -1){
            class_name = class_name.replace(btn_color_option.concat("Button"), color+'Button');
            change_flag = true;
        }
    });
    if (change_flag == true){
        document.getElementById("btn_".concat(btn_nbr)).className = class_name;
    }
    else{
        document.getElementById("btn_".concat(btn_nbr)).className += ' '+color+'Button';
    }
}

function actionRadioButtonOnChange(element, voice, pitch, rate){
    var el_id = $(element).attr("id");
    var btn_nbr = el_id[el_id.length - 1];
    var radio_btn_name = 'newBtnAction_'+btn_nbr;
    var actionType=$('[name='+radio_btn_name+']:checked').val();
    actionType = actionType.toLowerCase().replace(' ','');
    // console.log(actionType);
    var className = document.getElementById("btn_".concat(btn_nbr)).className;
    var voiceOptions = document.getElementById('newBtnVoiceOptions_'+btn_nbr);
    var liveMusicFieldSet = document.getElementById ('newBtnActionTextFieldset_'+btn_nbr);
    var buttonActionText = document.getElementById('newBtnActionText_'+btn_nbr);
    if (actionType == 'tts'){
        voiceOptions.style.display = 'block';
        buttonActionText.style.display = 'block';
        liveMusicFieldSet.style.display = 'none';
        // set voice controls to scene default
        var default_voice = document.getElementById("scene_default_TTS_voice").value;
        var default_pitch = document.getElementById("scene_default_TTS_pitch").value;
        var default_rate = document.getElementById("scene_default_TTS_rate").value;
        // console.log(default_voice);  console.log(default_pitch);  console.log(default_rate);
        document.getElementById('popUpVoiceSelectBtn_'+btn_nbr).value = default_voice;
        document.getElementById('popUpPitchSelectBtn_'+btn_nbr).value = default_pitch;
        document.getElementById('popUpRateSelectBtn_'+btn_nbr).value = default_rate;
    }
    else{
        voiceOptions.style.display = 'none';
        buttonActionText.style.display = 'none';
        liveMusicFieldSet.style.display = 'block';
    }
    if (className.indexOf('livestream') != -1){
        className = className.replace('livestream',actionType);
    }
    else if (className.indexOf('tts') != -1){
        className = className.replace('tts',actionType);
    }
    else{
        className += (' '+actionType) ;
    }
    document.getElementById("btn_".concat(btn_nbr)).className = className;
}


function removeButton(element) {
    var el_id = $(element).attr("id");
    var btn_nbr = el_id[el_id.length - 1];
    document.getElementById("btn_".concat(btn_nbr)).remove();
}

function TTSvoiceOptionsOnChange (element){
    var el_id = $(element).attr("id");
    var btn_nbr = el_id[el_id.length - 1];
    document.getElementById("btn_"+btn_nbr).className = document.getElementById("btn_"+btn_nbr).className.replace('defaultVoiceOptions','');
    // alert(document.getElementById("btn_"+btn_nbr).className);
}

function onTTSVoiceSelect(element) {
    var el_id = $(element).attr("id");
    var btn_nbr = el_id[el_id.length - 1];
    var e = document.getElementById("popUpVoiceSelectBtn_"+btn_nbr);
    var selectedVoice = e.options[e.selectedIndex].value;
    var selectedPitch = document.getElementById("popUpPitchSelectBtn_"+btn_nbr).options[document.getElementById("popUpPitchSelectBtn_"+btn_nbr).selectedIndex].value;
    var selectedRate = document.getElementById("popUpRateSelectBtn_"+btn_nbr).options[document.getElementById("popUpRateSelectBtn_"+btn_nbr).selectedIndex].value;
    var actionText = document.getElementById("newBtnActionText_"+btn_nbr).value;
    if (actionText == ''){
        actionText = 'This is a new Button. Please enter action text for this button.';
    }
    speak(actionText, selectedVoice, selectedRate, selectedPitch);
}

function speak(text, voice_selected, rate, pitch) {
    // Create a new instance of SpeechSynthesisUtterance.
    var msg = new SpeechSynthesisUtterance();
    // Set the text.
    msg.text = text;
    // Set the attributes.
    msg.volume = 1.0;
    msg.rate = parseFloat(rate);
    msg.pitch = parseFloat(pitch);
    msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == voice_selected; })[0];
    msg.lang = 'en-US';
    window.speechSynthesis.speak(msg);
}


var audio = new Audio();

function previewMusic (element){
    var el_id = $(element).attr("id");
    var btn_nbr = el_id[el_id.length - 1];
    var album_text = document.getElementById('newBtnAlbumText_'+btn_nbr).value;
    var artist_text = document.getElementById('newBtnArtistText_'+btn_nbr).value;
    var track_text = document.getElementById('newBtnTrackText_'+btn_nbr).value;
    // console.log(album_text); console.log(artist_text); console.log(track_text);
    var buttonActionText = "";
    if (album_text!="" && album_text!=" " && album_text!= null){
        buttonActionText += "album:"+album_text;
    }
    if (artist_text!="" && artist_text!=" " && artist_text!= null){
        buttonActionText += "+artist:"+artist_text;
    }
    if (track_text!="" && track_text!=" " && track_text!= null){
        buttonActionText += "+track:"+track_text;
    }
    buttonActionText = buttonActionText.replace(new RegExp(' ', 'g'), '%20');
    playMusic (buttonActionText, 'track');
}

function playMusic (inputText, searchType) {
    spotifyEndPoint = "https://api.spotify.com/v1/search?q=";
    spotifyType = "&type=".concat("track");
    searchText = inputText.replace(" ","%20");
    spotifyURL = spotifyEndPoint.concat(searchText).concat(spotifyType);
    // alert(spotifyURL);
    console.log(spotifyURL);
    $.getJSON( spotifyURL, {
        format: "json"
    })
        .success(function( response ) {
            // console.log(response);
            if (searchType == 'track'){
                // var track = response.tracks.items[0];
                // console.log(track);
                var track = null;
                var track_items = response.tracks.items;
                var preview = null;
                for (i=0; i<track_items.length; i++){
                    if (track_items[i].preview_url != null || track_items[i].preview_url != undefined ){
                        preview = track_items[i].preview_url;
                        track = track_items[i];
                        break;
                    }
                }

                if (preview != null){
                    var modal = document.getElementById('myModal');
                    modal.style.display = "block";
                    document.getElementById('music_details').innerHTML = 'Playing <b>' + track.name + '</b> by <b>' + track.artists[0].name + '</b> from the Album <b>' + track.album.name + '</b>';
                    document.getElementById('music_img').src = track.album.images[1].url;
                    playAudio(preview);
                }
                else{
                    modalOpen();
                    document.getElementById('music_details').innerHTML = '<b>Could not find track</b>';
                    document.getElementById('music_img').src = null;
                    // alert('Could not find track');
                }
            }

        });
}

function playAudio(url) {
    nowPlaying = true;
    audio.volume = 1.0;
    audio.src = url;
    audio.play();
}

function modalOpen() {
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
}

function modalClose() {
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
    audio.pause();
}

audio.addEventListener("ended", function(){
    modalClose();
});

