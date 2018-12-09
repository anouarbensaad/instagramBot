'use strict'

var common = require('../common/common_fn').igapi_common
var igapidb = require('../common/common_db').igapidb
var apirequest = require('../common/common_api_fn').ig_api_request
var api_i_request = require('../common/common_i_fn').ig_i_request
var validUrl = require('valid-url');
var igapi = new apirequest()
var ig_i_api = new api_i_request()

var id = 0
var argv = require('yargs')
    .usage('Usage: $0 -user [username] -src [url / id]')
    .option('user',{
        alias : 'u',
        describe : 'select the source user from database'
    })
    .option('src',{
        alias :'S',
        describe :'Source of media there is two type of source \n-URL \n-MediaID'
    })
    .option('op',{
        alias : 'o',
        describe :'choose option \n-delete \n-post',
        default : 'post'
    })
    .demand(['user','op','src'])
    .option('comment',{
        alias : 'c',
        describe : 'add you comment',
        default : null
    })
    .option('comid',{
        alias : 'i',
        describe :'put the comment id',
        default : null
    })
  .demandOption(['comid', 'comment'], 'if option = delete , comment , if option = post comid')
    .argv;

var postcomment = function(media_id, comment_text) {
igapidb.execute("SELECT * FROM `loginfo` WHERE `login`='"+argv.user+"'",(err, result) => {  
        if(err){
            console.log('Error Select from : '+err)
            process.exit(-1)
        }else{
                if (result.length > 0){
                    /*DB CHECK FOR USER*/    
                        ig_i_api.updateCookies(result[0].insta_cookies)
                        console.log('User '+argv.user+' Found ')
                        //DATA TO SEND
        let uuid = common.genUUID(true)
        var cookie = ig_i_api.parseCookie()
        var data = JSON.stringify({
            '_uuid': uuid,
            '_uid': result[0].insta_user_id,
            'comment_text': comment_text,
            'media_id': media_id,
            '_csrftoken': result[0].insta_csrftoken})
        var endpoint = 'media/'+media_id+'/comment/'
        return ig_i_api.sendRequest(endpoint, common.generateSignature(data),
            (data) => {
            var res_data = JSON.parse(data)
            //    console.log(res_data)
                    console.log('my comment id : '+res_data.comment.user.pk+
                        '\n media_id : '+res_data.comment.user.media_id+
                        '\n comment_text : '+res_data.comment.user.text+
                        '\n created_at : '+res_data.comment.user.created_at)
            })
                }else{
                    console.log('User '+argv.user+' not found.')  
                }
                process.exit(-4)      
        }
    })
}
var removecomment = function(media_id, comment_id){
    igapidb.execute("SELECT * FROM `loginfo` WHERE `login`='"+argv.user+"'",(err, result) => {  

        if(err){
            console.log('Error Select from : '+err)
            process.exit(-1)
        }else{
                if (result.length > 0){
                    /*DB CHECK FOR USER*/    
                        ig_i_api.updateCookies(result[0].insta_cookies)
                        console.log('User '+argv.user+' Found ')
                        //DATA TO SEND
        let uuid = common.genUUID(true)
        var cookie = ig_i_api.parseCookie()
        var data = JSON.stringify({
            '_uuid': uuid,
            '_uid': result[0].insta_user_id,
            'comment_id': comment_id,
            'media_id': media_id,
            '_csrftoken': result[0].insta_csrftoken
        })
        var endpoint = 'media/'+media_id+'/comment/'+comment_id+'/delete/'
        return ig_i_api.sendRequest(endpoint, common.generateSignature(data),
            (data) => {
            var res_data = JSON.parse(data)
            //    console.log(res_data)
                console.log(res_data)
            })

                }else{
                    console.log('User '+argv.user+' not found.')  
                }
                process.exit(-4)      
        }
    })
}
if (argv.op == 'post'){
    if (validUrl.isUri(argv.src)){
        igapi.getMedia_id(argv.src,
        (urltoid)=>{
            postcomment(urltoid.response , argv.comment)
        })
    }
    else{
            postcomment(argv.src,argv.comment)  
    }
}else if (argv.op == 'delete'){
    if (validUrl.isUri(argv.src)){
        igapi.getMedia_id(argv.src,
        (urltoid)=>{
            removecomment(urltoid.response , argv.comid)
        })
    }
    else{
            postcomment(argv.src,argv.comid)  
    }
}else{
    console.log('error option | post , remove');
        process.exit(-1)
}