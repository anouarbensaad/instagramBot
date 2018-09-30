var http = require('http')
var request = require('request')
var uuidv1 = require('uuid/v1')
var crypto = require('crypto')
var utf8 = require('utf8')
var fs = require('fs')
var mysql = require('mysql')

 /*
**************************************************************************
DB Connection ..

*/

var con = mysql.createConnection({
  host: "*********",
  user: "*********",
  password: "**********",
  database: "************"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("DATABASE Connected ...");
});

 /*
**************************************************************************
Instagram use API URL = http://api.instagram.com/..

*/

function InstagramAPI(){
    if (!(this instanceof InstagramAPI))
        return new InstagramAPI()

    var API_URL = 'https://api.instagram.com/'
    
    this.cookieJar = request.jar()

    this._sendRequest = function(endpoint, postData = null, callback) {
        if (postData != null) {
            request.post({
                    url: API_URL + endpoint,
                    jar: this.cookieJar,
                    form: postData
                },
                (err, response, body) => {
                    if (err)
                        callback(null)
                    else
                        callback(body)
                }
            )
        } else {
            request.get({
                    url: API_URL + endpoint,
                    jar: this.cookieJar
                },
                (err, response, body) => {
                    if (err)
                        callback(null)
                    else {
                        callback(body)
                    }
                }
            )
        }
    }

        /*
**************************************************************************
This Function getMediaID , Send a URL ---> Get ID Media

*/

    this.getMedia_id = function(instaUrl, callback) {
            var endpoint = 'oembed/?callback=&url='
            
            endpoint += encodeURIComponent(instaUrl)

            this._sendRequest(endpoint, null,
                (data) => {
                    try{
                        //console.log(data)
                        var omedia = JSON.parse(data)
                        var mediaid=omedia.media_id
                        callback({
                            success: true,
                            response: {'media_id': mediaid}
                        })                      
                    }catch (err) {

                        callback({
                            success: false,
                            response: 'Cannot get media_id for this URL `'+instaUrl+'`' 
                        })
                    }
                }
                
            )
    }




    this.getMedia_pic = function(instaUrl, callback) {
            var endpoint = 'oembed/?callback=&url='
            
            endpoint += encodeURIComponent(instaUrl)

            this._sendRequest(endpoint, null,
                (data) => {
                    try{
                        //console.log(data)
                        var omedia = JSON.parse(data)
                        var mediapic=omedia.thumbnail_url
                        callback({
                            success: true,
                            response: {'media_pic': mediapic}
                        })                      
                    }catch (err) {

                        callback({
                            success: false,
                            response: 'Cannot get media_picture for this URL `'+instaUrl+'`' 
                        })
                    }
                }
                
            )
    }







}
var InstagramAPI = new InstagramAPI()



 /*
**************************************************************************
InstagramAuth use API URL = http://i.instagram.com/..

*/

function InstagramAuth(user, pwd, login_cbk=null, logout_callback=null){
	if (!(this instanceof InstagramAuth))
		return new InstagramAuth(user, pwd, login_cbk, logout_cbk)
	var API_URL = 'https://i.instagram.com/api/v1/'
	var DEVICE_SETTINGS = {
	    'manufacturer': 'sumsung',
	    'model': 'SM-N920I',
	    'android_version': 22,
	    'android_release': '5.1.1'
	}
	var USER_AGENT = 'Instagram 9.6.0 Android (' + DEVICE_SETTINGS.android_version + '/' + DEVICE_SETTINGS.android_release + '; 560dpi; 1440x2560; ' + DEVICE_SETTINGS.manufacturer + '; ' + DEVICE_SETTINGS.model + '; armani; qcom; en_US)'
	var IG_SIG_KEY = 'c1c7d84501d2f0df05c378f5efb9120909ecfb39dff5494aa361ec0deadb509a'
	var SIG_KEY_VERSION = '4'


	var headers = {
	    
	    'Content-Type'		  :     'Content-Type: application/x-www-form-urlencoded; charset=UTF-8',
	    'Host'				  :	  	'i.instagram.com',
	    'Connection'		  : 	'Keep-Alive',
	    'User-Agent'		  :      USER_AGENT,
	    'Accept-Language'	  : 	'en-US',
	    'X-IG-Connection-Type':  	'WIFI',
	    'Accept' 			  : 	'*/*'
	}

	var options = {
	    host   : 'i.instagram.com',
		path   : '/api/v1/accounts/login/',
		method : 'GET',
		headers: 'headers'
	}
 
 	this.login_callback = login_cbk
 	//this.logout_callback = logout_cbk

/*
**************************************************************************
This Function To Parse Cookies to object, 

*/

    this._parseCookie = function() {
        var cookies = this.cookieJar.getCookieString(API_URL).split("; ")
        var cookiesMap = {}
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].split('=')
            cookiesMap[cookie[0]] = cookie[1]

        }
        return cookiesMap
    }

/*
**************************************************************************
This Function To Parse Cookies to object, 

*/

    this.getCookiesAsString = function (){
        return this.cookieJar.getCookieString(API_URL).split("; ")
}

/*
**************************************************************************
This Function To Generate Devices Settings , model ,Version ... , 

*/


    this.generateDeviceID = function(seed) {
        var volatile_seed = "12345"
        var hash = crypto.createHash('md5').update(utf8.encode(seed) + utf8.encode(volatile_seed)).digest('hex')
        return 'android-' + hash.substring(0, 16)
    }

/*
**************************************************************************
This Function To Generate Private API Key , 

*/


    this.generateSignature = function(data, skip_quote = false) {
        var parsedData
        if (!skip_quote)
            parsedData = encodeURIComponent(data)
        else
            parsedData = data
        var hash = crypto.createHmac('sha256', utf8.encode(IG_SIG_KEY)).update(utf8.encode(data)).digest('hex')
        return 'ig_sig_key_version=' + SIG_KEY_VERSION + '&signed_body=' + hash + '.' + parsedData
    }

/*
**************************************************************************
This Function To send Requests , * Requests From The API __ Informations exmpl
endpoint : path
post = data to Post , or get
function callback() 

*/

    this._sendRequest = function(endpoint, postData = null, callback) {
        if (postData != null) {
            request.post({
                    headers: headers,
                    url: API_URL + endpoint,
                    jar: this.cookieJar,
                    form: postData
                },
                (err, response, body) => {
                    if (err)
                        callback(null)
                    else
                        callback(body)
                }
            )
        } else {
            request.get({
                    headers: headers,
                    url: API_URL + endpoint,
                    jar: this.cookieJar
                },
                (err, response, body) => {
                    if (err)
                        callback(null)
                    else {
                        callback(body)
                    }
                }
            )
        }

    }

/*
**************************************************************************
This Function to Generate The UUID

*/

    this.genUUID = function(dash) {
        var uuid = uuidv1()
        if (dash)
            return uuid
        else
            return uuid.replace('-', '')
    }

/*
**************************************************************************
This Function Login and get & all information from JSON File 
Function Callback login_callback

*/

    this.login = function() {
        this._sendRequest('si/fetch_headers/?challenge_type=signup&guid=' + this.genUUID(false), null,
            (data) => {
                if (data) {

                    var cookie = this._parseCookie()
                    var send_data = {
                        'phone_id': this.genUUID(true),
                        '_csrftoken': cookie.csrftoken,
                        'username': this.username,
                        'guid': this.uuid,
                        'device_id': this.device_id,
                        'password': this.password,

                        'login_attempt_count': '0'
                    }

                    this._sendRequest('accounts/login/', this.generateSignature(JSON.stringify(send_data)),
                        (data) => {
                            if (data) {
                                try {
                                    var body = JSON.parse(data)
                                    this.userid = body.logged_in_user.pk
                                    this.rank_token = this.userid + "_" + this.uuid
                                    var cookie = this._parseCookie()
                                    this.instaProfile = body.logged_in_user
                                    this.cookies = cookie
                                    this.token = cookie.csrftoken
                                    this.isLoggedIn = true
                                    this.fullname = body.logged_in_user.full_name
                                    this.profile_pic = body.logged_in_user.profile_pic_url
	                                    if (this.login_callback) this.login_callback({
	                                        success: true,
	                                        response: data
	                                    })

                                } catch (err) {
                                    this.isLoggedIn = false
                                    console.log(err)
                                    if (this.login_callback) this.login_callback({
                                        success: false,
                                        response: data
                                    })

                                }

                            } else
                                if (this.login_callback) this.login_callback({
                                    success: false,
                                    response: data
                                })

                        }
                    )
                } else
                    if (this.login_callback) this.login_callback({
                        success: false,
                        data: null
                    })
            })
    }


/*
**************************************************************************
This Function Logout 
Function Callback logout_callback

*/

    this.logout = function() {
        this._sendRequest('accounts/logout/', null,
            (data) => {
                console.log(data)
                if (this.logout_callback) this.logout_callback(data)

            })
    }

/*
**************************************************************************
This Function GetFollowings , to get all your followings

*/

    this.getFollowings = function (maxid = null, callback) {
        if (this.isLoggedIn) {
            var endpoint = 'friendships/' + this.userid + '/following/?'
            var query = {
                'ig_sig_key_version': SIG_KEY_VERSION,
                'rank_token': this.rank_token
            }

            if (maxid)
                query['max_id'] = maxid
            endpoint += encodeURIComponent(query)
            this._sendRequest(endpoint, null,
                (data) =>
                callback(data)
            )
        } else
            callback(null)
    }

/*
**************************************************************************
This Function GetFollowers , to get all your followers

*/

    this.getFollowers = function (maxid = null, callback) {
        if (this.isLoggedIn) {
            var endpoint = 'friendships/' + this.userid + '/followers/?'
            var query = {
                'ig_sig_key_version': SIG_KEY_VERSION,
                'rank_token': this.rank_token
            }

            if (maxid)
                query['max_id'] = maxid
            endpoint += encodeURIComponent(query)
            this._sendRequest(endpoint, null,
                (data) =>
                callback(data)
            )
        } else
            callback(null)
    }

/*
**************************************************************************
This Function GetUserFollowings , to get all followings from [USERID]

*/

    this.getUserFollowings = function (userid, maxid = null, callback) {
        if (this.isLoggedIn) {
            var endpoint = 'friendships/' + userid + '/following/?'
            var query = {
                'ig_sig_key_version': SIG_KEY_VERSION,
                'rank_token': userid+'_'+this.uuid
            }

            if (maxid)
                query['max_id'] = maxid
            endpoint += encodeURIComponent(query)
            this._sendRequest(endpoint, null,
                (data) =>
                callback(data)
            )
        } else
            callback(null)
    }

/*
**************************************************************************
This Function GetUserFollowers , to get all followings from [USERID]

*/

    this.getUserFollowers = function (userid, maxid = null, callback) {
        if (this.isLoggedIn) {
            var endpoint = 'friendships/' + userid + '/followers/?'
            var query = {
                'ig_sig_key_version': SIG_KEY_VERSION,
                'rank_token': userid+'_'+this.uuid
            }

            if (maxid)
                query['max_id'] = maxid
            endpoint += encodeURIComponent(query)
            this._sendRequest(endpoint, null,
                (data) =>
                callback(data)
            )
        } else
            callback(null)
    }



    

/*
**************************************************************************
This Function getMediaIDToLike , Get 5 Posts From Person ID & Liked-it

*/

     this.getMediaIDToLike = function (media_id, maxid = null, callback) {
    
    }




/*
**************************************************************************
This Function getMediaLikers , Get 5 Posts From Person ID & Liked-it

*/

     this.getMedialikers = function (media_id, maxid = null, callback) {
        if (this.isLoggedIn) {
            var endpoint = 'media/' + media_id + '/likers/'
            var query = {
                'ig_sig_key_version': SIG_KEY_VERSION,
                'rank_token': userid+'_'+this.uuid
            }
            if (maxid)
            {
                query['max_id'] = maxid
                endpoint += '?'+encodeURIComponent(query)
            }
            
            this._sendRequest(endpoint, null,
                (data) =>
                callback(data)
            )
        } else
            callback(null)
    }

/*
*************************************************************************
*/

this.LocationSearch = function (media_id, maxid = null, callback) {
        if (this.isLoggedIn) {
            var endpoint = 'media/' + media_id + '/likers/'
            var query = {}
            if (maxid)
            {
                query['max_id'] = maxid
                endpoint += '?'+encodeURIComponent(query)
            }
            
            this._sendRequest(endpoint, null,
                (data) =>
                callback(data)
            )
        } else
            callback(null)
    }


/*
**************************************************************************
This Function getMediaComments , Post The Media URL & Get All Comments From This Media

*/

     this.getMediaComments = function (media_id, maxid = null, callback) {
        if (this.isLoggedIn) {
            var endpoint = 'media/' + media_id + '/comments/'
            var query = {}
            if (maxid)
            {
                query['max_id'] = maxid
                endpoint += '?'+encodeURIComponent(query)
            }
            
            this._sendRequest(endpoint, null,
                (data) =>
                callback(data)
            )
        } else
            callback(null)
    }

/*
*/

this.story_viewers = function (story_id, maxid = null, callback) {
        if (this.isLoggedIn) {
            var endpoint = 'media/' + story_id + '/list_reel_media_viewer/'
            var query = {}
            if (maxid)
            {
                query['max_id'] = maxid
                endpoint += '?'+encodeURIComponent(query)
            }
            
            this._sendRequest(endpoint, null,
                (data) =>
                callback(data)
            )
        } else
            callback(null)
    }

/*
***************************************************************************
This Function DoLike , Get Media ID ---- > Liked
*/

 this.liked = function (media_id, callback) {
       
        var data = JSON.stringify({
            '_uuid': this.uuid,
            '_uid': this.userid,
            'media_id': media_id,
            '_csrftoken': this.token
        })
       
        return this._sendRequest('media/' + media_id + '/like/', this.generateSignature(data),
            (data) => {callback(data)})
    }

/*
***************************************************************************
This Function DoLike , Get Media ID ---- > Liked
*/

 this.unliked = function (media_id, callback) {
       
        var data = JSON.stringify({
            '_uuid': this.uuid,
            '_uid': this.userid,
            'media_id': media_id,
            '_csrftoken': this.token
        })
       
        return this._sendRequest('media/' + media_id + '/unlike/', this.generateSignature(data),
            (data) => {callback(data)})
    }



/*
**************************************************************************
This Function Unfollow  , Post The Media URL & Get All Comments From This Media

*/

        this.unfollow = function (userId, callback) {
        var data = JSON.stringify({
            '_uuid': this.uuid,
            '_uid': this.userid,
            'user_id': userId,
            '_csrftoken': this.token
        })
        return this._sendRequest('friendships/destroy/' + userId + '/', this.generateSignature(data),
            (data) => {callback(data)})
    }

/*
**************************************************************************
This Function Unfollow  , Post The Media URL & Get All Comments From This Media

*/
        this.follow = function (userId, callback) {
        var data = JSON.stringify({
            '_uuid': this.uuid,
            '_uid': this.userid,
            'user_id': userId,
            '_csrftoken': this.token
        })
        return this._sendRequest('friendships/create/' + userId + '/', this.generateSignature(data),
            (data) => {

                callback(data)

            })
    }


    /*
**************************************************************************
This Function getUserIDbyLogin  , Search Person With Login & Return ---> PK

*/


this.getUserIDbyLogin = function(userName, callback) {
        if (this.isLoggedIn) {
            var endpoint = 'users/search/?q='
             endpoint += encodeURIComponent(userName)

            this._sendRequest(endpoint, null,
                (data) => {
                    try{
                        var udata = JSON.parse(data)
                        callback({
                            success: true,
                            response: data
                        })                      
                    }catch (err) {

                        callback({
                            success: false,
                            response: 'Cannot get the user id from `'+userName+'`' 
                        })
                    }
                }
                
            )
    }}

    /*
**************************************************************************
This Function getUserIDbyLogin  , Search Person With Login & Return ---> PK

*/
    this.getUserFeed = function(userid, callback) {
            if (this.isLoggedIn) {
            var endpoint = 'feed/user/' + userid + '/'
/*MEDIA TYPE :
    1 #: Photo Type 
    2 #: Video Type 
    8 #: Carousel //ALBUM TYPE
  
  */      
        this._sendRequest(endpoint, null,
                (data) => {
                    try{
                        var udata = JSON.parse(data)
                        callback({
                            success: true,
                            response: data
                        })                      
                    }catch (err) {

                        callback({
                            success: false,
                            response: 'Cannot get the user posts from `'+userid+'`' 
                        })
                    }
                }
                
            )
    }}


/*
VAR USED
*/

	this.username = user
	this.password = pwd
	var seed = crypto.createHash('md5').update(utf8.encode(this.username)).update(utf8.encode(this.password)).digest('hex')
	this.device_id = this.generateDeviceID(seed)
	this.isLoggedIn = false
	this.cookieJar = request.jar()
	
	this.uuid = this.genUUID(true)
}


var x = new InstagramAuth('#USERNAME*******','#PASSWORD*******', 

//Login Callback 

    (o) => {

var cookiemanual = "rur="+x.cookies.rur+";"+"mid="+x.cookies.mid+";"+"mcd="+x.cookies.mcd+";"+"csrftoken="+x.cookies.csrftoken+";"+"ds_user="+x.cookies.ds_user+";"+"ds_user_id="+x.cookies.ds_user_id+";"+"sessionid="+x.cookies.sessionid
var rurcki = x.cookies.rur

var res = JSON.parse(o.response)
var cookiemanual = "rur="+x.cookies.rur+";"+"mid="+x.cookies.mid+";"+"mcd="+x.cookies.mcd+";"+"csrftoken="+x.cookies.csrftoken+";"+"ds_user="+x.cookies.ds_user+";"+"ds_user_id="+x.cookies.ds_user_id+";"+"sessionid="+x.cookies.sessionid
console.log("Login Results : \n\n PK         : " +res.logged_in_user.pk+ 
    "\n Name       : " +res.logged_in_user.full_name+
    "\n Username   : "+res.logged_in_user.username+
    "\n ProfilePic : "+res.logged_in_user.profile_pic_url+
    "\n Status     : "+res.status+
    "\n CSRFToken  : "+ x.token +
    "\n Cookies    : "+ cookiemanual+
    "\n Android V  : "+ x.device_id+"\n"+"\n\n\n\n"
)

  var login = res.logged_in_user.username
   var passwd = x.password
   var name_to = res.logged_in_user.full_name
   var insta_cookies = rurcki
   var insta_csrftoken = x.token
   var insta_user_id = res.logged_in_user.pk
   var android_ver = x.device_id

// FOR DUPLICATE
    var up_insta_cookies = rurcki
    var up_insta_csrftoken = x.token
    var up_passwd = x.password
    var up_android_ver = x.device_id


//console.log("to string * :"+username_to+"\n"+pass_to+"\n"+name_to+"\n"+cookie_to+"\n"+csrftoken_to+"\n"+pk_to+"\n"+device_to)

//INSERT INTO DATABASE

  var sql = "INSERT INTO instalog (login,passwd,insta_cookies,insta_csrftoken,insta_user_id,android_ver) VALUES('"+login +
  "', '"+passwd+"', '"+insta_csrftoken+"', '"+insta_user_id+"', '"+android_ver+"');"

  con.query(sql, function (err, result) {
     if(err) throw err;
    console.log("Data inserted");
  
  });

},
(o) =>{
//    console.log("Logout "+JSON.stringify(o))
})

x.login()
setTimeout(function() {
    if (x.isLoggedIn) 
        {
//GET MEDIA ID : SUCESS
InstagramAPI.getMedia_id('https://www.instagram.com/p/BoKJpZNB4Vq/?taken-by=instagram',(o)=>{
console.log(o.response)})
//GET MEDIA PICTURE : SUCESS
InstagramAPI.getMedia_pic('https://www.instagram.com/p/BoKJpZNB4Vq/?taken-by=instagram',(o)=>{
console.log(o.response)})
//USER FEED POSTS
x.getUserFeed('5525720510',(o) => {
                var ufeed = JSON.parse(o.response)
                console.log(ufeed)
 //               console.log(all.num_results+' POSTS FOUND')
                ufeed.items.forEachh(function(f){
                   console.log(f)
                })
            })

/*

            x.liked('1876354621732521322_25025320',(o)=>{
                console.log(o)    
            }
                )
*/
/*
            x.unliked('1876354621732521322_25025320',(o)=>{
                console.log(o)    
            }
                )
*/





/*

                x.getUserIDbyLogin('tigbeats',(arr) => {
                var user = JSON.parse(arr.response)
                                //console.log(user)
                                console.log('Search Results : '+user.num_results+' USER FOUND'+
                                    '\n**************************************')
                                var i=0
                                //console.log(user)
                                user.users.forEach(function(f){
                                    //console.log(f)
                                    i++
                                    console.log(
                                              '            USER N° '+i+
                                              '\n**************************************\n'+
                                              '\nUsername : '+f.username+
                                              '\nName     : '+f.full_name+
                                              '\nUserID   : '+f.pk+
                                              '\nType Acc : '+f.is_private+
                                              '\nFollowers: '+f.byline+
                                              '\n\n**************************************')
                                })

                })

*/

        setTimeout(function() {
            x.logout()
        }, 10000)// apres 10 secondes logout    
    } 
}, 5000) // apres 5 secondes start processing

