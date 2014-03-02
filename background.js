var pollInterval = 1000 * 60 * 3; // 3 minutes, in milliseconds

function updateBadge() {
	var terms = localStorage['terms'];
    if (terms !== undefined && terms != null) {
    	var myterms = JSON.parse(terms);
    	myterms.__proto__ = Terms.prototype;
    	//var thisvar = myterms.asArray().length;
    	var count = 0;
    	myterms.asArray().forEach(function(myterm) {
    		myterm.__proto__ = Term.prototype;
		    if (!myterm.visited) {
		    	count++;
		    }
    	});
    	//alert('total '+myterms.asArray().length+' non-visited '+count);
    	chrome.browserAction.setBadgeText({text:count+''}); //+'' to convert integer to text
		chrome.browserAction.setBadgeBackgroundColor({color: "#0000FF"}); 
    }
}

function startRequest() {
    updateBadge();
    window.setTimeout(startRequest, pollInterval);
}
this.startRequest();

chrome.runtime.onMessage.addListener(function(msg, sender) {
    /* First, validate the message's structure */
    if (msg.from && (msg.from === "content")
            && msg.subject && (msg.subject = "showPageAction")) {
    	if (sender != undefined && sender.tab != undefined && sender.tab.id != undefined) {
            /* Enable the page-action for the requesting tab */
            chrome.pageAction.show(sender.tab.id);
    	}
    }
});

chrome.runtime.onMessage.addListener(function(msg, sender) {
    /* First, validate the message's structure */
    if (msg.from && (msg.from === "popup")
            && msg.subject && (msg.subject === "updateContent")) {
		chrome.tabs.query({
	        active: true,
	        currentWindow: true
	    	}, function(tabs) {
	    		chrome.runtime.sendMessage(
	    	    	{from: "background", subject: "updateContent", data: msg.data}
	    		);
	    	}
	    );		
    	//alert('have updates from popup');
		updateBadge();
    } else if (msg.from && (msg.from === "contents")
            && msg.subject && (msg.subject === "visitedLink")) {
    	//alert('have visited links from the content page');
    	updateBadge();
    }

});