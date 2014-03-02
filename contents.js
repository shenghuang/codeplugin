/* Inform the background page that this tab should have a page-action */
chrome.runtime.sendMessage({
    from: "content",
    subject: "showPageAction"
});

/* Listen for update message from the popup, with simplified version passing only two attributes */
chrome.runtime.onMessage.addListener(function(msg, sender, response) {
    /* First, validate the message's structure */
    if (msg.from && (msg.from === "background")
            && msg.subject && (msg.subject === "updateContent")) {
        /* Collect the necessary data 
         * (For your specific requirements `document.querySelectorAll(...)`
         *  should be equivalent to jquery's `$(...)`)*/
    	//alert('message subject in contents '+msg.subject);
    	var myNode = document.getElementById('dataset-items');
    	while (myNode.firstChild) {
    	    myNode.removeChild(myNode.firstChild);
    	}
    	
        var items = msg.data;
        //alert('here get items size '+items.length);
        for (var i = 0; i <items.length; i++) {
        	var item = items[i];
      	  	var liElement = document.createElement('li');
      	  	liElement.setAttribute("class", "dataset-item");
      	  	var link = document.createElement('a');
      	  	link.setAttribute("href", item.url);
      	  	var aElemTN = document.createTextNode(item.itemText);
      	  	link.appendChild(aElemTN);
      	  	
      	  	var divElement1 = document.createElement('div');
      	  	var strongElement = document.createElement('strong');
      	  	strongElement.appendChild(link);
      	  	divElement1.appendChild(strongElement);
      	  	liElement.appendChild(divElement1);

      	  	if (item.itemDesc != null && item.itemDesc != '') {
          	  	var divElement2 = document.createElement('div');
          	  	var textElementDesc = document.createTextNode(LZString.decompressFromBase64(item.itemDesc));
          	  	divElement2.appendChild(textElementDesc);
          	  	liElement.appendChild(divElement2);
      	  	}

      	  	var link2 = document.createElement('a');
      	  	link2.setAttribute("href", "#");
      	  	var facebookImage = document.createElement('img');
      	  	facebookImage.setAttribute("src", "img/facebook.png");
      	  	facebookImage.setAttribute("width", "36");
      	  	facebookImage.setAttribute("height", "36");
      	  	link2.appendChild(facebookImage);
      	  	liElement.appendChild(link2);
      	  	var twitterText = "<a href\""+item.url+"\">"+item.itemText+"</a>";
      	    link2.addEventListener('click', function(){openLinkHandler("http://shrouded-dawn-1777.herokuapp.com/facebook.html?codecText="+encodeURIComponent(twitterText)+"&lang="+chrome.i18n.getMessage("language"))});

      	  	var link3 = document.createElement('a');
      	  	link3.setAttribute("href", "#");
      	  	var twitterImage = document.createElement('img');
      	  	twitterImage.setAttribute("src", "img/twitter.png");
      	  	twitterImage.setAttribute("width", "36");
      	  	twitterImage.setAttribute("height", "36");
      	  	link3.appendChild(twitterImage);
      	  	liElement.appendChild(link3);
      	    link3.addEventListener('click', function(){openLinkHandler("http://shrouded-dawn-1777.herokuapp.com/facebook.html?codecText="+encodeURIComponent(twitterText)+"&lang="+chrome.i18n.getMessage("language"))});


      	    //Check extras/spatial
      	    if (item.geocode != null && item.geocode != "QAA=") {
      	    	var geocode = item.geocode;
	      	  	var link4 = document.createElement('a');
	      	  	link4.setAttribute("href", "#");
	      	  	var mapImage = document.createElement('img');
	      	  	mapImage.setAttribute("src", "img/google-map.png");
	      	  	mapImage.setAttribute("width", "36");
	      	  	mapImage.setAttribute("height", "36");
	      	  	link4.appendChild(mapImage);
	      	  	liElement.appendChild(link4);
	      	    link4.addEventListener('click', function(){openLinkHandler("http://shrouded-dawn-1777.herokuapp.com/googlemap.html?geocode="+geocode)});
      	    }
      	    
      	    document.getElementById('dataset-items').appendChild(liElement);
      	    link.addEventListener('click', clickHandler);
        };    	
        response({backgroundMsg: 'success-content'});
        setLabels();
        return true;
    }
});

document.addEventListener('DOMContentLoaded', function () {
	  init();
	});

/**
 * Initial loading during tab creation
 */
function init() {
	setLabels();
	
	var myterms = getTerms();
	if (myterms != null) {
    	processTerms(myterms.asArray());
    } else {
    	//TODO: add empty message
    }
}

function setLabels() {
	document.title=chrome.i18n.getMessage("search_result");
	var result_summary = chrome.i18n.getMessage("with_result1");
	var result_info = chrome.i18n.getMessage("with_result2");
	
	var searchterm = localStorage['searchterm'];
    result_summary = result_summary.replace("{term}", (searchterm != undefined)?searchterm:"");
    document.getElementById('result_summary').innerHTML=result_summary;
	

	var myterms = getTerms();
	if (myterms != null) {
	    result_info = result_info.replace("{count}", myterms.asArray().length);
	    document.getElementById('result_info').innerHTML=result_info;
	} else {
	   	result_info = result_info.replace("{count}", 0);
	   	document.getElementById('result_info').innerHTML=result_info;
	}
}

function processTerms(terms) {
	var myNode = document.getElementById('dataset-items');
	while (myNode.firstChild) {
	    myNode.removeChild(myNode.firstChild);
	}
	
    for (var i = 0; i <terms.length; i++) {
    	var term = terms[i];
  	  	var liElement = document.createElement('li');
  	  	liElement.setAttribute("class", "dataset-item");
  	  	var link = document.createElement('a');
  	  	link.setAttribute("href", term.url);
  	  	var aElemTN = document.createTextNode(term.text);
  	  	link.appendChild(aElemTN);
  	  	
  	  	var divElement1 = document.createElement('div');
  	  	var strongElement = document.createElement('strong');
  	  	strongElement.appendChild(link);
  	  	divElement1.appendChild(strongElement);
  	  	liElement.appendChild(divElement1);

  	  	if (term.desc != null && term.desc != '') {
      	  	var divElement2 = document.createElement('div');
      	  	//alert('term desc '+term.desc);
      	  	var textElementDesc = document.createTextNode(LZString.decompressFromBase64(term.desc));
      	  	divElement2.appendChild(textElementDesc);
      	  	liElement.appendChild(divElement2);
  	  	}
  	  	
  	  	var link2 = document.createElement('a');
  	  	link2.setAttribute("href", "#");
  	  	var facebookImage = document.createElement('img');
  	  	facebookImage.setAttribute("src", "img/facebook.png");
  	  	facebookImage.setAttribute("width", "36");
  	  	facebookImage.setAttribute("height", "36");
  	  	link2.appendChild(facebookImage);
  	  	liElement.appendChild(link2);
  	  	var twitterText = "<a href\""+term.url+"\">"+term.text+"</a>";
  	    link2.addEventListener('click', function(){openLinkHandler("http://shrouded-dawn-1777.herokuapp.com/facebook.html?codecText="+encodeURIComponent(twitterText)+"&lang="+chrome.i18n.getMessage("language"))});

  	  	var link3 = document.createElement('a');
  	  	link3.setAttribute("href", "#");
  	  	var twitterImage = document.createElement('img');
  	  	twitterImage.setAttribute("src", "img/twitter.png");
  	  	twitterImage.setAttribute("width", "36");
  	  	twitterImage.setAttribute("height", "36");
  	  	link3.appendChild(twitterImage);
  	  	liElement.appendChild(link3);
  	    link3.addEventListener('click', function(){openLinkHandler("http://shrouded-dawn-1777.herokuapp.com/facebook.html?codecText="+encodeURIComponent(twitterText)+"&lang="+chrome.i18n.getMessage("language"))});

  	    //Check extras/spatial
  	    if (term.geocode != null && term.geocode != "QAA=") {
  	    	var geocode = term.geocode;
  	  	  	var link4 = document.createElement('a');
  	  	  	link4.setAttribute("href", "#");
  	  	  	var mapImage = document.createElement('img');
  	  	  	mapImage.setAttribute("src", "img/google-map.png");
  	  	  	mapImage.setAttribute("width", "36");
  	  	  	mapImage.setAttribute("height", "36");
  	  	  	link4.appendChild(mapImage);
  	  	  	liElement.appendChild(link4);
  	  	    link4.addEventListener('click', function(){openLinkHandler("http://shrouded-dawn-1777.herokuapp.com/googlemap.html?geocode="+geocode)});  	    	
  	    }

  	    
  	  	document.getElementById('dataset-items').appendChild(liElement);
  	    link.addEventListener('click', clickHandler);
    }
}

function clickHandler(event) {
	var link = event.target;
	if (link != null) {
		var myterms = getTerms();
		if (myterms != null) {
			var term = myterms.findById(link);
			if (term != null) {
				term.visited = true;
				myterms.sync();
					
		    	chrome.runtime.sendMessage(
		        	   	{from: "contents", subject: "visitedLink"},
		        	   	function(response) {
		        	   		response({result: 'success'});
		        	   	}
		        	);
			}
		}
	}
}


function openLinkHandler(url) {
	var child = window.open(url, "Media", 'left=20,top=20,width=500,height=500,toolbar=1,resizable=0');
	return false;
}

