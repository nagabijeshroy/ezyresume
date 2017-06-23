var test_name = '';
var sceneName = '';
var voices;
var safe_mode;

var container_class_padding_left;
var container_class_padding_right;
var container_class_padding_top;
var container_class_padding_bottom;

var default_voice;
var default_pitch;
var default_rate;

$(function() {
    container_class_padding_left = parseFloat($('#container').css('padding-left').toString().replace('px', ''));
    container_class_padding_right = parseFloat($('#container').css('padding-right').replace('px', ''));
    container_class_padding_top = parseFloat($('#container').css('padding-top').replace('px', ''));
    container_class_padding_bottom = parseFloat($('#container').css('padding-bottom').replace('px', ''));
    test_name = localStorage.getItem("test_name_to_render");
    safe_mode = localStorage.getItem("safe_mode");
    if (safe_mode == 'true') {
        document.getElementById('controls').style.visibility = 'hidden';
    } else {
        document.getElementById('controls').style.visibility = 'visible';
    }
    document.getElementById('delete_scene').style.visibility = 'hidden';
    document.getElementById('edit_scene').style.visibility = 'hidden';
    document.getElementById('duplicate_scene').style.visibility = 'hidden';
    var data = {
        "operation": "get_scene_names",
        "scene_name": '',
        "scene_details": '',
        "test_name": test_name
    };
    onload_func(data);
});

function onload_func(data) {
    // Fetch the available voices.
    voices = speechSynthesis.getVoices(); //alert(voices);
    window.speechSynthesis.onvoiceschanged = function(e) {
        voices = speechSynthesis.getVoices(); //alert(voices);
    };
    $.ajax({
        url: 'https://5fsmvqzj6a.execute-api.us-east-1.amazonaws.com/WOZ_scenes',
        type: 'POST',
        cache: false,
        data: JSON.stringify(data),
        beforeSend: function() { $('#loader').show(); },
        success: function(res) {
            // alert( JSON.stringify(res) );
            populate_scene_buttons(res.split("###"));
            var init_prompt = test_name;
            $("#button-area").empty();
            var fromTop = $("#button-area").height(); //console.log(fromTop); console.log($( "#button-area" ).height());
            $("#button-area").append('<h4 id="sceneName" style="text-align: center; font-size:200px; opacity: 0.025; font-family:Caflisch Script Pro, cursive">' + init_prompt + '</h4>');
            $('#sceneName').center({
                against: '#button-area',
                top: fromTop
            });
        },
        error: function(e) {
            onload_func(data);
        },
        complete: function() { $('#loader').hide(); }
    });
}

// populating the right hand column with buttons to all saved screen lists
function populate_scene_buttons(scene_list) {
    scene_list.forEach(function(scene_name) {
        if (scene_name != '') {
            var scene_button = $('<input/>', {
                class: 'scene_btn col-xs-12',
                id: scene_name.concat('_btn'),
                value: scene_name,
                click: function() { scene_btn_onclick(scene_name); },
                type: 'button',
                style: 'text-align:center; margin: 0px 0px 20px 0px;'
            });
            $('#scene-buttons').append(scene_button);
            $('#scene-buttons').append('<br><br>');
            // console.log('#'.concat(scene_name).concat('_btn'));

        }
    });
}

function scene_btn_onclick(scene_name) {
    var data = {
        "operation": "get",
        "scene_name": scene_name,
        "scene_details": '',
        "test_name": test_name
    };
    $.ajax({
        url: 'https://5fsmvqzj6a.execute-api.us-east-1.amazonaws.com/WOZ_scenes',
        type: 'POST',
        cache: false,
        data: JSON.stringify(data),
        beforeSend: function() { $('#loader').show(); },
        success: function(res) {
            render_scene(JSON.stringify(res).replace('[', '').replace(']', '').replace('}"', '}').split("###"), scene_name);
        },
        error: function(e) { alert('Lambda returned error\n\n' + e.responseText); },
        complete: function() { $('#loader').hide(); }
    });
}

// render the selected scene on the scene area
function render_scene(scene_detail_list, scene_name) {
    $("#button-area").empty();
    var fromTop = $("#button-area").height() / 32; //console.log(fromTop); console.log($( "#button-area" ).height());
    $("#button-area").append('<span id="sceneName" style="position:absolute; font-size:300px; opacity: 0.025; font-family:Caflisch Script Pro, cursive">' + scene_name + '</span>');
    $('#sceneName').center({
        against: '#button-area',
        top: fromTop
    });
    // var widthOfStage = parseFloat($( "#button-area" ).width())-20;
    // $( "#button-area" ).append('<img src="img/edit_icon.png" style = "width:50px; height:50px;" align="right" onclick="editScene()">');
    scene_detail_list.forEach(function(scene_detail) {
        if (scene_detail != '"') {
            // alert(scene_detail);
            var scene_detail_evaled = eval('("' + scene_detail + '")');
            var scene_detail_json = JSON.parse(scene_detail_evaled);
            // alert (scene_detail_json + "\t::\t" + typeof scene_detail_json);

            if (scene_detail_json['type'] == 'button') {
                // alert('button');
                var class_name = scene_detail_json['color'].concat('Button');
                var btn_txt = scene_detail_json['buttonText'];
                var btn_id = scene_detail_json['id'];
                var btn_action = scene_detail_json['action'];
                var btn_action_text = scene_detail_json['buttonActionText'];
                var btn_voice = scene_detail_json['ttsVoice'];
                var btn_pitch = scene_detail_json['ttsPitch'];
                var btn_rate = scene_detail_json['ttsRate'];
                var left = parseFloat(scene_detail_json['left']) + container_class_padding_left; //console.log(container_class_padding_left);
                // console.log('Button left '+left); console.log('display_vs_edit_container_diff_left '+display_vs_edit_container_diff_left);
                // console.log('Parent Box Left '+$('#button-area').offset().left);
                var top = parseFloat(scene_detail_json['top']) + container_class_padding_top; //console.log(container_class_padding_top);
                // console.log('Parent Box Top '+ $('#button-area').offset().top);
                // console.log('Button Top '+top);console.log('display_vs_edit_container_diff_top '+display_vs_edit_container_diff_top);
                var btn_html = '<span>' +
                    '<img src="img/play_icon.jpg" id="music_btn_img_' + btn_id + '" style="width: 20px;height: 20px;"/> ' +
                    btn_txt +
                    '<span id="buttonActionText_' + btn_id + '" style="display: none;width: 20px;height: 20px;">' + btn_action_text + '</span>' +
                    '</span>';
                var scene_button = $('<button/>', {
                    class: class_name,
                    id: btn_id,
                    // value: btn_txt,
                    html: btn_html,
                    type: 'button',
                    // style: 'text-align:center; left:'+left+'px; top:'+top+'px;',
                    style: 'width: auto; position: absolute; text-align:center; left:' + left + 'px; top:' + top + 'px;',
                    // style: 'position: relative;',
                    click: function() { btn_onclick(btn_action_text, btn_action, btn_id, false, btn_voice, btn_pitch, btn_rate) }
                });
                $('#button-area').append(scene_button);

            } else if (scene_detail_json['type'] == 'header') {
                // alert(scene_detail_evaled);
                var header_id = scene_detail_json['id'];
                var header_class = 'scene_group_header';
                var headerTxt = scene_detail_json['headerText'];
                var left = parseFloat(scene_detail_json['left']) + container_class_padding_left;
                var top = parseFloat(scene_detail_json['top']) + container_class_padding_top;

                var scene_header = $('<h4/>', {
                    class: header_class,
                    id: header_id,
                    text: headerTxt,
                    // style: 'text-align:center; left:'+left+'px; top:'+top+'px;'
                    style: 'position: absolute; text-align:center; left:' + left + 'px; top:' + top + 'px;'
                });
                $('#button-area').append(scene_header);
                $('#button-area').append('<br/>');
            } else if (scene_detail_json['type'] == 'ttsSpeak') {
                // alert("TTS");
                var left = parseFloat(scene_detail_json['left']) + container_class_padding_left;
                var top = parseFloat(scene_detail_json['top']) + container_class_padding_top;
                var TTSfreeForm_divContent = '<div style="font-weight: 500">Speak</div>' +
                    '<table style="height:100%">' +
                    '                   <tr>' +
                    '                       <td>' +
                    '                           <input id ="freeForm_text_tts" style="height: 90%" type="text" placeholder="  Enter TTS Text">' +
                    '                       </td>' +
                    '                       <td style="padding: 5px;">' +
                    '                           <img id="freeForm_img_tts" src="img/tts_icon.png" style = "width:30px; height:30px" onclick="tts_freeText();">' +
                    '                       </td>' +
                    '                   </tr>' +
                    '                </table>';
                var scene_button = $('<div/>', {
                    html: TTSfreeForm_divContent,
                    style: 'width: auto; position: absolute; text-align:center; left:' + left + 'px; top:' + top + 'px;'
                });
                $('#button-area').append(scene_button);

            } else if (scene_detail_json['type'] == 'musicSearch') {
                // alert("Music");
                var left = parseFloat(scene_detail_json['left']) + container_class_padding_left;
                var top = parseFloat(scene_detail_json['top']) + container_class_padding_top;
                var musicSearchfreeForm_divContent = '<div><b>Music Search</b></div>' +
                    '<table style="height:50%">' +
                    '                   <tr>' +
                    '                       <td>' +
                    '                           <input id ="freeForm_text_music_album" style=" height: 90%" type="text" placeholder="  Enter Album Name ">' +
                    '                       </td>' +
                    '                       <td>' +
                    '                           <input id ="freeForm_text_music_artist" style="height: 90%" type="text" placeholder="  Enter Artist Name ">' +
                    '                       </td>' +
                    '                       <td>' +
                    '                           <input id ="freeForm_text_music_track" style="height: 90%" type="text" placeholder="  Enter Track Name ">' +
                    '                       </td>' +
                    '                       <td style="padding: 5px;">' +
                    '                           <img id="freeForm_img_music" src="img/music_icon.png" style = "width:30px; height:30px" onclick="musicSearch_freeText();">' +
                    '                       </td>' +
                    '                   </tr>' +
                    '                </table>';
                var music_search = $('<div/>', {
                    html: musicSearchfreeForm_divContent,
                    style: 'width: auto; position: absolute; text-align:center; left:' + left + 'px; top:' + top + 'px;'
                });
                $('#button-area').append(music_search);
            } else if (scene_detail_json['type'] == 'sttListen') {
                // alert("Music");
                var left = parseFloat(scene_detail_json['left']) + container_class_padding_left;
                var top = parseFloat(scene_detail_json['top']) + container_class_padding_top;
                var STTfreeForm_divContent = '<div id="stt_header"><b>Listen</b></div>' +
                    '<table style="height:50%">' +
                    '                   <tr>' +
                    '                       <td>' +
                    '                           <img id="stt_btn" src="img/mic_off_icon.png" style = "width:60px; height:70px">' +
                    '                       </td>' +
                    '                   </tr>' +
                    '                </table>';
                var stt = $('<div/>', {
                    id: 'stt_freeForm',
                    style: 'width: auto; position: absolute; text-align:center; left:' + left + 'px; top:' + top + 'px;',
                    html: STTfreeForm_divContent,
                    click: function() { listen_btn_onclick(); }
                });
                $('#button-area').append(stt);
            } else if (scene_detail_json['type'] == 'defaultTTSParameters') {
                default_voice = scene_detail_json['ttsVoice'];
                default_pitch = scene_detail_json['ttsPitch'];
                default_rate = scene_detail_json['ttsRate'];
            }
        }
    });

    if (safe_mode == 'false') {
        document.getElementById('delete_scene').style.visibility = 'visible';
        document.getElementById('delete_scene').value = 'Delete ' + scene_name;
        document.getElementById('edit_scene').style.visibility = 'visible';
        document.getElementById('edit_scene').value = 'Edit ' + scene_name;
        document.getElementById('duplicate_scene').style.visibility = 'visible';
        document.getElementById('duplicate_scene').value = 'Duplicate ' + scene_name;
    }
    sceneName = scene_name;
}

function musicSearch_freeText() {
    var album_text = document.getElementById('freeForm_text_music_album').value;
    var artist_text = document.getElementById('freeForm_text_music_artist').value;
    var track_text = document.getElementById('freeForm_text_music_track').value;
    var text = '';
    if (album_text != "" && album_text != " " && album_text != null) {
        text += "album:" + album_text;
    }
    if (artist_text != "" && artist_text != " " && artist_text != null) {
        text += "+artist:" + artist_text;
    }
    if (track_text != "" && track_text != " " && track_text != null) {
        text += "+track:" + track_text;
    }
    text = text.replace(new RegExp(' ', 'g'), '%20');
    // console.log(text);
    btn_onclick(text, 'Live Stream', true);
}

function tts_freeText() {
    var text = $('#freeForm_text_tts').val();
    btn_onclick(text, 'TTS');
}

var nowPlaying = false;
var current_audio_button;

function btn_onclick(btn_txt, btn_action, btn_id, isFreeSearch, btn_voice, btn_pitch, btn_rate) {
    if (nowPlaying == false) {
        if (btn_action == 'Live Stream') {
            if (isFreeSearch == false) {
                var im = 'music_btn_img_' + btn_id;
                document.getElementById(im).src = 'img/pause_icon.png';
                current_audio_button = btn_id;
            } else {
                document.getElementById("freeForm_img_music").src = 'img/pause_icon.png';
            }
            nowPlaying = true;
            PlayBackResponse(btn_txt);
        } else {
            convertToSpeech(btn_txt, btn_voice, btn_pitch, btn_rate);
        }
    } else if (btn_action == 'TTS') {
        convertToSpeech(btn_txt, btn_voice, btn_pitch, btn_rate);
    } else if (btn_id != current_audio_button) {
        stop_playing(current_audio_button);
        var im = 'music_btn_img_' + btn_id;
        document.getElementById(im).src = 'img/pause_icon.png';
        current_audio_button = btn_id;
        nowPlaying = true;
        PlayBackResponse(btn_txt);
    } else {
        stop_playing(current_audio_button);
    }

}


function PlayBackResponse(text) {
    // alert("PlayBackResponse ::  "+text);
    if ($.isEmptyObject(localStorage.getItem("lastSpotifyAuthorizationtime"))) {
        var spotifyAuthorize = window.open('spotify_auth.html', 'spotifyAuthorize', "height=800,width=600");
        spotifyAuthorize.focus();
    } else if (localStorage.getItem("lastSpotifyAuthorizationtime") - new Date().getTime() > 60 * 60 * 1000) {
        var spotifyAuthorize = window.open('spotify_auth.html', 'spotifyAuthorize', "height=800,width=600");
        spotifyAuthorize.focus();
    }
    searchSpotify('track', text);
}

var audio = new Audio();

function convertToSpeech(ttsText, btn_voice, btn_pitch, btn_rate) {
    speechSynthesis.cancel();
    var ttsPitch = 1; //document.getElementById('ttsPitch').value;
    var ttsRate = 1; //document.getElementById('ttsRate').value;
    // console.log(btn_voice); console.log(btn_pitch); console.log(btn_rate);
    if (btn_voice == undefined) {
        btn_voice = default_voice;
    }
    if (btn_pitch == undefined) {
        btn_pitch = default_pitch;
    }
    if (btn_rate == undefined) {
        btn_rate = default_rate;
    }
    var msg = new SpeechSynthesisUtterance();
    msg.volume = 1; // 0 to 1
    msg.rate = btn_rate; // 0.1 to 10
    msg.pitch = btn_pitch; //0 to 2
    msg.text = ttsText;
    // msg.lang = 'en-US';
    msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == btn_voice; })[0];
    msg.onstart = function(event) {
        // console.log('The utterance started to be spoken.')
        if (nowPlaying == true) {
            audio.volume = 0.1;
        }
    };
    msg.onend = function(event) {
        if (nowPlaying == true) {
            audio.volume = 1.0;
        }
    };

    speechSynthesis.speak(msg);
}


function searchSpotify(searchType, inputText) {
    // console.log(inputText);
    spotifyEndPoint = "https://api.spotify.com/v1/search?q=";
    spotifyType = "&type=".concat(searchType);
    searchText = inputText.replace(" ", "%20");
    spotifyURL = spotifyEndPoint.concat(searchText).concat(spotifyType);
    // alert(spotifyURL);
    console.log(spotifyURL);
    $.getJSON(spotifyURL, {
            format: "json"
        })
        .success(function(response) {
            // console.log(response);
            if (searchType == 'track') {
                // var track = response.tracks.items[0];
                // console.log(track);
                var track = null;
                var track_items = response.tracks.items;
                var preview = null;
                for (i = 0; i < track_items.length; i++) {
                    if (track_items[i].preview_url != null || track_items[i].preview_url != undefined) {
                        preview = track_items[i].preview_url;
                        track = track_items[i];
                        break;
                    }
                }

                if (preview != null) {
                    playAudio(preview);
                    var inset_content = '<div></div>' +
                        '<table style="width:100%">' +
                        '                   <tr>' +
                        '                       <td>' +
                        '                           Playing <b>' + track.name + '</b> by <b>' + track.artists[0].name + '</b> from the Album <b>' + track.album.name + '</b>' +
                        '                       </td>' +
                        '                       <td style="padding: 5px;">' +
                        '                           <img id="freeForm_img_music" src="' + track.album.images[1].url + '" style = "width:50px; height:50px">' +
                        '                       </td>' +
                        '                   </tr>' +
                        '                </table>';
                    communicateAction(inset_content);
                } else {
                    communicateAction('Could not find track');
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

function stop_playing(btn_id) {
    if (btn_id != '') {
        var im = 'music_btn_img_' + btn_id;
        document.getElementById(im).src = 'img/play_icon.jpg';
    }
    document.getElementById("freeForm_img_music").src = 'img/music_icon.png';
    if (document.getElementById("stt_btn") != null) {
        document.getElementById("stt_btn").src = 'img/mic_off_icon.png';
    }
    nowPlaying = false;
    audio.pause();
    var last_activity = '<div><b><i>Last Activity</i></b></div>' +
        document.getElementById('current_activity').innerHTML.replace("Playing", "Played");
    document.getElementById('last_activity').innerHTML = last_activity;
    document.getElementById('current_activity').innerHTML = '<h4> Current Activity</h4>';
}

audio.addEventListener("ended", function() {
    if (current_audio_button != null && current_audio_button != "" && current_audio_button != undefined) {
        document.getElementById('music_btn_img_' + current_audio_button).src = 'img/play_icon.jpg';
    }
    document.getElementById("freeForm_img_music").src = 'img/music_icon.png';
    document.getElementById("stt_btn").src = 'img/mic_off_icon.png';
    document.getElementById('stt_header').innerHTML = '<b>Listen</b>';
    console.log(current_audio_button);
    var last_activity = '<div><b><i>Last Activity</i></b></div>' +
        document.getElementById('current_activity').innerHTML.replace("Playing", "Played");
    document.getElementById('last_activity').innerHTML = last_activity;
    document.getElementById('current_activity').innerHTML = '<h4> Current Activity</h4>';
    current_audio_button = '';
    nowPlaying = false;
});

function communicateAction(text) {
    var rec = document.getElementById('current_activity');
    rec.innerHTML = '<div class="action">' + text + '</div>';
}

function editScene() {
    var currentScene = document.getElementById('sceneName').innerHTML;
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("scene_name_to_edit", currentScene);
        localStorage.setItem("test_name_to_edit", test_name);
    } else {
        alert('unsupported browser');
    }
    var win = window.open('customitems.html', '_blank');
    win.focus();
}

function createNewScene() {
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("scene_name_to_edit", '');
        localStorage.setItem("test_name_to_edit", test_name);
    } else {
        alert('unsupported browser');
    }
    var win = window.open('customitems.html', '_blank');
    win.focus();
}

function deleteScene(element) {
    var scene_name = element.value.replace('Delete ', '').trim();
    var user_response = confirm("Are you sure you want to delete " + scene_name);
    if (user_response == true) {
        var data = {
            "operation": "delete_scene",
            "scene_name": scene_name,
            "scene_details": '',
            "test_name": test_name
        };
        $.ajax({
            url: 'https://5fsmvqzj6a.execute-api.us-east-1.amazonaws.com/WOZ_scenes',
            type: 'POST',
            cache: false,
            data: JSON.stringify(data),
            beforeSend: function() {
                $('#loader').show();
            },
            success: function(res) {
                alert(JSON.stringify(res));
                location.reload();
            },
            error: function(e) {
                alert('Lambda returned error\n\n' + e.responseText);
            },
            complete: function() {
                $('#loader').hide();
            }
        });
    }

}

function deleteTest() {
    var user_response = confirm("Are you sure you want to delete " + test_name);
    if (user_response == true) {
        var data_for_deleting = {
            "operation": "delete_test",
            "scene_name": '',
            "scene_details": '',
            "test_name": test_name
        };

        $.ajax({
            url: 'https://5fsmvqzj6a.execute-api.us-east-1.amazonaws.com/WOZ_scenes',
            type: 'POST',
            cache: false,
            data: JSON.stringify(data_for_deleting),
            beforeSend: function() {
                $('#loader').show();
            },
            success: function(res) {
                alert(JSON.stringify(res));
            },
            error: function(e) {
                alert('Lambda returned error\n\n' + e.responseText);
            },
            complete: function() {
                $('#loader').hide();
            }
        });
    }
}

function duplicateScene() {
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
    document.getElementById("duplicate_scene_form_header").innerHTML = "Make a Duplicate of " + sceneName;
    document.getElementById("duplicate_test_name").value = test_name;
}

function modalClose() {
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
}

function createDuplicateScene() {
    var newSceneName = document.getElementById('duplicate_scene_name').value;
    var newTestName = document.getElementById('duplicate_test_name').value;
    // alert (newSceneName); alert(newTestName);
    var data_for_copying = {
        "operation": "get",
        "scene_name": sceneName,
        "scene_details": '',
        "test_name": test_name
    };

    $.ajax({
        url: 'https://5fsmvqzj6a.execute-api.us-east-1.amazonaws.com/WOZ_scenes',
        type: 'POST',
        cache: false,
        data: JSON.stringify(data_for_copying),
        beforeSend: function() { $('#loader').show(); },
        success: function(res) {
            // alert( JSON.stringify(res) );   console.log(res[0]);
            data_for_copying = {
                "operation": "save",
                "scene_name": newSceneName,
                "scene_details": res[0],
                "test_name": newTestName
            };

            $.ajax({
                url: 'https://5fsmvqzj6a.execute-api.us-east-1.amazonaws.com/WOZ_scenes',
                type: 'POST',
                cache: false,
                data: JSON.stringify(data_for_copying),
                beforeSend: function() { $('#loader').show(); },
                success: function(res) {
                    alert(JSON.stringify(res));
                },
                error: function(e) {
                    createDuplicateScene();
                },
                complete: function() { $('#loader').hide(); }
            });
            location.reload();
        },
        error: function(e) {
            createDuplicateScene();
        },
        complete: function() { $('#loader').hide(); }
    });

}

function listen_btn_onclick() {
    if (nowPlaying == true) {
        stop_playing('');
    } else {
        speechToText();
        // NLU_parse('DUMMY');
    }
}


function NLU_parse(phrase) {
    document.getElementById("stt_header").innerHTML = '<b>Searching</b>';
    document.getElementById("stt_btn").src = 'img/music_search.jpeg';
    var phrase = "play black by pearl jam";
    var data_semantic_parser = {
        "phrase": phrase
    };

    $.ajax({
        url: 'http://ampnlu-useast1b.lg.bosecm.com:7473/nlu/parse',
        type: 'POST',
        cache: false,
        contentType: 'application/json',
        data: JSON.stringify(data_semantic_parser),
        beforeSend: function() {
            $('#loader').show();
        },
        success: function(res) {
            // alert(JSON.stringify(res));
            parse_semantic_parser_response(res);
        },
        error: function(e) {
            alert('Semantic Parser Service returned error\n\n' + e.responseText);
        },
        complete: function() {
            $('#loader').hide();
        }
    });
}


function parse_semantic_parser_response(response) {
    // alert(response);
    // console.log(typeof response);
    console.log(response);
    // console.log(response.intent);
    if (response.intent.type != null) {
        var concepts = response.concepts;
        var track_name = "";
        var album_name = "";
        var artist_name = "";
        concepts.forEach(function(concept) {
            if (concept.type == "track") {
                track_name = concept.conceptName;
            } else if (concept.type == "album") {
                album_name = concept.conceptName;
            } else if (concept.type == "artist") {
                artist_name = concept.conceptName;
            }
        });
        // console.log(track_name); console.log(artist_name); console.log(album_name);
        var text = '';
        if (album_name != "" && album_name != " " && album_name != null) {
            text += "album:" + album_name;
        }
        if (artist_name != "" && artist_name != " " && artist_name != null) {
            text += "+artist:" + artist_name;
        }
        if (track_name != "" && track_name != " " && track_name != null) {
            text += "+track:" + track_name;
        }
        text = text.replace(new RegExp(' ', 'g'), '%20');
        document.getElementById("stt_btn").src = 'img/pause_icon.png';
        document.getElementById("stt_header").innerHTML = '<b>Playing</b>';
        searchSpotify('track', text);
    } else {
        convertToSpeech('Sorry I do not understand what you want me to do', default_voice, default_pitch, default_rate);
    }
}

function speechToText() {
    document.getElementById("stt_btn").src = "img/mic_on_icon.png";
    var phrase;
    var recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;
    recognition.start();
    recognition.onresult = function(event) {
        phrase = event.results[0][0].transcript;
        console.log('Input Phrase ::: ', phrase);
        document.getElementById("stt_btn").src = 'img/music_search.jpeg';
        NLU_parse(phrase);
    };
    recognition.onend = function(event) {
        console.log('ENDED');
    };
}