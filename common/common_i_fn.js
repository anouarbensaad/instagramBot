
var request = require('request')
exports.ig_i_request = ig_i_request

function ig_i_request(){

const self = {}


    let I_API_URL = 'https://i.instagram.com/api/v1/'
    
    var DEVICE_SETTINGS = {
        'manufacturer': 'sumsung',
        'model': 'SM-N920I',
        'android_version': 22,
        'android_release': '5.1.1'
    }

    let USER_AGENT = 'Instagram 9.6.0 Android (' + DEVICE_SETTINGS.android_version + '/' + DEVICE_SETTINGS.android_release + '; 560dpi; 1440x2560; ' + DEVICE_SETTINGS.manufacturer + '; ' + DEVICE_SETTINGS.model + '; armani; qcom; en_US)'


    let headers = {
        
        'Content-Type'        :     'Content-Type: application/x-www-form-urlencoded; charset=UTF-8',
        'Host'                :     'i.instagram.com',
        'Connection'          :     'Keep-Alive',
        'User-Agent'          :      USER_AGENT,
        'Accept-Language'     :     'en-US',
        'X-IG-Connection-Type':     'WIFI',
        'Accept'              :     '*/*'
    }

	let cookieJar = request.jar()
	

    self.parseCookie = function() {
        var cookies = cookieJar.getCookieString(I_API_URL).split("; ")
        var cookiesMap = {}
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].split('=')
            cookiesMap[cookie[0]] = cookie[1]}
        return cookiesMap
    }
	self.getCookiesAsString = function (){
	        return cookieJar.getCookieString(I_API_URL)
	}
	self.updateCookies = function(cookiesString){
		var cookies = cookiesString.split("; ")
		if (cookies) cookies.forEach((c) => {cookieJar.setCookie(c, I_API_URL, {ignoreError: true})})	
	}

    self.sendRequest = function(endpoint, postData = null, callback) {
        if (postData != null) {
            request.post(
            {
                headers: headers,
                url: I_API_URL + endpoint,
                jar: cookieJar,
                form: postData
            },(err, response, body) => {
                if (err)
                    callback(null)
                else
                    callback(body)}
                )}
                    else {
            request.get({
                    headers: headers,
                    url: I_API_URL + endpoint,
                    jar: cookieJar
                },(err, response, body) => {
                    if (err)
                        callback(null)
                    else {
                        callback(body)
                    }})}}



        self.untoid = function(username, callback) {
            var endpoint = 'users/'+username+'/usernameinfo/'
            self.sendRequest(endpoint, null,
                (data) => {
                userid = JSON.parse(data)
                callback(userid.user.pk)
                })
            }   
return self
}
