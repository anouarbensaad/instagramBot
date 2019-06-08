'use strict'

var common = require('../common/common_fn').igapi_common
var igapidb = require('../common/common_db').igapidb
var apirequest = require('../common/common_api_fn').ig_api_request
var api_i_request = require('../common/common_i_fn').ig_i_request
var igapi = new apirequest()
var ig_i_api = new api_i_request()
exports.iG_Auth = iG_Auth
/*Making Of Arguments Options */
    /*________******************************__________*/
function iG_Auth(){
    const self = {}
        self.login = function(username, password) {   
            let seed = common.generateSeed(username, password)
            let device_id = common.generateDeviceID(seed)
            let uuid = common.genUUID(true)
            ig_i_api.sendRequest('si/fetch_headers/?challenge_type=signup&guid=' + common.genUUID(false), null,
            (data_header) => {
                if (data_header) {
                    var cookie = ig_i_api.parseCookie()
                    var send_data = 
                        {
                        'phone_id': common.genUUID(true),
                        '_csrftoken': cookie.csrftoken,
                        'username': username,
                        'guid': uuid,
                        'device_id': device_id,
                        'password': password,
                        'login_attempt_count': '0'
                        }
                    ig_i_api.sendRequest('accounts/login/', common.generateSignature(JSON.stringify(send_data)),
                    (data) => {
                        if (data) {
                            try {
                                var body = JSON.parse(data)
                                if (body.logged_in_user){
                                    var userid = body.logged_in_user.pk
                                    var rank_token = userid + "_" + uuid
                                    var cookie = ig_i_api.parseCookie()
                                    var instaProfile = body.logged_in_user
                                    var cookies = cookie
                                    var token = cookie.csrftoken
                                    var isLoggedIn = true
                                    var fullname = body.logged_in_user.full_name
                                    var profile_pic = body.logged_in_user.profile_pic_url
                                    var cookiestr = ig_i_api.getCookiesAsString()
                                    console.log('___________LOGIN_INFORMATIONS__________'+'\n'+
                                                            'pk        : '+body.logged_in_user.pk+'\n'+
                                                            'username  : '+body.logged_in_user.username+'\n'+
                                                            'full_name : '+body.logged_in_user.full_name+'\n'+
                                                            'ProfilePic: '+body.logged_in_user.profile_pic_url+'\n'+
                                                            'Status    : '+body.status+'\n'+
                                                            'Android V.: '+device_id+'\n'+
                                                            'csrftoken : '+token+'\n\n'+
                                                            'cookies   : '+cookiestr+'\n'+
                                                            '________________________________________')
                                    igapidb.execute(("INSERT INTO `ig_accounts` (`login`, `passwd`, `insta_cookies`, `insta_csrftoken`, `insta_user_id`, `android_ver`, `Name`, `profilepic`) VALUES ('"
                                                    +username+"', '"+password+"', '"+cookiestr+"', '"+token+"', '"+userid+"', '"+device_id+"', '"+fullname+"', '"+profile_pic+
                                                    "')ON DUPLICATE KEY UPDATE passwd='"+password+"', insta_cookies='"+cookiestr+"', insta_csrftoken='"+token+"', android_ver='"+device_id+"'"),
                                    (err, result) => {
                                        if(err){
                                            console.log('\x1b[91m%s\x1b[0m','[-] Failed Insert Record To DATABASE : '+err)
                                            process.exit(-1)
                                        }else{
                                            console.log('\x1b[92m%s\x1b[0m','[+] Successfully insert record to database')
                                            process.exit(0)
                                        }
                                    })//end of insert into database table loginfo
                                }else{ /*if (body.logged_in_user)*/
                                    console.log('\x1b[91m%s\x1b[0m','Login Failed : '+body.message)
                                }
                            }catch (err){
                                isLoggedIn = false  
                                console.log('\x1b[91m%s\x1b[0m','Unknown error occured : '+err)
                            }                           
                        }else /*if (data) */{
                            console.log('\x1b[91m%s\x1b[0m','No data received from server. Nothing to process.')
                        }
                    })//end of request callback (data)=>
                }else{/*if (data_header) */
                    console.log('\x1b[91m%s\x1b[0m','No headers received from server. Nothing to process.')
                }//else catching error
            })//end of dataheader callback sendRequest
            return self
        }//end of module Login
        /*________******************************__________*/
        self.logout = function() {
            ig_i_api.sendRequest('accounts/logout/', null,
            (logout) => {
                var jstatus = JSON.parse(logout)
                if (jstatus.status == 'ok'){
                    console.log(`${argv.user} Deconnected..`)
                }else{
                    console.log(`Status : ${jstatus.status}`)
                }
            })//end of sendRequest callback (LOGOUT)
        
        }//end of logout function
        
    return self
}
    //'\x1b[91m%s\x1b[0m',  : RED
    //'\x1b[92m%s\x1b[0m',  : GREEN
    //'\x1b[91m%s\x1b[0m',  : YELLOW
