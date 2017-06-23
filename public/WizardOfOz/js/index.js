/**
 * Created by sharmo on 5/15/17.
 */

$(function() {
    var data = {
        "operation": "get_test_names",
        "scene_name": '',
        "scene_details": '',
        "test_name": ''
    };
    onload_func(data);
});


function onload_func(data) {
    $.ajax({
        url: 'https://5fsmvqzj6a.execute-api.us-east-1.amazonaws.com/WOZ_scenes',
        type: 'POST',
        cache: false,
        data: JSON.stringify(data),
        beforeSend: function() { $('#loader').show(); },
        success: function(res) {
            // alert( JSON.stringify(res) );
            create_test_name_dropdown(res.split("###"));

        },
        error: function(e) {
            onload_func(data);
        },
        complete: function() { $('#loader').hide(); }
    });


}

function create_test_name_dropdown(data) {
    // alert(data);
    var elm = document.getElementById("tests");

    for (var i = 0, len = data.length; i < len; i++) {
        var name = '';
        var val = '';
        if (data[i] == '') {
            name = 'Select a Saved Test';
            val = 'invalid';
        } else {
            name = data[i];
            val = name;
        }
        var option = document.createElement("option");
        option.value = val;
        option.textContent = name;
        elm.add(option);
    }
}

function getSelectedTest() {
    var e = document.getElementById("tests");
    var selectedTest = e.options[e.selectedIndex].value;
    if (selectedTest == 'invalid') {
        alert('Please Select a Valid Test from the List of Saved Tests or Create a New Test');
    } else {
        var safe_mode_checkBox_selected = document.getElementById("safe_mode").checked;
        if (safe_mode_checkBox_selected) {
            localStorage.setItem("safe_mode", 'true');
        } else {
            localStorage.setItem("safe_mode", 'false');
        }
        localStorage.setItem("test_name_to_render", selectedTest);
        // var win = window.open('specific_test.html', '_blank');
        // win.focus();

        if ($.isEmptyObject(localStorage.getItem("lastSpotifyAuthorizationtime"))) {
            var spotifyAuthorize = window.open('spotify_auth.html', 'spotifyAuthorize', "height=800,width=600");
            spotifyAuthorize.focus();
        } else if (localStorage.getItem("lastSpotifyAuthorizationtime") - new Date().getTime() > 60 * 60 * 1000) {
            var spotifyAuthorize = window.open('spotify_auth.html', 'spotifyAuthorize', "height=800,width=600");
            spotifyAuthorize.focus();
        }

        var win = window.open('specific_test.html', 'specificTest');
        //win.focus();
    }
}

function createNewTest() {
    localStorage.setItem("test_name_to_edit", '');
    localStorage.setItem("scene_name_to_edit", '');
    var win = window.open('customitems.html', '_blank');
    win.focus();
}