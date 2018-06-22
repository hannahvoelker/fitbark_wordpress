var keygetter = require("./keys.js")

var id = keygetter.get_id();
var secret = keygetter.get_secret();

var authorized = false;


/* authentication step -- unclear if I need to do this */ 
if(!authorized){
	var request = new XMLHttpRequest();
	request.open("POST", "https://app.fitbark.com/oauth/authorize", true);
	request.onreadystatechange = function(){
		if (request.readyState == 4 && request.status == 200 ){
			elements = JSON.parse(request.responseText);
			authorized = true;
		}
	}
	request.send("response_type=client_credentials&client_id="+id+"&redirect_uri=urn:ietf:wg:oauth:2.0:oob");
}
