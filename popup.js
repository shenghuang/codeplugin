var query = '';
var searchLink = chrome.i18n.getMessage("site_url")+chrome.i18n.getMessage("language")+'/api/3/action/package_search?q=';
var terms = null;

	function selectSearchTerm(searchterm) {
		if (!searchterm)
			return;
		query = searchterm;
		
		localStorage['searchterm'] = searchterm;
	}

	function showSettings() {
		$('#settings').removeClass('hidden');
		$('#searchterm').focus();
		hideInputError();
	}

	function showInputError(searchterm) {
		$('#searchterm').addClass('form-error');
		$('#new #error-message').text(chrome.i18n.getMessage("empty_result"));
		$('#new #error-message').removeClass('hidden');
	}

	function hideInputError() {
		$('#searchterm').removeClass('form-error');
		//$('#searchterm').val('');
		$('#new #error-message').addClass('hidden');
		$('#new').removeClass('selected');
	}

	function initHandlers() {
		$('#new #add').click(function() {
		    var searchterm = $('#searchterm').val();
		    var searchurl = searchLink + searchterm;
		    //alert('search url '+searchurl);
		    // TODO: this will call onerror asyncronously -- should disable textbox during that time?
		    selectSearchTerm(searchterm);
		    attemptAddTerm(searchurl,
		      function() {
		        hideInputError();
		      }, 
		      function() {
		    	showInputError(searchterm);
		      });
		});
		
		$('#searchterm').keyup(function(e) {
		    if (event.which == 13) // enter
		      $('#new #add').click();
		    if (event.which == 27) // esc
		      $('#new #cancel').click();
		});
		
		$('#new #cancel').click(function() {
			  window.close();
		});

		$('#settingsToggle').click(function() {
			var myterms = getTerms();
			if (myterms != null) {
			    	var count = myterms.asArray().length;

			    	if (count > 0) {
			    		chrome.tabs.query({
			    	        active: true,
			    	        currentWindow: true
			    	    	}, function(tabs) {
			    	    		var found = false;
			    	    		for (var i = 0; i < tabs.length; i++) {
			    	    		    if (tabs[i].url != null && tabs[i].url.indexOf('items.html') != -1) {
			    	    		    	found = true;
			    	    		    	break;
			    	    		    }                        
			    	    		}  		
			
			    	    		if (!found) {
				    		    	chrome.tabs.create({url: 'items.html', active: true}, function(tab) {
				    		    		// Tab opened.
				    		    		console.log('do open '+tab.url);
				    		    		/* ...and send a request for the DOM info... */	    	    			
				    		    	});
			    	    		}
			    	    	});			    		
			    	}
			    }
		});
	}
		
	document.addEventListener("backbutton" , function(e) {
		window.navigator.app.exitApp();
	}, false);

	function attemptAddTerm(searchurl, onsuccess, onerror) {
		  $.getJSON(searchurl, function(data) {
		    if (data['success'] == true && data.result.count > 0) {
		    	//alert('result size '+data.result.count);
		    	var titleField = chrome.i18n.getMessage("field_title");
		    	var descField = chrome.i18n.getMessage("field_desc");
		    	terms.clear();
		    	var results = data["result"]["results"];
				for (var i = 0; i <results.length; i++) {
					var desc = results[i][descField];
					desc = LZString.compressToBase64(desc);
					
					var geocode = null;
					var extras = results[i]["extras"];
					if (extras != null && extras.length > 0) {
						for (var j = 0; j <extras.length; j++) {
							var extra = extras[j];
							if (extra["key"] == "spatial") {
								geocode =  LZString.compressToBase64(extra["value"]);
								break;
							}
						}
					}
					
					//alert('to add term '+results[i]['id']+'\r\n'+results[i][titleField]+'\r\n'+desc+'\r\n'+results[i]['url']+'\r\n'+results[i]['owner_org']);
					addTerm(results[i]['id'], results[i][titleField], desc, getUrl(results[i], i), results[i]['owner_org'], geocode);
				}
				
	    		chrome.tabs.query({
	    	        active: true,
	    	        currentWindow: true
	    	    	}, function(tabs) {
	    	    		var found = false;
	    	    		for (var i = 0; i < tabs.length; i++) {
	    	    		    if (tabs[i].url != null && tabs[i].url.indexOf('items.html') != -1) {
	    	    		    	found = true;
	    	    		    	break;
	    	    		    }                        
	    	    		}  		
	
	    	    		if (!found) {
		    		    	chrome.tabs.create({url: 'items.html', active: true}, function(tab) {
		    		    		// Tab opened.
		    		    		console.log('do open '+tab.url);
		    		    		/* ...and send a request for the DOM info... */	    	    			
		    		    	});
	    	    		}
		    	    	
	    		    	var items = new Array();
	    				for (var i = 0; i <results.length; i++) {
	    					var desc = results[i][descField];
	    					desc = LZString.compressToBase64(desc);

	    					var geocode = null;
	    					var extras = results[i]["extras"];
	    					if (extras != null && extras.length > 0) {
	    						for (var j = 0; j <extras.length; j++) {
	    							var extra = extras[j];
	    							if (extra["key"] == "spatial") {
	    								geocode =  LZString.compressToBase64(extra["value"]);
	    								break;
	    							}
	    						}
	    					}

	    					var item = {
	    						itemText: results[i][titleField],
	    						itemDesc: desc,
	    						url: getUrl(results[i], i),
	    						geocode: geocode
	    					};
	    					items.push(item);
	    				}
	    	    		chrome.runtime.sendMessage(
		    	    		{from: "popup", subject: "updateContent", data: items},
		    	    		/* ...also specifying a callback to be called 
		    	    		 *    from the receiving end (content script) */
		    	    		updateContentCallback
		                );
	    	    	}
		    	);
	    		
	    		onsuccess && onsuccess();
		    	
		    } else {
		      onerror && onerror();
		    }
		  }, 'json');
	}	  
	  
	function init() {
		setLabels();
		
		  $(document.body).addClass((window.cordova !== undefined) ? 'mobile' : 'not-mobile');

		var myterms = getTerms();
		if (myterms != null && myterms.length > 0) {
		      terms = myterms;
		      terms.__proto__ = Terms.prototype;
		      terms.asArray().forEach(function(myterm) {
		        myterm.__proto__ = Term.prototype;
		        myterm.date = new Date(myterm.date);
		      });
		    } else {
		      terms = new Terms();
		    }
		    
		var searchterm = localStorage['searchterm'];
		if (searchterm != null && searchterm != '') {
	    	query = searchterm;
	    	document.getElementById('searchterm').value = query;
		}
		  
		initHandlers(); 
		showSettings();  //TODO: Add here for now
	}
	
    $(document).ready(function() {
    	if (typeof cordova !== 'undefined') {
    		document.addEventListener("deviceready", init);
    	} else {
    		init();
    	}
    });
		
    function setLabels() {
    	$('#add').text(chrome.i18n.getMessage("button_search"));
    	$('#cancel').text(chrome.i18n.getMessage("button_cancel"));
    }
    
    /* Update the relevant fields with the new data */
    function updateContentCallback(info) {
	    	//console.log('do invoke back');
    }
	    
    function addTerm(datasetId, text, desc, url, orgId, geocode) {
    	  var myterm = new Term(datasetId, text, desc, url, orgId, geocode);
    	  terms.add(myterm);
    	  return myterm;
    }

    function getUrl(result, index) {
		var url =  result['url'];
		if (url == null || url == '') {
			//alert('url null '+result['resources'][0]['url']);
			if (result['resources'] != null && result['resources'].length >0) {
				url = result['resources'][0]['url'];				
			} else {
				url = chrome.i18n.getMessage("site_url")+chrome.i18n.getMessage("language")+"/dataset/"+result['id'];
			}
		}

		if (url.indexOf('?') != -1) {
			url += "&codec="+index;
		} else {
			url += "#codec="+index;
		}
		return url;
    }