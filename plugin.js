var keygetter = require("./keys.js");
var express = require('express')
var app = express()
var id = keygetter.get_id();
var secret = keygetter.get_secret();
var ClientOAuth2 = require('client-oauth2');

var fitbarkAuth = new ClientOAuth2({
  clientId: id,
  clientSecret: secret,
  accessTokenUri: "https://app.fitbark.com/oauth/token",
  authorizationUri: "https://app.fitbark.com/oauth/authorize",
  redirectUri: 'urn:ietf:wg:oauth:2.0:oob',
  scopes: ['notifications', 'gist']
});

var token = fitbarkAuth.createToken('access token');
// expires in a year
token.expiresIn(365*24*60*60*60);
token.refresh();

storeNewToken = function(){
	console.log("stored")
}

app.get('/auth/fitbark', function (req, res) {
  var uri = fitbarkAuth.code.getUri()

  res.redirect(uri)
})

// from the mulesoft oauth2 package
app.get('/auth/fitbark/callback', function (req, res) {
  fitbarkAuth.code.getToken(req.originalUrl)
    .then(function (user) {
      console.log(user) //=> { accessToken: '...', tokenType: 'bearer', ... }

      // Refresh the current users access token.
      user.refresh().then(function (updatedUser) {
        console.log(updatedUser !== user) //=> true
        console.log(updatedUser.accessToken)
      })

      // Sign API requests on behalf of the current user.
      user.sign({
        method: 'get',
        url: 'http://example.com'
      })

      // We should store the token into a database.
      return res.send(user.accessToken)
    })
})



/*  OLD CODE BELOW ~~ dunno if I am going to use the node pacakge or not
this needs to change once I figure out how to store the token on Raven
perhaps a Mongo instance... tbd 
var authorized = false;

// authentication 
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
} */