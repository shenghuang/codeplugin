/**
 * Hosted at Google Doc to avoid the Google Content Privacy Policy issue (Facebook JS cannot be injected to Chrome Extension pages)
 */
var fb_share_text = {"en": "Share the dataset on Facebook", "fr": "Partager jeu de données sur Facebook"};
var tw_share_text = {"en": "Share the dataset on Twitter", "fr": "Partager jeu de données sur Twitter"};

document.addEventListener('DOMContentLoaded', function () {
	  init();
	});

function init() {
	var refUrl = getQuerySting("codecRef");
	if (refUrl != null && refUrl.indexOf("gc.ca") != -1) {
		document.getElementById('fb-share').setAttribute("data-href", refUrl);
	}
	
	var language = getQuerySting("lang");
	var refText = getQuerySting("codecText");
	if (refText != null && refText != "") {
		document.getElementById('tw-share').setAttribute("data-text", decodeURIComponent(refText));
		document.getElementById('tw-share').setAttribute("data-lang", language);
	}

	document.getElementById('fb_share_text').innerHTML=fb_share_text[language];
	document.getElementById('tw_share_text').innerHTML=tw_share_text[language];
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