var http = require('http');
var request = require('request');
var uuidv1 = require('uuid/v1');
var crypto = require('crypto')
var utf8 = require('utf8')


function InstagramAuth(user, pwd, login_cbk=null, logout_cbk=null){
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
 	this.logout_callback = logout_cbk

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
This Function getMediaID , Send a URL ---> Get ID Media

*/

     this.getMediaID = function (media_id, maxid = null, callback) {
    

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
*************************************************************************
*/

this.getAPFromLocation = function (media_id, maxid = null, callback) {
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
            (data) => {

                callback(data)

            })
    }

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


	this.username = user
	this.password = pwd
	var seed = crypto.createHash('md5').update(utf8.encode(this.username)).update(utf8.encode(this.password)).digest('hex')
	this.device_id = this.generateDeviceID(seed)
	this.isLoggedIn = false
	this.cookieJar = request.jar()
	
	this.uuid = this.genUUID(true)
    var cookie = this._parseCookie()
}
//FUNCTION CALLS
//{P.P}

var x = new InstagramAuth('botig.4','25614541ab', 

//Login Callback 

    (o) => {

var res = JSON.parse(o.response)

console.log("Login Results : \n\n PK         : " +res.logged_in_user.pk+ 
    "\n Name       : " +res.logged_in_user.full_name+
    "\n Username   : "+res.logged_in_user.username+
    "\n ProfilePic : "+res.logged_in_user.profile_pic_url+
    "\n Status     : "+res.status+
    "\n CSRFToken  : "+ x.token +
    "\n Cookie     : "+x.cookies.sessionid

    )
},


//Logout Callback 


(o) =>{
    console.log("Logout "+JSON.stringify(o))
})

function get_user_followers(x, maxid, f)
{
    setTimeout(function() {
                        x.getUserFollowers(f.pk,maxid,(e) => {
                        var d = JSON.parse(e)
                        
                        //console.log(d)
                        
                        console.log("Followers of "+f.full_name+" : "+d.users.length)
                        

                        //Reccursive Function
                        //if (d.next_max_id) get_user_followers(x, d.next_max_id, f)
                    })
                    }, 500)//get following
}

x.login()




setTimeout(function() {
    if (x.isLoggedIn) 
        {
            x.getMediaComments('1228228345139660350_2222631888',null, (comm) =>
               
                {
                    var comment = JSON.parse(comm)
                    //console.log("media_comment : "+comm.comments.pk)
                    console.log("The Number Of Comments Is : "+comment.comment_count+"\n")
                    var usercom = JSON.parse(comm)
                    console.log(usercom)
                }
            )
            x.getMedialikers('1228228345139660350_2222631888',null ,(likk) =>
                {
                //    console.log("media_likes : "+likk)
                //   var likees = JSON.parse(likk)
                //   console.log("PERSON LIKED THIS PICTURE \n \n \n \n \n")

                //   console.log(likees.users)

                })
           


        setTimeout(function() {
        }, 10000)
    } 
}, 5000)






/*


setTimeout(function() {
    if (x.isLoggedIn) 
        {
            x.getFollowings(null,(o) =>
            {
                //console.log("Following "+o)
                var followings = JSON.parse(o)
                console.log(followings.users.length)

                followings.users.forEach(function(f){
                    setTimeout(function() {
                        x.getUserFollowings(f.pk,null,(e) => {
                        var followings = JSON.parse(e)
                        console.log("Followings of "+f.full_name+" : "+followings.users.length)
                    })
                    }, 500)//get following
                    
                    get_user_followers(x,null,f)
                })
            })

            x.getFollowers(null,(o) =>
            {
                //console.log("Followers "+o)
                var frs = JSON.parse(o)
                console.log(frs.users.length)

                frs.users.forEach(function(f){
                    get_user_followers(x,null,f)
                })
            })
        
            x.getMediaComments('1228228345139660350_2222631888',null, (comm) =>
                {
                    //console.log("media_comments : "+o)
                    var comments = JSON.parse(comm)
                    console.log(comments)
                }
            )
            x.getMedialikers('1228228345139660350_2222631888',null ,(likke) =>
                {
                    //console.log("media_likes : "+o)
                    var likes = JSON.parse(likke)
                    console.log(likes)
                    }
            )
        setTimeout(function() {
            x.logout()
        }, 60000)// apres 10 secondes logout    
    } 
}, 5000) // apres 5 secondes start processing

*/
