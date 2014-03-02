/**
 * JS functions for loaded user data (refer to Google weather example)
 */

function Term(datasetId, text, desc, url, orgId) {
	//TODO: this doesn't really need to be a member, can just be a method, and then we don't need to worry about changing id format & sync issues
	this.datasetId = datasetId;
	this.text = text;
	this.url = url;
	this.orgId = orgId;
	this.visited = false;
	this.date = new Date();
	this.desc = desc;
}

function Terms() {
	this.terms = [];
	this.version = Terms.CurrentVersion;
}
Terms.CurrentVersion = 2;

Terms.prototype.sync = function() {
	this.terms.forEach(function(term) {
		//alert('here term '+term.datasetId+', '+term.text+', '+term.desc+', '+term.url+', '+term.orgId);
		term.date = term.date.toJSON();
	});
	
	localStorage['terms'] = JSON.stringify(this);
	
	this.terms.forEach(function(term) {
		term.date = new Date(term.date);
	});
}

Terms.prototype.add = function(term) {
	this.terms.push(term);
	this.sync();
	//alert('add length '+this.terms.length);
}

Terms.prototype.remove = function(term) {
	this.terms.splice(this.terms.indexOf(term), 1);
	this.sync();
}

Terms.prototype.clear = function() {
	while (this.terms.length > 0) {
		this.terms.pop();
	}
	this.sync();
};

Terms.prototype.length = function() {
	return this.terms.length;
}

Terms.prototype.findByKey = function(key, value) {
	for (var i = 0; i < this.terms.length; ++i) {
		var term = this.terms[i];
	    if (term[key] == value) {
	    	return term;
	    }
	  }
	  return null;
}

Terms.prototype.findById = function(value) {
	return this.findByKey("url", value);
}

Terms.prototype.sortedByKey = function(key) {
	return this.terms.slice(0).sort(function(a,b) {
		var ret = (typeof a[key] === 'string') ? a[key].localeCompare(b[key]) : a[key] - b[key];
	    return ret;
	});
}

Terms.prototype.ordered = function() {
	return this.sortedByKey('date');
}

Terms.prototype.asArray = function(key) {
	return this.terms;
}

function processJSONString(str) {
	var newstr = str;
	//newstr = str.replace(/[\/\\'"]/g,'');
	//newstr = newstr.replace(/[;:]/g,',');
	return newstr;
}

function getTerms() {
	var myterms = null;
	var terms = localStorage['terms'];
	if (terms !== undefined && terms != null) {
    	myterms = JSON.parse(terms);
    	myterms.__proto__ = Terms.prototype;
    	myterms.asArray().forEach(function(myterm) {
	        myterm.__proto__ = Term.prototype;
	        myterm.date = new Date(myterm.date);
	      });
	}
	return myterms;
}
