require('http');
var keygetter = require("./keys.js")

var id = keygetter.get_id();
var secret = keygetter.get_secret();


/* this needs to change once I figure out how to store the token on Raven
perhaps a Mongo instance... tbd */
var authorized = false;

/* authentication */ 
if(!authorized){
	var request = new XMLHttpRequest();
	request.open("POST", "https://app.fitbark.com/oauth/authorize", true);
	request.onreadystatechange = function(){
		if (request.readyState == 4 && request.status == 200 ){
			var access_code = request.response; // ???
			var token = requestToServer(access_code);
			if(token != null){
				authorized = true;
			}
		}
	}
	request.send("response_type=client_credentials&client_id="+id+"&redirect_uri=urn:ietf:wg:oauth:2.0:oob");
}

requestToServer = function(access_code){
	var request = new XMLHttpRequest();
	request.open("POST", "https://app.fitbark.com/oauth/token", true);
	request.onreadystatechange = function(){
		if (request.readyState == 4 && request.status == 200 ){
			var elements = JSON.parse(request.responseText);
			console.log(elements);
		}
		else {
			return null;
		}
	}
	request.send();
}