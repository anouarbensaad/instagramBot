var common = require('../common/common_fn').igapi_common
var igapidb = require('../common/common_db').igapidb
var apirequest = require('../common/common_api_fn').ig_api_request
var api_i_request = require('../common/common_i_fn').ig_i_request
var validUrl = require('valid-url');
var igapi = new apirequest()
var ig_i_api = new api_i_request()

var argv = require('yargs')
    .usage('Usage: $0 -user [username] -tosearch [search]')
    .demand(['user','tosearch'])
    .argv;

let getUserIDbyLogin = function(userName){

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
                console.log(
                            `                                  USER N° ${i} 
                            ________________________________________
                            Username     : ${arr_users.username}
                            Name         : ${arr_users.full_name}
                            UserID       : ${arr_users.pk}
                            Type Acc     : ${arr_users.is_private}
                            Followers    : ${arr_users.byline}
                            Following?   : ${arr_users.friendship_status.following}
                            SendReq?     : ${arr_users.friendship_status.outgoing_request}
                            GetReq?      : ${arr_users.friendship_status.incoming_request}
                            Pic_Unknown  : ${arr_users.has_anonymous_profile_picture}
                            url_pic     : ${arr_users.profile_pic_url}
                            ________________________________________`)
                
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


   
        
getUserIDbyLogin(argv.tosearch)