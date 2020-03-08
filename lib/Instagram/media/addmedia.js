'use strict'

var common = require('../common/common_fn').igapi_common
var igapidb = require('../common/common_db').igapidb
var apirequest = require('../common/common_api_fn').ig_api_request
var api_i_request = require('../common/common_i_fn').ig_i_request
var validUrl = require('valid-url');
var igapi = new apirequest()
var ig_i_api = new api_i_request()

/*Making Of Arguments Options */
var argv = require('yargs')
    .usage('Usage: $0 -user [username] -src [likers/comments] -caption [url / id]')
.option('user',{
        alias : 'u',
        describe : 'select the source user from database'
    })
    .option('src',{
        alias : 'S',
        describe : 'chem of file'
    })
    .option('caption',{
        alias :'c',
        describe :'Description of media to post'
    })
    .demand(['user','src','caption'])
    
    .argv;

var post_photo = function(picture , caption ,local , upload_id=null ){

igapidb.execute("SELECT * FROM `loginfo` WHERE `login`='"+argv.user+"'",(err, result) => {  

    if(err){
        console.log('Error Select from : '+err)
        process.exit(-1)
    }else{
        if (result.length > 0){
            ig_i_api.updateCookies(result[0].insta_cookies)
            console.log('User '+argv.user+' Found ')
            let uuid = common.genUUID(true)
            let upload_id = new Date().getTime();
            var data = JSON.stringify({
            		'device_id' : result[0].android_ver,           		
            	    '_uuid': uuid,
       		        '_uid':   result[0].insta_user_id,
      	            'caption' : caption,
                    'photo' : picture,
       	            'device_timestamp' : new Date().getTime(),
                    '_csrftoken': result[0].insta_csrftoken

                    })
			var endpoint = 'upload/photo/'

                ig_i_api.sendRequest(endpoint, common.generateSignature(data),
                    (post_photo) => {
                    console.log(post_photo)
                    })
                }
                else{
                    console.log('User '+argv.user+' not found.')  
                
                process.exit(-4)      
            }   
        }
    })
}
post_photo(argv.src,argv.caption)