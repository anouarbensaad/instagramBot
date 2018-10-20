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
    .usage('Usage: $0 -user [username] -react [like/unlike] -src [url / id]')
    .option('user',{
        alias : 'u',
        describe : 'select the source user from database'
    })
    .option('react',{
        alias : 'r',
        describe : 'react to media like or unlike from target media \n,-like \n-unlike'
    })
    .demand(['user','react'])
    .argv;

 let like_unlike = function (media_id , cbk_like , cbk_unlike) {  
    igapidb.execute("SELECT * FROM `loginfo` WHERE `login`='"+argv.user+"'",(err, result) => {  
        if(err){
            console.log('Error Select from : '+err)
            process.exit(-1)
        }else{
                if (result.length > 0){
                        ig_i_api.updateCookies(result[0].insta_cookies)
                        console.log('User '+argv.user+' Found ')
                        //data_tosend___in endoints
                           let uuid = common.genUUID(true)
                           var cookie = ig_i_api.parseCookie()
                           var data = JSON.stringify({
                            '_uuid': uuid,
                            '_uid':   result[0].insta_user_id,
                            'media_id': media_id,
                            '_csrftoken': result[0].insta_csrftoken
                           })//end data json stringify
                            if (argv.react == 'like'){
                                try{    
                                    return ig_i_api.sendRequest('media/' + media_id + '/like/', common.generateSignature(data),
                                    (Postlike) => {
                                            var jstatus = JSON.parse(Postlike)
                                                callback(jstatus)
                                           })//end of request callback_(like) =>
                                }catch(err){
                                    console.log('Something Wrong Error in liked : '+err)
                                }
                            }else if (argv.react == 'unlike'){
                                try{
                                    return ig_i_api.sendRequest('media/' + media_id + '/unlike/', common.generateSignature(data),   
                        
                                    (Unlike) => {

                                            var jstatus = JSON.parse(Unlike)
                                                cbk_unlike(jstatus)
                                        })//end of request callback_(Unlike) =>
                                }catch(err){
                                    console.log('Something Wrong Error in unliked : '+err)
                                }
                            }else{
                                console.log(`${argv.react} _INVALID REACTION ________ (like / unlike)`)
                            }
                        } 
                else{
                    console.log('User '+argv.user+' not found.')  
                }
                process.exit(-4)      
            }//else if select if user select is true
        })//end select excute database.
    }//end of modules.
/*TEST IF URL OR ID*/


//STATUS == 0 NOTHING
//STATUS == 1 LIKED STATUS
//STATUS == 2 UNLIKED STATUS
            
like_unlike(results.media_id , (cbk_like)=>{
    igapidb.execute("SELECT * FROM `feed` WHERE `categorie` = 'beats' AND `status` = 0",(err, result) => {  
        if(err){
            console.log('Error Select from : '+err)
            process.exit(-1)
        }else{
            result.forEach(function(results){
                if (results.cbk_like.status == 'ok'){
                    igapidb.execute("UPDATE `feed` SET `status`= 1",(err,result) => {
                        if (err){
                            console.log('Error UPDATE : '+err)
                        }//end of error
                    })//end of excute UPDATE
                    igapidb.execute(("INSERT INTO `postLike` (`media_id`, `username`) VALUES ('"
                                    +results.media_id+"', '"+results.username+"');"),(err, result) => {  
                        if(err){
                            console.log('Error Select from : '+err)
                            process.exit(-1)
                        }//end of if (error)
                    })//end of insert in database  
                }//end of condtion if like confirmed sucess.            
            })//end of forEach
        }//end of else true
    })//end of select from feed
}//end of like_cbk
,(cbk_unlike) =>{
igapidb.execute("SELECT * FROM `feed` WHERE `categorie` = 'beats' AND `status` = 1",(err, result) => {  
        if(err){
            console.log('Error Select from : '+err)
            process.exit(-1)
        }else{
            result.forEach(function(results){
                if (results.cbk_unlike.status == 'ok'){
                    igapidb.execute("UPDATE `feed` SET `status`= 2",(err,result) => {
                        if (err){
                            console.log('Error UPDATE : '+err)
                        }//end of error
                    })//end of excute UPDATE
                    igapidb.execute(("INSERT INTO `postLike` (`media_id`, `username`) VALUES ('"
                                    +results.media_id+"', '"+results.username+"');"),(err, result) => {  
                        if(err){
                            console.log('Error Select from : '+err)
                            process.exit(-1)
                        }//end of if (error)
                    })//end of insert in database  
                }//end of condtion if like confirmed sucess.            
            })//end of forEach
        }//end of else true
    })//end of select from feed
})//end of unlike_cbk and end of all module