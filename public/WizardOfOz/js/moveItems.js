/**
 * Created by sharmo on 4/27/17.
 */
$( function() {
    $( ".draggable" ).draggable({ containment: "#containment-wrapper", scroll: false });
    page_onload();
} );


var btnCounter = 1;
var headerCounter = 1;
var btn_padding = 10;
var header_padding = 10;
var buttonColors = ['red','yellow','green'];
var buttonActionType = ['TTS', 'Live Stream'];
var voices = [];
var default_scene_TTS_voice;
var default_scene_TTS_pitch;
var default_scene_TTS_rate;


function page_onload() {
    get_voice_list();
    var scene_name = localStorage.getItem("scene_name_to_edit");
    var test_name = localStorage.getItem("test_name_to_edit");
    document.getElementById('sceneName').value = scene_name;
    document.getElementById('testName').value = test_name;
    // if its from the edit scene button click
    if (scene_name != ''){
        var data = {
            "operation" : "get",
            "scene_name": scene_name,
            "scene_details": '',
            "test_name": test_name
        };
        $.ajax({
            url: 'https://5fsmvqzj6a.execute-api.us-east-1.amazonaws.com/WOZ_scenes',
            type: 'POST',
            cache: false,
            data: JSON.stringify(data),
            beforeSend: function(){ $( '#loader' ).show();},
            success: function( res ) {
                render_scene(JSON.stringify(res).replace('[','').replace(']','').replace('}"','}').split("###"), scene_name, test_name);
            },
            error:function(e){ alert('Lambda returned error\n\n' + e.responseText); },
            complete:function(){ $('#loader').hide(); }
        });
    }
}

function get_voice_list(){
    // Fetch the available voices.
    voices = speechSynthesis.getVoices(); //alert(voices);
    window.speechSynthesis.onvoiceschanged = function(e) {
        voices = speechSynthesis.getVoices(); //alert(voices);
    };
}

function render_scene(scene_detail_list, scene_name, test_name) {
    var container_offset_left = $('#containment-wrapper').offset().left ;
    var container_offset_top = $('#containment-wrapper').offset().top ;

    scene_detail_list.forEach(function (scene_detail){
        if (scene_detail != '"') {
            var scene_detail_evaled = eval('("' + scene_detail + '")');
            var scene_detail_json = JSON.parse(scene_detail_evaled);

            // alert(scene_name);
            // alert(scene_detail_list);
            if (scene_detail_json['type'] == 'button') {
                var class_name = scene_detail_json['color'].concat('Button');
                var btn_txt = scene_detail_json['buttonText'].toString().trim();
                var btn_action_text = scene_detail_json['buttonActionText'];
                var btn_id = scene_detail_json['id'];
                var btn_action = scene_detail_json['action'];
                var btn_action_class = btn_action.toLowerCase().replace(' ','');
                var left = parseFloat(scene_detail_json['left']) + container_offset_left;
                var top = parseFloat(scene_detail_json['top'])+ container_offset_top;
                var btn_id = 'btn_'+btnCounter;
                var btn_action = scene_detail_json['action'];   //console.log(btn_action);
                var btn_voice = scene_detail_json['ttsVoice'];
                var btn_pitch =  scene_detail_json['ttsPitch'];
                var btn_rate = scene_detail_json['ttsRate'];
                // popup container
                var popUp = $('<span/>',
                    {
                        id: 'toolTipForm_' + btnCounter,
                        class: 'popup tooltiptext invisible',
                        name: 'toolTipForm_' + btnCounter
                    });
                // popup header
                var popUpHeader = $('<h3/>',
                    {
                        class: 'popup tooltipInputs',
                        text: 'Edit Button Properties',
                        style: 'text-align:center;'
                    });
                $(popUp).append(popUpHeader);
                // popup button name
                var buttonNameInputField = $('<input/>',
                    {
                        id: 'newBtnText_' + btnCounter,
                        class: 'popup tooltipInputs',
                        placeholder: "Button Text",
                        maxlength: "512",
                        value: btn_txt,
                        type: "text",
                        onkeyup: function () {
                            buttonNameOnKeyUp($(this));
                        }
                    });
                $(popUp).append(buttonNameInputField);
                // popup button color option
                buttonColors.forEach(function (btn_color_option) {
                    var buttonColorOption = $('<input/>',
                        {
                            id: 'newBtnColor_' + btnCounter,
                            class: 'popup tooltipInputs ' + btn_color_option + 'RadioButton',
                            name: 'newBtnColor_' + btnCounter,
                            value: btn_color_option,
                            type: "radio",
                            onchange: function () {
                                colorRadioButtonOnChange($(this));
                            }
                        });
                    $(popUp).append(buttonColorOption);
                });
                // popup button action selector
                $(popUp).append('&nbsp;');
                buttonActionType.forEach(function (action_type) {
                    if (btn_action == action_type){
                        var buttonAction = $('<input/>',
                            {
                                id: 'newBtnAction_' + btnCounter,
                                class: 'popup normalRadioButton',
                                name: 'newBtnAction_' + btnCounter,
                                value: action_type,
                                type: "radio",
                                checked: true,
                                onchange: function () {
                                    actionRadioButtonOnChange($(this), btn_voice, btn_pitch, btn_rate);
                                }
                            });
                    }
                    else{
                        var buttonAction = $('<input/>',
                            {
                                id: 'newBtnAction_' + btnCounter,
                                class: 'popup normalRadioButton',
                                name: 'newBtnAction_' + btnCounter,
                                value: action_type,
                                type: "radio",
                                onchange: function () {
                                    actionRadioButtonOnChange($(this), btn_voice, btn_pitch, btn_rate);
                                }
                            });
                    }

                    $(popUp).append(buttonAction);
                    $(popUp).append(action_type);
                    $(popUp).append('&nbsp;         ');

                });
                //////////////
                var actionTextFieldSet = $('<span/>',
                    {
                        id: 'newBtnActionTextFieldset_'+btnCounter,
                        class: 'popup toolTipVoiceOptions',
                        name : 'newBtnActionTextFieldset_'+btnCounter
                    });
                var buttonAlbumTextInputField = $('<input/>',
                    {
                        id: 'newBtnAlbumText_'+btnCounter,
                        class: 'popup tooltipInputs',
                        placeholder : "Playback Album",
                        maxlength : "512",
                        type: "text"    //,
                        // onkeyup: function () { buttonNameOnKeyUp($(this)); }
                    });
                $(actionTextFieldSet).append(buttonAlbumTextInputField);
                var buttonArtistTextInputField = $('<input/>',
                    {
                        id: 'newBtnArtistText_'+btnCounter,
                        class: 'popup tooltipInputs',
                        placeholder : "Playback Artist",
                        maxlength : "512",
                        type: "text"    //,
                        // onkeyup: function () { buttonNameOnKeyUp($(this)); }
                    });
                $(actionTextFieldSet).append(buttonArtistTextInputField);
                var buttonTrackTextInputField = $('<input/>',
                    {
                        id: 'newBtnTrackText_'+btnCounter,
                        class: 'popup tooltipInputs',
                        placeholder : "Playback Track",
                        maxlength : "512",
                        type: "text"    //,
                        // onkeyup: function () { buttonNameOnKeyUp($(this)); }
                    });
                $(actionTextFieldSet).append(buttonTrackTextInputField);
                // music preview button
                var musicPreview = $('<input/>',
                    {
                        id: 'popUpMusicPreviewBtn_'+btnCounter,
                        class: 'popup tooltipButton',
                        type: 'button',
                        value: 'Preview Music',
                        click: function () { previewMusic ($(this));}
                    });
                $(actionTextFieldSet).append(musicPreview);
                $(popUp).append(actionTextFieldSet);
                ////////
                // popup button action text
                var buttonActionTextInputField = $('<input/>',
                    {
                        id: 'newBtnActionText_'+btnCounter,
                        class: 'popup tooltipInputs toolTipVoiceOptions',
                        placeholder : "Button Action",
                        maxlength : "512",
                        value: btn_action_text,
                        type: "text"    //,
                        // onkeyup: function () { buttonNameOnKeyUp($(this)); }
                    });
                $(popUp).append(buttonActionTextInputField);
                // popup Voice options
                var voiceOptions = $('<span/>',
                    {
                        id: 'newBtnVoiceOptions_'+btnCounter,
                        class: 'popup toolTipVoiceOptions',
                        name : 'newBtnVoiceOptions_'+btnCounter
                    });
                // popup Voice Select dropdown
                $(voiceOptions).append('Voice');
                var buttonVoiceSelect = $('<select/>',
                    {
                        id: 'popUpVoiceSelectBtn_'+btnCounter,
                        class: 'popup tooltipButton',
                        onchange: function () {  }
                    });
                // Loop through each of the voices.
                voices.forEach(function(voice, i) {
                    // Create a new option element.
                    var option = document.createElement('option');
                    if (voice.name.indexOf('Google') == -1){
                        // Set the options value and text.
                        option.value = voice.name;
                        option.innerHTML = voice.name;
                        // Add the option to the voice selector.
                        buttonVoiceSelect.append(option);
                    }
                });
                $(voiceOptions).append(buttonVoiceSelect);
                // popup set Voice Pitch dropdown
                $(voiceOptions).append('Pitch');
                var buttonPitchSelect = $('<select/>',
                    {
                        id: 'popUpPitchSelectBtn_'+btnCounter,
                        class: 'popup tooltipButton',
                        onchange: function () {}
                    });
                // Add pitch options
                for (var i=0.0; i<= 2; i+=0.25){
                    // Create a new option element.
                    var option = document.createElement('option');
                    // Set the options value and text.
                    option.value = i;
                    option.innerHTML = i;
                    buttonPitchSelect.append(option);
                }
                $(voiceOptions).append(buttonPitchSelect);
                // popup set Voice Rate dropdown
                $(voiceOptions).append('<br/>Rate');
                var buttonRateSelect = $('<select/>',
                    {
                        id: 'popUpRateSelectBtn_'+btnCounter,
                        class: 'popup tooltipButton',
                        onchange: function () {}
                    });
                // Add pitch options
                for (var i=0.25; i<=3; i+=0.25){
                    // Create a new option element.
                    var option = document.createElement('option');
                    // Set the options value and text.
                    option.value = i;
                    option.innerHTML = i;
                    buttonRateSelect.append(option);
                }
                $(voiceOptions).append(buttonRateSelect);
                // popup preview Selected Voice button
                $(voiceOptions).append('<br/>');
                // TTS preview button
                var buttonVoicePreview = $('<input/>',
                    {
                        id: 'popUpVoicePreviewBtn_'+btnCounter,
                        class: 'popup tooltipButton',
                        type: 'button',
                        value: 'Preview Voice Settings',
                        click: function () {onTTSVoiceSelect($(this));}
                    });
                $(voiceOptions).append(buttonVoicePreview);
                $(voiceOptions).append('<br/>');
                // add voice options to popup
                $(popUp).append(voiceOptions);
                // popup cancel button
                var popupCanceleBtn = $('<input/>',
                    {
                        id: 'popUpCancel_' + btnCounter,
                        class: 'popup tooltipButton',
                        type: 'button',
                        value: 'Close Button Edit ToolTip',
                        click: function () {
                            closeToolTip($(this))
                        }
                    });
                $(popUp).append(popupCanceleBtn);
                // popup remove element
                var buttonRemoveElement = $('<input/>',
                    {
                        id: 'popUpSaveBtn_' + btnCounter,
                        class: 'popup tooltipButton',
                        type: 'button',
                        value: 'Remove Button',
                        click: function () {
                            removeButton($(this));
                        }
                    });
                $(popUp).append(buttonRemoveElement);
                // new button
                var btnNameId = "btnName_" + btnCounter;
                var new_button = $('<div/>',
                    {
                        id: btn_id,
                        name: btn_id,
                        html: '<span id=' + btnNameId + '><img src="img/play_icon.jpg" id="music_btn_img" style="width: 20px;height: 20px; vertical-align: middle"/>&nbsp;'+btn_txt+'</span>',
                        class: 'draggable tooltip dynamicButton ' + class_name + ' '+btn_action_class,
                        // style: 'position: relative;',
                        style: 'position: absolute; text-align:center; left:' + left + 'px; top:' + top + 'px;',
                        dblclick: function () {
                            openPopUpFunction($(this));
                        }
                    });
                $(new_button).append(popUp);

                // console.log('Parent Box Left '+$('#containment-wrapper').offset().left);    console.log('Parent Box Top '+$('#containment-wrapper').offset().top);

                $('#containment-wrapper').append(new_button);
                var height = Number($("#" + btn_id).css("height").replace("px", ""));
                var width = Number($("#" + btn_id).css("width").replace("px", ""));
                $(".draggable").draggable({
                    containment: "#containment-wrapper",
                    scroll: false//,
                    // grid: [ height+btn_padding, width+btn_padding ]
                    // grid: [ height , width]
                });
                // set up the voice options for the pre-saved buttons in the scene
                if (btn_action == 'TTS'){
                    document.getElementById('newBtnVoiceOptions_'+btnCounter).style.display = 'block';
                    document.getElementById('newBtnActionTextFieldset_'+btnCounter).style.display = 'none';
                    document.getElementById('newBtnActionText_'+btnCounter).style.display = 'block';
                    document.getElementById('newBtnActionText_'+btnCounter).value = btn_action_text;
                    var btn_voice = scene_detail_json['ttsVoice'];
                    var btn_pitch =  scene_detail_json['ttsPitch'];
                    var btn_rate = scene_detail_json['ttsRate'];
                    document.getElementById('popUpVoiceSelectBtn_'+btnCounter).value = btn_voice;
                    document.getElementById('popUpPitchSelectBtn_'+btnCounter).value = btn_pitch;
                    document.getElementById('popUpRateSelectBtn_'+btnCounter).value = btn_rate;
                    document.getElementById("btn_"+btnCounter).className += ' tts';
                }
                else{
                    document.getElementById('newBtnActionTextFieldset_'+btnCounter).style.display = 'block';
                    document.getElementById('newBtnVoiceOptions_'+btnCounter).style.display = 'none';
                    document.getElementById('newBtnActionText_'+btnCounter).style.display = 'none';
                    document.getElementById("btn_"+btnCounter).className += ' livestream';
                    var btn_album_text = scene_detail_json['albumText'];
                    var btn_artist_text = scene_detail_json['artistText'];
                    var btn_track_text =  scene_detail_json['trackText'];
                    if (btn_album_text != null && btn_album_text!= undefined && btn_album_text!="" && btn_album_text!=" "){
                        document.getElementById('newBtnAlbumText_'+btnCounter).value = btn_album_text;
                    }
                    if (btn_artist_text != null && btn_artist_text!= undefined && btn_artist_text!="" && btn_artist_text!=" "){
                        document.getElementById('newBtnArtistText_'+btnCounter).value = btn_artist_text;
                    }
                    if (btn_track_text != null && btn_track_text!= undefined && btn_track_text!="" && btn_track_text!=" "){
                        document.getElementById('newBtnTrackText_'+btnCounter).value = btn_track_text;
                    }

                }
                btnCounter +=1;
            }

            else if (scene_detail_json['type'] == 'header'){
                var left = parseInt(scene_detail_json['left'])+container_offset_left;
                var top = parseInt(scene_detail_json['top']) + container_offset_top;
                var headerTxt = scene_detail_json['headerText'];    //console.log(headerTxt);
                var header_id = 'header_'+headerCounter;
                var headerNameId = "btnName_"+btnCounter;
                var header_title = $('<input/>',
                    {
                        id : 'headerTitle_'+header_id,
                        name: 'headerTitle_'+header_id,
                        class: 'dynamicHeaderTitle',
                        // click: function () { openPopUpFunction($(this)); }
                        type:'text'
                    });
                var new_header = $('<div/>',
                    {
                        id : header_id,
                        name: header_id,
                        // html: '<span id='+headerNameId+'>New Header</span>',
                        class: 'draggable dynamicHeader',
                        // style: 'position: relative;'//,
                        style: 'position: absolute; text-align:center; left:'+left+'px; top:'+top+'px;'
                        // click: function () { openPopUpFunction($(this)); }
                        // contenteditable:'true'
                    });
                $(new_header).append(header_title);

                headerCounter +=1;
                $('#containment-wrapper').append(new_header);
                var height = Number($("#"+header_id).css("height").replace("px",""));
                var width = Number($("#"+header_id).css("width").replace("px",""));
                $( "#"+header_id ).draggable({
                    containment: "#containment-wrapper",
                    scroll: false//,
                    // grid: [ height+header_padding, width+header_padding ]
                });
                $('#'+'headerTitle_'+header_id).val(headerTxt);
            }

            else if (scene_detail_json['type'] == 'ttsSpeak'){
                var left = parseInt(scene_detail_json['left'])+ container_offset_left;
                var top = parseInt(scene_detail_json['top']) + container_offset_top;
                var TTSfreeForm_divContent = '<div>Speak</div>' +
                    '<table style="height:50%">' +
                    '                   <tr>' +
                    '                       <td>' +
                    '                           <input id ="freeForm_text_tts" style="height: 90%" type="text" placeholder="Enter TTS Text" readonly>' +
                    '                       </td>' +
                    '                       <td>' +
                    '                           <img id="freeForm_img_tts" src="img/tts_icon.png" style = "width:30px; height:30px">' +
                    '                       </td>' +
                    '                   </tr>' +
                    '                </table>';
                var new_tts = $('<div/>',
                    {
                        id : 'tts_freeForm',
                        class: 'draggable dynamicFreeForm ttsSpeak',
                        // text: 'TTS Text'
                        style: 'width: auto; position: absolute; text-align:center; left:'+left+'px; top:'+top+'px;',
                        html: TTSfreeForm_divContent
                    });
                $('#containment-wrapper').append(new_tts);
                $( "#tts_freeForm").draggable({
                    containment: "#containment-wrapper",
                    scroll: false//,
                    // grid: [ height+header_padding, width+header_padding ]
                });
            }

            else if (scene_detail_json['type'] == 'musicSearch'){
                var left = parseInt(scene_detail_json['left'])+ container_offset_left;
                var top = parseInt(scene_detail_json['top']) + container_offset_top;
                var musicSearchfreeForm_divContent = '<div>Music Search</div>' +
                    '<table style="height:50%">' +
                    '                   <tr>' +
                    '                       <td>' +
                    '                           <input id ="freeForm_text_music_album" style="width:140px; height: 90%" type="text" placeholder="  Enter Album Name ">' +
                    '                       </td>' +
                    '                       <td>' +
                    '                           <input id ="freeForm_text_music_artist" style="width:140px; height: 90%" type="text" placeholder="  Enter Artist Name ">' +
                    '                       </td>' +
                    '                       <td>' +
                    '                           <input id ="freeForm_text_music_track" style="width:140px; height: 90%" type="text" placeholder="  Enter Track Name ">' +
                    '                       </td>' +
                    '                       <td>' +
                    '                           <img id="freeForm_img_music" src="img/music_icon.png" style = "width:30px; height:30px">' +
                    '                       </td>' +
                    '                   </tr>' +
                    '                </table>';
                var new_musicSearch = $('<div/>',
                    {
                        id : 'musicSearch_freeForm',
                        class: 'draggable dynamicFreeForm musicSearch',
                        style: 'width: auto; position: absolute; text-align:center; left:'+left+'px; top:'+top+'px;',
                        // text: 'TTS Text'
                        html: musicSearchfreeForm_divContent
                    });
                $('#containment-wrapper').append(new_musicSearch);
                $( "#musicSearch_freeForm").draggable({
                    containment: "#containment-wrapper",
                    scroll: false//,
                    // grid: [ height+header_padding, width+header_padding ]
                });
            }

            else if (scene_detail_json['type'] == 'sttListen'){
                // alert("Music");
                var left = parseFloat(scene_detail_json['left'])+container_offset_left;
                var top = parseFloat(scene_detail_json['top'])+container_offset_top;
                var STTfreeForm_divContent = '<div><b>Listen</b></div>' +
                    '<table style="height:50%">' +
                    '                   <tr>' +
                    '                       <td>' +
                    '                           <img id="freeForm_img_tts" src="img/mic_off_icon.png" style = "width:60px; height:70px">' +
                    '                       </td>' +
                    '                   </tr>' +
                    '                </table>';
                var stt = $('<div/>',
                    {
                        id : 'stt_freeForm',
                        class: 'draggable dynamicFreeForm sttListen',
                        style: 'width: auto; position: absolute; text-align:center; left:'+left+'px; top:'+top+'px;',
                        html: STTfreeForm_divContent,
                        click: function () { speak_btn_onclick(); }
                    });
                $('#containment-wrapper').append(stt);
                $( "#stt_freeForm").draggable({
                    containment: "#containment-wrapper",
                    scroll: false//,
                    // grid: [ height+header_padding, width+header_padding ]
                });
            }
        }
    });

    load_default_voice_options();
}


// load options for default voice for the scene
function load_default_voice_options() {

    if (voices.length != 0) {
        // voice controls
        var voiceOptions = document.getElementById('voice_controls');
        $(voiceOptions).append('&nbsp&nbsp&nbsp&nbsp<b>Voice</b>');
        var buttonVoiceSelect = $('<select/>',
            {
                id: 'scene_default_TTS_voice',
                class: 'tooltipButton',
                onchange: function () { scene_default_TTS_option_onchange(); }
            });
        // Loop through each of the voices.
        voices.forEach(function (voice, i) {
            // Create a new option element.
            var option = document.createElement('option');
            if (voice.name.indexOf('Google') == -1) {
                // Set the options value and text.
                option.value = voice.name;
                option.innerHTML = voice.name;
                // Add the option to the voice selector.
                buttonVoiceSelect.append(option);
            }
        });
        $(voiceOptions).append(buttonVoiceSelect);
        $(voiceOptions).append('&nbsp&nbsp&nbsp&nbsp<b>Pitch</b>');
        var buttonPitchSelect = $('<select/>',
            {
                id: 'scene_default_TTS_pitch',
                class: 'tooltipButton',
                onchange: function () { scene_default_TTS_option_onchange(); }
            });
        // Add pitch options
        for (var i = 0.0; i <= 2; i += 0.25) {
            // Create a new option element.
            var option = document.createElement('option');
            // Set the options value and text.
            option.value = i;
            option.innerHTML = i;
            buttonPitchSelect.append(option);
        }
        $(voiceOptions).append(buttonPitchSelect);
        $(voiceOptions).append('&nbsp&nbsp&nbsp&nbsp<b>Rate</b>');
        var buttonRateSelect = $('<select/>',
            {
                id: 'scene_default_TTS_rate',
                class: 'tooltipButton',
                onchange: function () { scene_default_TTS_option_onchange(); }
            });
        // Add pitch options
        for (var i = 0.25; i <= 3; i += 0.25) {
            // Create a new option element.
            var option = document.createElement('option');
            // Set the options value and text.
            option.value = i;
            option.innerHTML = i;
            buttonRateSelect.append(option);
        }
        $(voiceOptions).append(buttonRateSelect);

        // set default_scene voice options values
        document.getElementById('scene_default_TTS_voice').value = 'Alex';
        document.getElementById('scene_default_TTS_pitch').value = 1;
        document.getElementById('scene_default_TTS_rate').value = 0.75;
    }
    else{
        get_voice_list();
        load_default_voice_options();
    }
}


function newTTS() {
    var TTSfreeForm_divContent = '<div>Speak</div>' +
        '<table style="height:50%">' +
        '                   <tr>' +
        '                       <td>' +
        '                           <input id ="freeForm_text_tts" style="height: 90%" type="text" placeholder="Enter TTS Text" readonly>' +
        '                       </td>' +
        '                       <td>' +
        '                           <img id="freeForm_img_tts" src="img/tts_icon.png" style = "width:30px; height:30px">' +
        '                       </td>' +
        '                   </tr>' +
        '                </table>';
    var new_tts = $('<div/>',
        {
            id : 'tts_freeForm',
            class: 'draggable dynamicFreeForm ttsSpeak',
            // text: 'TTS Text'
            html: TTSfreeForm_divContent
        });
    $('#containment-wrapper').append(new_tts);
    $( "#tts_freeForm").draggable({
        containment: "#containment-wrapper",
        scroll: false//,
        // grid: [ height+header_padding, width+header_padding ]
    });

}

function newSTT() {
    var STTfreeForm_divContent = '<div> Listen</div>' +
        '<table style="height:50%">' +
        '                   <tr>' +
        '                       <td>' +
        '                           <img id="freeForm_img_tts" src="img/mic_off_icon.png" style = "width:60px; height:70px">' +
        '                       </td>' +
        '                   </tr>' +
        '                </table>';
    var new_stt = $('<div/>',
        {
            id : 'stt_freeForm',
            class: 'draggable dynamicFreeForm sttListen',
            // text: 'TTS Text'
            html: STTfreeForm_divContent
        });
    $('#containment-wrapper').append(new_stt);
    $( "#stt_freeForm").draggable({
        containment: "#containment-wrapper",
        scroll: false//,
        // grid: [ height+header_padding, width+header_padding ]
    });

}

function newMusicSearch() {
    var musicSearchfreeForm_divContent =  '<div>Music Search</div>' +
        '<table style="height:50%">' +
        '                   <tr>' +
        '                       <td>' +
        '                           <input id ="freeForm_text_music_album" style="width:140px; height: 90%" type="text" placeholder="  Enter Album Name ">' +
        '                       </td>' +
        '                       <td>' +
        '                           <input id ="freeForm_text_music_artist" style="width:140px; height: 90%" type="text" placeholder="  Enter Artist Name ">' +
        '                       </td>' +
        '                       <td>' +
        '                           <input id ="freeForm_text_music_track" style="width:140px; height: 90%" type="text" placeholder="  Enter Track Name ">' +
        '                       </td>' +
        '                       <td>' +
        '                           <img id="freeForm_img_music" src="img/music_icon.png" style = "width:30px; height:30px">' +
        '                       </td>' +
        '                   </tr>' +
        '                </table>';
    var new_musicSearch = $('<div/>',
        {
            id : 'musicSearch_freeForm',
            class: 'draggable dynamicFreeForm musicSearch',
            // text: 'TTS Text'
            html: musicSearchfreeForm_divContent
        });
    $('#containment-wrapper').append(new_musicSearch);
    $( "#musicSearch_freeForm").draggable({
        containment: "#containment-wrapper",
        scroll: false//,
        // grid: [ height+header_padding, width+header_padding ]
    });
}

function newHeaderfunc() {
    var header_id = 'header_'+headerCounter;
    var headerNameId = "btnName_"+btnCounter;
    var header_title = $('<input/>',
        {
            id : 'headerTitle_'+header_id,
            name: 'headerTitle_'+header_id,
            class: 'dynamicHeaderTitle',
            // click: function () { openPopUpFunction($(this)); }
            type:'text'
        });
    var new_header = $('<div/>',
        {
            id : header_id,
            name: header_id,
            // html: '<span id='+headerNameId+'>New Header</span>',
            class: 'draggable dynamicHeader',
            style: 'position: relative;'//,
            // click: function () { openPopUpFunction($(this)); }
            // contenteditable:'true'
        });
    $(new_header).append(header_title);

    headerCounter +=1;
    $('#containment-wrapper').append(new_header);
    var height = Number($("#"+header_id).css("height").replace("px",""));
    var width = Number($("#"+header_id).css("width").replace("px",""));
    $( "#"+header_id ).draggable({
        containment: "#containment-wrapper",
        scroll: false//,
        // grid: [ height+header_padding, width+header_padding ]
    });
}

function newButton() {
    var btn_id = 'btn_'+btnCounter;
    // popup container
    var popUp = $('<span/>',
        {
            id: 'toolTipForm_'+btnCounter,
            class: 'popup tooltiptext invisible',
            name: 'toolTipForm_'+btnCounter
        });
    // popup header
    var popUpHeader = $('<h3/>',
        {
            class: 'popup tooltipInputs',
            text: 'Edit Button Properties',
            style: 'text-align:center;'
        });
    $(popUp).append(popUpHeader);
    // popup button name
    var buttonNameInputField = $('<input/>',
        {
            id: 'newBtnText_'+btnCounter,
            class: 'popup tooltipInputs',
            placeholder : "Button Text",
            maxlength : "512",
            type: "text",
            onkeyup: function () { buttonNameOnKeyUp($(this)); }
        });
    $(popUp).append(buttonNameInputField);
    // popup button color option
    buttonColors.forEach(function (btn_color_option){
        var buttonColorOption = $('<input/>',
            {
                id: 'newBtnColor_'+btnCounter,
                class: 'popup tooltipInputs '+btn_color_option+'RadioButton',
                name : 'newBtnColor_'+btnCounter,
                value : btn_color_option,
                type: "radio",
                onchange: function () { colorRadioButtonOnChange($(this)); }
            });
        $(popUp).append(buttonColorOption);
    });
    // popup button action selector
    $(popUp).append('&nbsp;');
    buttonActionType.forEach(function (action_type){
        var buttonAction = $('<input/>',
            {
                id: 'newBtnAction_'+btnCounter,
                class: 'popup normalRadioButton',
                name : 'newBtnAction_'+btnCounter,
                value : action_type,
                type: "radio",
                onchange: function () { actionRadioButtonOnChange($(this), "Alex", 1, 1); }
            });
        $(popUp).append(buttonAction);
        $(popUp).append(action_type);
        $(popUp).append('&nbsp;         ');
    });
    //////////////
    var actionTextFieldSet = $('<span/>',
        {
            id: 'newBtnActionTextFieldset_'+btnCounter,
            class: 'popup toolTipVoiceOptions',
            name : 'newBtnActionTextFieldset_'+btnCounter
        });
    var buttonAlbumTextInputField = $('<input/>',
        {
            id: 'newBtnAlbumText_'+btnCounter,
            class: 'popup tooltipInputs',
            placeholder : "Playback Album",
            maxlength : "512",
            type: "text"    //,
            // onkeyup: function () { buttonNameOnKeyUp($(this)); }
        });
    $(actionTextFieldSet).append(buttonAlbumTextInputField);
    var buttonArtistTextInputField = $('<input/>',
        {
            id: 'newBtnArtistText_'+btnCounter,
            class: 'popup tooltipInputs',
            placeholder : "Playback Artist",
            maxlength : "512",
            type: "text"    //,
            // onkeyup: function () { buttonNameOnKeyUp($(this)); }
        });
    $(actionTextFieldSet).append(buttonArtistTextInputField);
    var buttonTrackTextInputField = $('<input/>',
        {
            id: 'newBtnTrackText_'+btnCounter,
            class: 'popup tooltipInputs',
            placeholder : "Playback Track",
            maxlength : "512",
            type: "text"    //,
            // onkeyup: function () { buttonNameOnKeyUp($(this)); }
        });
    $(actionTextFieldSet).append(buttonTrackTextInputField);
    // music preview button
    var musicPreview = $('<input/>',
        {
            id: 'popUpMusicPreviewBtn_'+btnCounter,
            class: 'popup tooltipButton',
            type: 'button',
            value: 'Preview Music',
            click: function () { previewMusic ($(this));}
        });
    $(actionTextFieldSet).append(musicPreview);
    $(popUp).append(actionTextFieldSet);
    //////////////
    // popup button action text
    var buttonActionTextInputField = $('<input/>',
        {
            id: 'newBtnActionText_'+btnCounter,
            class: 'popup tooltipInputs toolTipVoiceOptions',
            placeholder : "Button Action",
            maxlength : "512",
            type: "text"    //,
            // onkeyup: function () { buttonNameOnKeyUp($(this)); }
        });
    $(popUp).append(buttonActionTextInputField);
    // popup Voice options
    var voiceOptions = $('<span/>',
        {
            id: 'newBtnVoiceOptions_'+btnCounter,
            class: 'popup toolTipVoiceOptions',
            name : 'newBtnVoiceOptions_'+btnCounter
        });
    // popup Voice Select dropdown
    $(voiceOptions).append('Voice');
    var buttonVoiceSelect = $('<select/>',
        {
            id: 'popUpVoiceSelectBtn_'+btnCounter,
            class: 'popup tooltipButton',
            onchange: function () { TTSvoiceOptionsOnChange($(this)); }
        });
    // Loop through each of the voices.
    voices.forEach(function(voice, i) {
        // Create a new option element.
        var option = document.createElement('option');
        if (voice.name.indexOf('Google') == -1){
            // Set the options value and text.
            option.value = voice.name;
            option.innerHTML = voice.name;
            // Add the option to the voice selector.
            buttonVoiceSelect.append(option);
        }
    });
    $(voiceOptions).append(buttonVoiceSelect);
    // popup set Voice Pitch dropdown
    $(voiceOptions).append('Pitch');
    var buttonPitchSelect = $('<select/>',
        {
            id: 'popUpPitchSelectBtn_'+btnCounter,
            class: 'popup tooltipButton',
            onchange: function () {TTSvoiceOptionsOnChange($(this));}
        });
    // Add pitch options
    for (var i=0.0; i<= 2; i+=0.25){
        // Create a new option element.
        var option = document.createElement('option');
        // Set the options value and text.
        option.value = i;
        option.innerHTML = i;
        buttonPitchSelect.append(option);
    }
    $(voiceOptions).append(buttonPitchSelect);
    // popup set Voice Rate dropdown
    $(voiceOptions).append('<br/>Rate');
    var buttonRateSelect = $('<select/>',
        {
            id: 'popUpRateSelectBtn_'+btnCounter,
            class: 'popup tooltipButton',
            onchange: function () {TTSvoiceOptionsOnChange($(this));}
        });
    // Add pitch options
    for (var i=0.25; i<=3; i+=0.25){
        // Create a new option element.
        var option = document.createElement('option');
        // Set the options value and text.
        option.value = i;
        option.innerHTML = i;
        buttonRateSelect.append(option);
    }
    $(voiceOptions).append(buttonRateSelect);
    // popup preview Selected Voice button
    $(voiceOptions).append('<br/>');
    var buttonVoicePreview = $('<input/>',
        {
            id: 'popUpVoicePreviewBtn_'+btnCounter,
            class: 'popup tooltipButton',
            type: 'button',
            value: 'Preview Voice Settings',
            click: function () {onTTSVoiceSelect($(this));}
        });
    $(voiceOptions).append(buttonVoicePreview);
    $(voiceOptions).append('<br/>');
    // add voice options to popup
    $(popUp).append(voiceOptions);
    // popup cancel button
    var popupCanceleBtn = $('<input/>',
        {
            id: 'popUpCancel_'+btnCounter,
            class: 'popup tooltipButton',
            type: 'button',
            value: 'Close Button Edit ToolTip',
            click: function () { closeToolTip($(this)) }
        });
    $(popUp).append(popupCanceleBtn);
    // popup remove element
    var buttonRemoveElement = $('<input/>',
        {
            id: 'popUpSaveBtn_'+btnCounter,
            class: 'popup tooltipButton',
            type: 'button',
            value: 'Remove Button',
            click: function () { removeButton($(this)); }
        });
    $(popUp).append(buttonRemoveElement);
    // new button
    var btnNameId = "btnName_"+btnCounter;
    var new_button = $('<div/>',
        {
            id : btn_id,
            name: btn_id,
            // html: '<span id='+btnNameId+'>New Button</span>',
            html: '<span id=' + btnNameId + '><img src="img/play_icon.jpg" id="music_btn_img" style="width: 20px;height: 20px; vertical-align: middle"/>&nbsp;New Button</span>',
            class: 'draggable tooltip dynamicButton defaultVoiceOptions',
            style: 'position: relative;',
            dblclick: function () { openPopUpFunction($(this)); }
        });
    $(new_button).append(popUp);

    $('#containment-wrapper').append(new_button);
    var height = Number($("#"+btn_id).css("height").replace("px",""));
    var width = Number($("#"+btn_id).css("width").replace("px",""));
    $( ".draggable" ).draggable({
        containment: "#containment-wrapper",
        scroll: false,
        // grid: [ height+btn_padding, width+btn_padding ]
        grid: [ 5 , 5]
    });

    btnCounter +=1;
}

function scene_default_TTS_option_onchange (){
    var default_voice = document.getElementById("scene_default_TTS_voice").value;
    var default_pitch = document.getElementById("scene_default_TTS_pitch").value;
    var default_rate = document.getElementById("scene_default_TTS_rate").value;

    $('.dynamicButton').each(function(i, obj) {
        var el_id = $(this).attr("id");
        var el_nbr = el_id[el_id.length - 1];
        var el_class = this.className.split(' ');
        if (el_class.indexOf("defaultVoiceOptions") != -1){
            document.getElementById('popUpVoiceSelectBtn_'+el_nbr).value = default_voice;
            document.getElementById('popUpPitchSelectBtn_'+el_nbr).value = default_pitch;
            document.getElementById('popUpRateSelectBtn_'+el_nbr).value = default_rate;
        }
    });

}


function updateElementDict (){
    element_dict = [];
    var element_dict_str = '';
    var scene = document.getElementById('sceneName').value;
    var test_name = document.getElementById('testName').value;
    $('.draggable').each(function(i, obj) {
        var el_id = $(this).attr("id");
        var el_nbr = el_id[el_id.length - 1];
        var el_class = this.className.split(' ');
        var width = $(this).css("width").replace("px","");
        // var left =  $(this).css("left").replace("px","");
        // var top =  $(this).css("top").replace("px","");
        var top = $(this).offset().top - $(this).parent().offset().top; //- $(this).parent().scrollTop();
        var left = $(this).position().left - $(this).parent().offset().left; //- $(this).parent();
        if (el_class.indexOf("dynamicButton") != -1){
            var type;
            var buttonText;
            var color = 'gray';
            var action = 'tts'; console.log('newBtnActionText_'+el_nbr);
            var buttonActionText="";
            type = "button";
            buttonText = document.getElementById("btnName_".concat(el_nbr)).innerText;
            var btn = '#btn_'+el_nbr;
            var top = $(btn).offset().top - $(btn).parent().offset().top; //- $(this).parent().scrollTop();
            var left = $(btn).offset().left - $(btn).parent().offset().left;
            // var top = $(btn).offset().top;
            // var left = $(btn).offset().left;
            buttonColors.forEach(function (btn_color_option){
                if (el_class.indexOf(btn_color_option.concat("Button")) != -1){
                    color = btn_color_option;
                }
            });
            buttonActionType.forEach(function (action_type){
                if (el_class.indexOf(action_type.toLowerCase().replace(' ','')) != -1){
                    action = action_type;
                }
            });
            var selectedVoice = '';
            var selectedPitch = '';
            var selectedRate = '';
            if (action == 'TTS'){
                var btn_nbr = el_nbr;
                var e = document.getElementById("popUpVoiceSelectBtn_"+btn_nbr);
                selectedVoice = e.options[e.selectedIndex].value;
                selectedPitch = document.getElementById("popUpPitchSelectBtn_"+btn_nbr).options[document.getElementById("popUpPitchSelectBtn_"+btn_nbr).selectedIndex].value;
                selectedRate = document.getElementById("popUpRateSelectBtn_"+btn_nbr).options[document.getElementById("popUpRateSelectBtn_"+btn_nbr).selectedIndex].value;
                buttonActionText = document.getElementById('newBtnActionText_'+btn_nbr).value;
            }
            else{
                var btn_nbr = el_nbr;
                var album_text = document.getElementById('newBtnAlbumText_'+btn_nbr).value;
                var artist_text = document.getElementById('newBtnArtistText_'+btn_nbr).value;
                var track_text = document.getElementById('newBtnTrackText_'+btn_nbr).value;
                // console.log(album_text); console.log(artist_text); console.log(track_text);
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
                console.log(buttonActionText);
            }
        }
        else if (el_class.indexOf("dynamicHeader") != -1){
            var titleText =  document.getElementById("headerTitle_header_".concat(el_nbr)).value;
            var type = "header";

        }
        else if (el_class.indexOf("ttsSpeak") != -1){
            var type = "ttsSpeak";
        }
        else if (el_class.indexOf("musicSearch") != -1){
            var type = "musicSearch";
        }
        else if (el_class.indexOf("sttListen") != -1){
            var type = "sttListen";
        }
        config = {
            'id':el_id,
            'left':left,
            'top': top,
            'width': width,
            'buttonText': buttonText,
            'buttonActionText' : buttonActionText,
            'type': type,
            'color': color,
            'action': action,
            'headerText': titleText,
            'ttsVoice': selectedVoice,
            'ttsPitch':selectedPitch,
            'ttsRate':selectedRate,
            'albumText': album_text,
            'artistText': artist_text,
            'trackText': track_text
        };

        element_dict_str += ('###'+JSON.stringify(config));

    });

    var default_voice = document.getElementById("scene_default_TTS_voice").value;
    var default_pitch = document.getElementById("scene_default_TTS_pitch").value;
    var default_rate = document.getElementById("scene_default_TTS_rate").value;

    config = {
        'id':'',
        'left':'',
        'top': '',
        'width': '',
        'buttonText': '',
        'buttonActionText' : '',
        'type': 'defaultTTSParameters',
        'color': '',
        'action': '',
        'headerText': '',
        'ttsVoice': default_voice,
        'ttsPitch':default_pitch,
        'ttsRate':default_rate
    };

    element_dict_str += ('###'+JSON.stringify(config));

    console.log(scene);
    console.log("THE ELEMENT DICT");
    console.log(element_dict_str);

    var data_for_saving = {
        "operation" : "save",
        "scene_name": scene,
        "scene_details": element_dict_str,
        "test_name":test_name
    };

    $.ajax({
        url: 'https://5fsmvqzj6a.execute-api.us-east-1.amazonaws.com/WOZ_scenes',
        type: 'POST',
        cache: false,
        data: JSON.stringify(data_for_saving),
        beforeSend: function(){ $( '#loader' ).show();},
        success: function( res ) {
            alert( JSON.stringify(res) );
            localStorage.setItem('test_name_to_render', test_name);
            console.log(data_for_saving);
            var win = window.open('specific_test.html', '_self');
            win.focus();
        },
        error:function(e){ alert('Error Saving Scene\n\n' + e.responseText); },
        complete:function(){ $('#loader').hide(); }
    });

}


// Fetch the list of voices and populate the voice options.
function loadVoices() {
    // Get the voice select element.
    var voiceSelect = document.getElementById('voice');
    // Fetch the available voices.
    var voices = speechSynthesis.getVoices();

    // Loop through each of the voices.
    voices.forEach(function(voice, i) {
        // Create a new option element.
        var option = document.createElement('option');

        // Set the options value and text.
        option.value = voice.name;
        option.innerHTML = voice.name;

        // Add the option to the voice selector.
        voiceSelect.appendChild(option);
    });
}





