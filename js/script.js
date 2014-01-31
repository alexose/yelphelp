YelpHelp.prototype.init = function(){

	if (!this.options){
		throw new Error(this.errors.no_key_token);
	}
	
	this
		.initData()
		.initGraph();

	return this;
}

YelpHelp.prototype.initData = function(){

	var key = this.options.key;

	// Hook into Yelp's JSONP support
	$.getJSON(this.query(), function(data){
		console.log(data);
	});	

	return this;
}

YelpHelp.prototype.initGraph = function(){

	return this;
}

// Build a query string for Yelp's API
// via https://github.com/Yelp/yelp-api/blob/master/v2/js/search.html
YelpHelp.prototype.query = function(parameters){

	var o = this.options;

	parameters = parameters || [];

	parameters = parameters.concat([
		['term', 'food'],
		['location', 'boston'],
		['callback', 'cb'],
		['oauth_signature_method', 'HMAC-SHA1'],
	]);

	['oauth_consumer_key', 'oauth_consumer_secret', 'oauth_token'].forEach(function(d){
		parameters.push([d, o[d]]);
	});

    var message = {
        'action': 'http://api.yelp.com/v2/search',
        'method': 'GET',
        'parameters': parameters
    };

	var accessor = {
		consumerSecret : o.oauth_consumer_secret,
		tokenSecret : o.oauth_token_secret
	};
	
	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);	

	var parameterMap = OAuth.getParameterMap(message.parameters);
	parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)

	$.ajax({
		url: message.action,
		data: parameterMap,
		cache: true,
		dataType: 'jsonp',
		jsonpCallback: 'cb',
		success: function(data, textStats, XMLHttpRequest) {
			console.log(data);
		}
	});	
}

YelpHelp.prototype.errors = {
	no_key_token : 'No API credentials found.  Please fill out config/config.js with your API key from http://www.yelp.com/developers/request_apiv2_key.'	
}
