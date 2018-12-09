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
    .usage('Usage: $0 -user [username] -react [like | unlike] -comid [comment_id]')
    .option('user',{
        alias : 'u',
        describe : 'select the source user from database'
    })
    .option('react',{
        alias : 'r',
        describe : 'react to comment like or unlike from target media \n-like \n-unlike'
    })
    .option('comid',{
        alias : 'i',
        describe :'put the comment id'
    })
    .demand(['user','react','comid'])
    .argv;



var likeCom = function(comment_id) {

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
            '_csrftoken': result[0].insta_csrftoken
        })
        var endpoint = 'media/'+comment_id+'/comment_like/'
        return ig_i_api.sendRequest(endpoint, common.generateSignature(data),
            (result_like) => {
            var res_data = JSON.parse(result_like)
            //    console.log(res_data)  
                if (res_data.status == ok){
                    console.log('successefully comment liked  '+comment_id)
                }else{
                    console.log('failed to like comment '+comment_id)
                }
            })
                }else{
                    console.log('User '+argv.user+' not found.')  
                }
                process.exit(-4)      
        }
    })
}

var unlikeCom = function(comment_id) {
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
            '_csrftoken': result[0].insta_csrftoken
        })
        var endpoint = 'media/'+comment_id+'/comment_unlike/'
        return ig_i_api.sendRequest(endpoint, common.generateSignature(data),
            (result_cunlike) => {
            var res_data = JSON.parse(result_cunlike)
            //    console.log(res_data)
                if (res_data.status == 'ok'){
                    console.log('successefully unlike comment '+comment_id)
                }else
                    console.log('failed unlike comment '+comment_id)
            })
                }else{
                    console.log('User '+argv.user+' not found.')  
                }
                process.exit(-4)      
        }
    })
}

if (argv.react == 'like'){
likeCom(argv.comid)
}else if (argv.react == 'unlike'){
    unlikeCom(argv.comid)
}else{
    console.log('REACT INVALID PLEASE CHOOSE, like | unlike ')
}