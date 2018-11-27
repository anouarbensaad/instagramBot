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
            var endpoint = 'location/search/?q='
                endpoint += encodeURIComponent(userName)
                ig_i_api.sendRequest(endpoint, null,
                    (getUserIDbyLogin) => {
                    user  = JSON.parse(getUserIDbyLogin)
                            var i=0
                        console.log(user)
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



