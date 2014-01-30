YelpHelp.prototype.init = function(){

	if (!this.options || !this.options.key){
		throw new Error(no_key);
	}
}

YelpHelp.prototype.errors = {
	no_key : 'No API credentials found.  Please fill out config/config.js with your API key from http://www.yelp.com/developers/request_apiv2_key.'	
}
