'use strict'

var common = require('../common/common_fn').igapi_common
var igapidb = require('../common/common_db').igapidb
var apirequest = require('../common/common_api_fn').ig_api_request
var api_i_request = require('../common/common_i_fn').ig_i_request
var validUrl = require('valid-url');
var igapi = new apirequest()
var ig_i_api = new api_i_request()

var id = 0

/*Making Of Arguments Options */
var argv = require('yargs')
    .usage('Usage: $0 -user [username] -timeout [maxms minms] -locatid [locationid]')
    .option('user',{
        alias : 'u',
        describe : 'select the source user from database'
    })
    .option('locatid',{
        alias :'l',
        describe :'Source of location : \n-LocationID'
    })
    .demand(['user','locatid'])

    .option('timeout',{
        alias :'t',
        describe :'set your time in ms',
        default : 0,
        type : 'array'
    })

    .demandOption(['timeout'], 'Please provide timeout between MAX? MIN?')
    .argv;


let feedlocation = function (location_id , maxid=null , callback) {
    igapidb.execute("SELECT * FROM `loginfo` WHERE `login`='"+argv.user+"'",(err, result) => {  
        if(err){
            console.log('Error Select from : '+err)
            process.exit(-1)
        }else{
            if (result.length > 0){
                ig_i_api.updateCookies(result[0].insta_cookies)
                console.log('User '+argv.user+' Found ')
                var endpoint = 'feed/location/' + location_id
                if (maxid){
                    endpoint += '?max_id='+maxid
                }
                return ig_i_api.sendRequest(endpoint, null,(feedlocation) => {
                try{
                    callback({
                            success: true,
                            response: feedlocation
                        })//end of callback if true                     
                }catch(err){
                       callback({
                            success: false
                        })//end callback if false                      
                }
                    })//end request    
            }else{
                console.log('User '+argv.user+' not found.')  
            }
        }
     })
}

var id=0

let locationallfeed = function (location_id , maxid , call){
    feedlocation(location_id , maxid , (callback)=>{
        var result = JSON.parse(callback.response)
        setTimeout(function(){   
            console.log('N° OF RESULT'+result.num_results)
            try{
                result.items.forEach(function(items){
                    id++
                            if (result.num_results != null){
                                if (items.location.name='Msaken'){
                        console.log('\n_______________\nPOST N°'+id+'\n_______________'+
                                '\nnumber_of_comments : '+items.comment_count+
                                '\nnumber_of_likes : '+items.like_count+
                                '\nlocation name : '+items.location.name+
                                '\nlocation id : '+items.location.pk+
                                '\nmedia_type : '+items.media_type+
                                '\nmedia_id : '+items.id+
                                '\nusername : '+items.user.username+
                                '\nuserid : '+items.user.pk+
                                '\nfull_name : '+items.user.full_name+
                                '\nis_private : '+items.user.is_private+
                                '\nprofile picture : '+items.user.profile_pic_url+
                                '\nunknown picture : '+items.user.has_anonymous_profile_picture+
                                '\nfollowing ? : '+items.user.friendship_status.following)
                                }else{
                                    console.log('NOTHING')
                                }
                        }else{
                            process.exit(-1)
                        }

                })//end of forEach
            }catch(err){
                console.log('ERROR UNKNOWN : '+err)
                process.exit(-1)}
        }, Math.floor(Math.random() * argv.timeout[0] - argv.timeout[1]) + argv.timeout[1])//end function setTimeout
        if (result.next_max_id)
            locationallfeed(location_id , result.next_max_id , call)
    })//end of feedlocation
}//end of module



    locationallfeed(argv.locatid)

    //SOUSSE LOCATION ID 997036285