var common = require('../common/common_fn').igapi_common
var igapidb = require('../common/common_db').igapidb
var InstaApiRequest = require('../common/InstaApifunctions')
var Instaifunctions = require('../common/Instaifunctions')

var InstaIRequest = new Instaifunctions()
var InstaApiRequest = new InstaApiRequest()

class InstaAuth {

    constructor(username, password) {
    this.username = username
    this.password = password
    let seed = common.generateSeed(username, password)
    this.device_id = common.generateDeviceID(seed)
    this.uuid = common.genUUID(true)
    }
    login(callback) {
        InstaIRequest.sendRequest('si/fetch_headers/?challenge_type=signup&guid=' + common.genUUID(false), null,
        (data_header) => {
            if (data_header) {
                var cookie = InstaIRequest.parseCookie()
                this.send_data = {
                    'phone_id'  : common.genUUID(true),
                    '_csrftoken': cookie.csrftoken,
                    'username'  : this.username,
                    'guid'      : this.uuid,
                    'device_id' : this.device_id,
                    'password'  : this.password,
                    'login_attempt_count': '0'
                }
                InstaIRequest.sendRequest('accounts/login/', common.generateSignature(JSON.stringify(this.send_data)),
                (data) => {
                    if (data) {
                        var body = JSON.parse(data)
                        if (body.logged_in_user){
                            this.userid = body.logged_in_user.pk
                            var cookie = InstaIRequest.parseCookie()
                            this.instaProfile = body.logged_in_user
                            var cookies = cookie
                            this.token = cookie.csrftoken
                            this.isLoggedIn = true
                            this.fullname = body.logged_in_user.full_name
                            this.profile_pic = body.logged_in_user.profile_pic_url
                            this.cookiestr = InstaIRequest.getCookiesAsString()
                            this.followersinfo(this.username,data=>{console.log(data)})
                            callback({
                                success: true,
                                response: data
                            })
                        } else {
                            callback({
                            success: false,
                            response: data
                            })
                        }
                    } else {
                        callback({
                            success: false,
                            data: null
                        })
                    }
                })

            //after login
            } else {
                callback({
                    success : false,
                    response: 'message : no headers recieved from server.'
                })
            }
        })
    }
    logout(callback) {
        InstaIRequest.sendRequest('accounts/logout/', null,
            (data) => {
                console.log(data)
                callback(data)

            })
    }



    followersinfo(username,callback){
        var endpoint=""+username+"/?__a=1"
        InstaApiRequest._sendRequest(endpoint,null,data=>{
            var parsed_data = JSON.parse(data)
            var following = parsed_data.graphql.user.edge_followed_by.count
            callback({count:following})
        })
    }
    followedinfo(username){
        var endpoint=""+username+"/?__a=1"
        InstaApiRequest._sendRequest(endpoint,null,data=>{

        })
    }


}

module.exports = InstaAuth

