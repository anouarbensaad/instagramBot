'use strict'

var common = require('../common/common_fn').igapi_common
var igapidb = require('../common/common_db').igapidb
var apirequest = require('../common/common_api_fn').ig_api_request
var api_i_request = require('../common/common_i_fn').ig_i_request
var colors = require('colors')
var validUrl = require('valid-url');
var igapi = new apirequest()
var ig_i_api = new api_i_request()

var id = 0

/*Making Of Arguments Options */
var argv = require('yargs')
    .usage('Usage: $0 -user [username] -select [likers/comments] -src [url / id]')
    .option('user',{
        alias : 'u',
        describe : 'select the source user from database'
    })
    .option('select',{
        alias : 's',
        describe : 'select all comments or likers from target media \n-likers \n-comments'
    })
    .option('src',{
        alias :'S',
        describe :'Source of media there is two type of source \n-URL \n-MediaID'
    })
    .demand(['user','select','src'])
    .option('get',{
        alias :'g',
        describe :'get all comments or person tagged',
        default : 'all'
    })
    .option('timeout',{
        alias :'t',
        describe :'set your time in ms',
        default : 0,
        type : 'array'
    })
    
    .demandOption(['get','timeout'], 'Please provide get tagged or all picture default is all , and timeout between MAX? MIN?')
    .argv;

var _seconds=1
function print_time(){
    //console.log("Elapsed Time : "+_seconds+" seconds")
    _seconds++
    setTimeout(print_time,1000)
}
setTimeout(print_time,1000)


let mediaLikers = function (media_id) {
    igapidb.execute("SELECT * FROM `loginfo` WHERE `login`='"+argv.user+"'",(err, result) => {  
        if(err){
            console.log('Error Select from : '+err)
        }else{
            if (result.length > 0){
                ig_i_api.updateCookies(result[0].insta_cookies)
                console.log('User '+argv.user+' Found '.green)
                var endpoint = 'media/' + media_id + '/likers/'
                return ig_i_api.sendRequest(endpoint, null,(mediaLikers) => {
                    var res = JSON.parse(mediaLikers)
                    if (res.status == 'ok'){
                        var id = 0
                            res.users.forEach(function(users){
                            id++
                            console.log('\nN°        : '+id+ ' / ' +res.user_count+
                                '\nUserID    : '+users.pk+
                                '\nUserName  : '+users.username+
                                '\nFullname  : '+users.full_name+
                                '\nIs_Private: '+users.is_private+
                                '\nProfilePic: '+users.profile_pic_url
                                )
                            igapidb.execute_escaped("INSERT INTO `likersinfo` (`user_id`, `username`, `full_name`, `is_private`, `profile_pic_url`) VALUES (?,?,?,?,?)",
                            [users.pk , users.username,users.full_name,users.is_private,users.profile_pic_url],
                            (err, result) => {
                                if(err){
                                    console.log(colors.red.underline('failed insert '+err))
                                }//end if err
                          })//end of excute database
                            })//end forEach Boucle
                    }//if status OK
                })//end request
            }else{
                console.log(colors.red.underline('User '+argv.user+' not found.'))  
            }
        }//else of mysql true
     })//end of excute mysql
    }//end module

    let mediaComments = function (media_id,maxid=null,callback) {
    igapidb.execute("SELECT * FROM `loginfo` WHERE `login`='"+argv.user+"'",(err, result) => {  
        if(err){
            console.log('Error Select from : '+err)
        }else{
            if (result.length > 0){
                ig_i_api.updateCookies(result[0].insta_cookies)
        var endpoint = 'media/' + media_id + '/comments/'
        var query = {
            'can_support_threading': 'true'
        }//end query
            if (maxid){
                endpoint += '?max_id='+maxid
            }//end max_id
            return ig_i_api.sendRequest(endpoint,null,
            (response) =>{
                callback(response) 
            })//end request
            }else{
                console.log('User '+argv.user+' not found.')  
            }
        }//else if mysql true
    })//end function excute mysql
}//end of module


function media_allComments(media_id, maxid ,mediaCall2)
{
                mediaComments(media_id,maxid,
                (data) => {
                    try{
                        if (data == null && maxid !== null) {// Network issue
                            setTimeout(function(){media_allComments(media_id,maxid,mediaCall2)},Math.floor(Math.random()*(250))+150)
                            console.log('\x1b[93m%s\x1b[0m',"[~] Elapsed Time : "+_seconds+" seconds")
                        }else{
                            if (data !== undefined){
                //    setTimeout(function() {
                            var jsonres = JSON.parse(data)
                            jsonres.comments.forEach(function(mediaComments){
                                            id++
                                        console.log('\n__________________________________________________'+
                                        '\n ID        : '+id+' / '+jsonres.comment_count+
                                        '\n__________________________________________________'+
                                        '\ncommentid  : '+mediaComments.pk+
                                        '\nUserID     : '+mediaComments.user_id+
                                        '\nLikedCount : '+mediaComments.comment_like_count+
                                        '\nUsername   : '+mediaComments.user.username+
                                        '\nName       : '+mediaComments.user.full_name+
                                        '\nis_Private : '+mediaComments.user.is_private+
                                        '\nProfilePic : '+mediaComments.user.profile_pic_url+
                                        '\n__________________________________________________'
                                        )

                            igapidb.execute_escaped("INSERT INTO `checkcomments` (`comment_id`, `tagged_person`, `taggedby`, `comment_text`) VALUES (?,?,?,?)",
                            [mediaComments.pk , 'tagged' ,mediaComments.user.username , mediaComments.text],                                            
                            (err, result) => {
                                if(err){console.log('failed insert '+err)}
                            })
                            //endOfInsert IN DATABASE
                            })//end forEach boucle
                            
                                //Reccursive Function
                                if (jsonres.next_max_id){
                                    if (jsonres.next_max_id != null){
                                    media_allComments(media_id, jsonres.next_max_id, mediaCall2)
                                }
                                }
                            }//if data =# undefined
                            }
                    }catch(err){
                        console.log('err : '+err)
                    }
                //},Math.floor(Math.random() * argv.timeout[0] - argv.timeout[1]) + argv.timeout[1]) //end of function settimeout, random time between 250ms & 4000 ms     
            })
            }//
//end of module
/*{CALL FUNCTIONS PP}*/
    if (argv.select == 'likers'){
        if (validUrl.isUri(argv.src)){
            igapi.getMedia_id(argv.src,(urltoid)=>{
                mediaLikers(urltoid.response)
            })
        }
        else{
            mediaLikers(argv.src)  
        }
    }else if (argv.select == 'comments'){
        if (validUrl.isUri(argv.src)){
            igapi.getMedia_id(argv.src,(urltoid)=>{
                media_allComments(urltoid.response)
            })
        }
        else{
            media_allComments(argv.src)  
        }
    }
    else{
        console.log('ERROR SELECT _(likers/comments)')
    }


        //RANDOM TIMEOUT Between 250ms &  500ms == 10K IN : 07:08:21
        //RANDOM TIMEOUT Between 500ms & 1500ms == 10K IN : 12:30:59
        //RANDOM TIMEOUT Between 1000ms & 4000ms== 1K  IN : 02:44:24


        //34 662 | 36606 =~ 2000 PERSONNE PERDUE
        //57 250 | 59720 =~ 3000 PERSONNE PERDUE