/**
 * Hosted at Google Doc to avoid the Google Content Privacy Policy issue (Facebook JS cannot be injected to Chrome Extension pages)
 */
document.addEventListener('DOMContentLoaded', function () {
	  init();
	});

function init() {
	var refUrl = getQuerySting("codecRef");
	if (refUrl != null && refUrl.indexOf("gc.ca") != -1) {
		document.getElementById('fb-share').setAttribute("data-href", refUrl);
	}
	
	var refText = getQuerySting("codecText");
	if (refText != null && refText != "") {
		document.getElementById('tw-share').setAttribute("data-text", decodeURIComponent(refText));
	}

}

function getQuerySting(Key) {
    var url = window.location.href;
    KeysValues = url.split(/[\?&]+/);
    for (i = 0; i < KeysValues.length; i++) {
        KeyValue = KeysValues[i].split("=");
        if (KeyValue[0] == Key) {
            return KeyValue[1];
        }
    }
}