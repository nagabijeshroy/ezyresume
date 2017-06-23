/**
 * Created by sharmo on 4/25/17.
 */

function convertToSpeech() {
    var ttsText = document.getElementById('ttsText').value;
    var ttsPitch = 1; //document.getElementById('ttsPitch').value;
    var ttsRate = 1;//document.getElementById('ttsRate').value;
    var msg = new SpeechSynthesisUtterance();
    msg.volume = 1; // 0 to 1
    msg.rate = ttsRate; // 0.1 to 10
    msg.pitch = ttsPitch; //0 to 2
    msg.text = ttsText;
    msg.lang = 'en-US';
    // msg.onend = function(e) {
    //     console.log('Finished in ' + event.elapsedTime + ' seconds.');
    // };
    speechSynthesis.speak(msg);
}
