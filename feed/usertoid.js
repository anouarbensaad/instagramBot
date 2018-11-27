var common = require('../common/common_fn').igapi_common
var igapidb = require('../common/common_db').igapidb
var apirequest = require('../common/common_api_fn').ig_api_request
var api_i_request = require('../common/common_i_fn').ig_i_request
var validUrl = require('valid-url');
var igapi = new apirequest()
var ig_i_api = new api_i_request()
let usertoid = function(user_source, username, callback){
    igapidb.execute("SELECT * FROM `loginfo` WHERE `login`='"+user_source+"'",(err, result) => {  
            if(err){
                process.exit(-1)
            }else{
                if (result.length > 0){
                    ig_i_api.updateCookies(result[0].insta_cookies)
                    var endpoint = 'users/'+username+'/usernameinfo/'
                    return ig_i_api.sendRequest('users/'+username+'/usernameinfo/', null,
                    (user_to_id) => {
                                //console.log(data)
                        var userid = JSON.parse(user_to_id)
                        if (userid.status == 'ok'){
                            callback({
                                success: true,
                                response: userid.user.pk
                            })                      
                        }else{
                            callback({
                                success: false,
                                response: '[-] cannot get username from userid `'+userid.message+'`' 
                            })//end affectation of values to callback
                        }
                    })//end of callback sendRequest.
                }else{
                    console.log('username not avalaible.')
                }//end of else all thing Good
            }//end else selection true.
        })//end of selection user from database
    }//end of module

exports.utoid = usertoid