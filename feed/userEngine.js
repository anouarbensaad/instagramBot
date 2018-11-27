var common = require('../common/common_fn').igapi_common
var igapidb = require('../common/common_db').igapidb
var apirequest = require('../common/common_api_fn').ig_api_request
var api_i_request = require('../common/common_i_fn').ig_i_request
var validUrl = require('valid-url');
var igapi = new apirequest()
var ig_i_api = new api_i_request()
var utoid = require('./usertoid')

var argv = require('yargs')
    .usage('Usage: $0 -user [username] -  -search [search] -target [id | username] -check [check_username] -detail [detail_info]')
    .demand(['user','tosearch'])
    .argv;

let check_username = function(username){
igapidb.execute("SELECT * FROM `loginfo` WHERE `login`='"+argv.user+"'",(err, result) => {  

    if(err){
        console.log('Error Select from : '+err)
        process.exit(-1)
    }else{
        if (result.length > 0){
            ig_i_api.updateCookies(result[0].insta_cookies)
            console.log('User '+argv.user+' Found ')
                var endpoint = 'users/check_username/'+username
            return ig_i_api.sendRequest(endpoint, null,
                (check_username) => {
                console.log(check_username)
                })
        }else{
                    console.log('User '+argv.user+' not found.')  
                
                process.exit(-4)      
            }   
        }
    })
}

let user_detail_info = function(userid){
igapidb.execute("SELECT * FROM `loginfo` WHERE `login`='"+argv.user+"'",(err, result) => {  

    if(err){
        console.log('Error Select from : '+err)
        process.exit(-1)
    }else{
        if (result.length > 0){
            ig_i_api.updateCookies(result[0].insta_cookies)
            console.log('User '+argv.user+' Found ')
                var endpoint = 'users/'+userid+'/full_detail_info/'
            return ig_i_api.sendRequest(endpoint, null,
                (user_detail_info) => {
                console.log(user_detail_info)
                })
        }else{
                    console.log('User '+argv.user+' not found.')  
                
                process.exit(-4)      
            }   
        }
    })
}    


let user_map = function(userid){
igapidb.execute("SELECT * FROM `loginfo` WHERE `login`='"+argv.user+"'",(err, result) => {  

    if(err){
        console.log('Error Select from : '+err)
        process.exit(-1)
    }else{
        if (result.length > 0){
            ig_i_api.updateCookies(result[0].insta_cookies)
            console.log('User '+argv.user+' Found ')
                var endpoint = 'maps/user/'+userid+'/'
            return ig_i_api.sendRequest(endpoint, null,
                (user_map) => {
                console.log(user_map)
                })
        }else{
                    console.log('User '+argv.user+' not found.')  
                
                process.exit(-4)      
            }   
        }
    })
}  

let user_to_id = function(username){
    igapidb.execute("SELECT * FROM `loginfo` WHERE `login`='"+argv.user+"'",(err, result) => {  

    if(err){
        console.log('Error Select from : '+err)
        process.exit(-1)
    }else{
        if (result.length > 0){
            ig_i_api.updateCookies(result[0].insta_cookies)
            console.log('User '+argv.user+' Found ')
                var endpoint = 'users/'+username+'/usernameinfo/'
            return ig_i_api.sendRequest('users/'+username+'/usernameinfo/', null,
            (user_to_id) => {
                                   try{
                        //console.log(data)
                        var omedia = JSON.parse(data)
                        var mediaid=omedia.media_id
                        callback({
                            success: true,
                            response: mediaid
                        })                      
                    }catch (err) {

                        callback({
                            success: false,
                            response: 'Cannot get media_id for this URL `'+instaUrl+'`' 
                        })
                    }
            })
        }
    }
    })
}
let username_info = function(username){
igapidb.execute("SELECT * FROM `loginfo` WHERE `login`='"+argv.user+"'",(err, result) => {  

    if(err){
        console.log('Error Select from : '+err)
        process.exit(-1)
    }else{
        if (result.length > 0){
            ig_i_api.updateCookies(result[0].insta_cookies)
            console.log('User '+argv.user+' Found ')
                var endpoint = 'users/'+username+'/usernameinfo/'
            return ig_i_api.sendRequest(endpoint, null,
                (username_info) => {
                console.log(username_info)
                })
        }else{
                    console.log('User '+argv.user+' not found.')  
                
                process.exit(-4)      
            }   
        }
    })
}

let usersearch = function(userName){

igapidb.execute("SELECT * FROM `loginfo` WHERE `login`='"+argv.user+"'",(err, result) => {  

    if(err){
        console.log('Error Select from : '+err)
        process.exit(-1)
    }else{
        if (result.length > 0){
            ig_i_api.updateCookies(result[0].insta_cookies)
            console.log('User '+argv.user+' Found ')
            var endpoint = 'users/search/?q='
                endpoint += encodeURIComponent(userName)
                ig_i_api.sendRequest(endpoint, null,
                    (getUserIDbyLogin) => {
                    user  = JSON.parse(getUserIDbyLogin)
                console.log(`___________Search Results : ${user.num_results} USER FOUND___________\n`)
                            var i=0
                                    user.users.forEach(function(arr_users){
                            i++
                console.log('________________________________________'+
                            '\nUSER N° '+i+ 
                            '\n________________________________________'+
                            '\nUsername     : '+arr_users.username+
                            '\nName         : '+arr_users.full_name+
                            '\nUserID       : '+arr_users.pk+
                            '\nType Acc     : '+arr_users.is_private+
                            '\nFollowers    : '+arr_users.byline+
                            '\nFollowing?   : '+arr_users.friendship_status.following+
                            '\nSendReq?     : '+arr_users.friendship_status.outgoing_request+
                            '\nGetReq?      : '+arr_users.friendship_status.incoming_request+
                            '\nPic_Unknown  : '+arr_users.has_anonymous_profile_picture+
                            '\nurl_pic      : '+arr_users.profile_pic_url+
                            '\n________________________________________')
                
                        })
                            process.exit(-4)
                    })
                }
                else{
                    console.log('User '+argv.user+' not found.')  
                
                process.exit(-4)      
            }   
        }
    })
}
//user_map(argv.tosearch)
utoid(argv.user,argv.uid, (id)=>{
user_detail_info(id.response)
})
//username_info(argv.tosearch)   
//check_username(argv.tosearch)        
//getUserIDbyLogin(argv.tosearch)
//usersearch(argv.tosearch)
//user_to_id(argv.tosearch)