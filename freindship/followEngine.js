'use strict'


/*------------------------------Requires_Functions------------------------------*/

var common = require('../common/common_fn').igapi_common
var igapidb = require('../common/common_db').igapidb
var apirequest = require('../common/common_api_fn').ig_api_request
var api_i_request = require('../common/common_i_fn').ig_i_request
var validUrl = require('valid-url');
var igapi = new apirequest()
var ig_i_api = new api_i_request()

/*------------------------------Arguments Definitions------------------------------*/

var argv = require('yargs')
    .usage('Usage: $0 -user [username] -make [follow/unfollow]')
    .option('user',{
        alias : 'u',
        describe : 'select the source user from database'
    })
    .option('make',{
        alias : 'm',
        describe : 'make or remove freindship from target profile \n-follow \n-unfollow',
        default : 'follow'
    })
    .demand(['user','make'])
    .option('categorie',{
        alias:'c',
        describe:'the categorie of get thems.',
        default : null
    })
    .demandOption(['categorie'], 'Please insert categorie arguments to insert it to database')
    .argv;

    var _seconds=1
    function print_time(){
        //console.log("Elapsed Time : "+_seconds+" seconds")
        _seconds++
        setTimeout(print_time,1000)
    }
    setTimeout(print_time,1000)

/*------------------------------follow unfollow freindship function------------------------------*/

    let follow_unfollow = function (make, source_user, user_id , callback) {
        igapidb.execute("SELECT * FROM `loginfo` WHERE `login`='"+source_user+"'",(err, result) => {  
            if(err){
                console.log('\x1b[91m%s\x1b[0m','[-] Error Select from : '+err)
            }else{
                if (result.length > 0){
                    ig_i_api.updateCookies(result[0].insta_cookies)
                        let uuid = common.genUUID(true)
                        var cookie = ig_i_api.parseCookie()
                        var data = JSON.stringify({
                            '_uuid': common.genUUID(true),
                            '_uid': result[0].insta_user_id,
                            'user_id': user_id,
                            '_csrftoken': result[0].insta_csrftoken
                        })//end of data generating with Signature.
                if (make == 'follow'){
                    try{
                        return ig_i_api.sendRequest('friendships/create/' + user_id + '/', common.generateSignature(data),   
                        (follow) => {
                            if (follow !== undefined && follow != '<!DOCTYPE html>'){
                            var jstatus = JSON.parse(follow)
                            if (callback !== undefined && callback != null){
                            callback(jstatus)
                            }
                            }
                        })//end sendRequest Callback Follow
                    }catch(err){
                        console.log('\x1b[91m%s\x1b[0m','[-]Something Wrong Error in Follow : '+err)
                    }//end catching error 1
                }else if (make == 'unfollow'){
                    try{
                        return ig_i_api.sendRequest('friendships/destroy/' + user_id + '/', common.generateSignature(data),   
                        (unfollow) => {
                            var jstatus = JSON.parse(unfollow)
                            callback(jstatus)
                        })//end sendRequest Callback Follow
                    }catch(err){
                        console.log('\x1b[91m%s\x1b[0m','[-] Something Wrong Error in Unfollow : '+err)
                    }//end catching error 2
                    }else{
                        console.log('\x1b[91m%s\x1b[0m', '[-] '+make+'invalid make please select (follow of unfollow)')
                }//else of invalid argument Make.       
            }//end of selection is true
            else{
                console.log('User '+source_user+' not found.')  
            }
                    }   
        })//end selection user from database
    }//end function follow & unfollow

/*------------------------------Process Follow------------------------------*/


    function processfollow(source_user,category,resdata,index,callback){
        if (index < resdata.length){
            let  results = resdata[index]
            console.log('index : '+index+' | userid '+results.user_id+ ' | username : '+results.username)
            follow_unfollow('follow',source_user,results.user_id , (data)=>{
                try{
                    if (data != null && data !== undefined) {
                        if (data.status == 'ok'){
                            if (data.friendship_status.following == true && data.friendship_status.followed_by == false || data.friendship_status.outgoing_request == true){
                                var d = new Date();
                                console.log("following         : " + data.friendship_status.following + 
                                "\nfollowed_by       : " + data.friendship_status.followed_by+
                                "\noutgoing_request  : " + data.friendship_status.outgoing_request)
                                console.log('\x1b[92m%s\x1b[0m','[+] You Follow [username] : '+results.username+' [id] : '+results.user_id+' [time] : '+d+'')
                                igapidb.execute("UPDATE `following_tounf` SET `status`= 1 WHERE `user_id`='"+results.user_id+"'",(err,result) => {
                                    if (err){
                                        console.log('\x1b[91m%s\x1b[0m','[-] Error to update status : '+err)
                                        if (callback !== undefined) callback({status:'ok', dbstatus:'fail', result:data, dberr: err})
                                    }else if (callback !== undefined) callback({status:'ok', dbstatus:'ok', result:data})
                                })//end of excute UPDATE
                                igapidb.execute_escaped("INSERT INTO `follow` (`user_id`, `username`, `source_id`, `categorie`) VALUES (?,?,?,?)",
                                                [results.user_id,results.username,results.source_id,category],
                                    (err, result) => {
                                        if(err){
                                            console.log('\x1b[91m%s\x1b[0m','[-] Error to insert into to follow : '+err)
                                        }//end of if (error)
                                })//end of insert in database  
                            }else{
                                console.log('\x1b[93m%s\x1b[0m','[-] Error Follow Person Cause _ LIMIT')
                            }
                        }//end of condtion if follow confirmed sucess. 
                        else if (data.message == 'Please wait a few minutes before you try again.'){
                            console.log('\x1b[91m%s\x1b[0m','[!] Warning limit Follow problem.')
                            console.log('\x1b[91m%s\x1b[0m','[-] '+data.message)
                            process.exit(-1)
                        }//limit waiting few minute
                        else{
                            console.log('\x1b[91m%s\x1b[0m',"[-] "+data.feedback_title+"\n[-__CAUSE OF BLOCKING__-]\n"+data.feedback_message)
                            process.exit(-1)
                        }//else of blocked message feedback
                    }//if != null or != undefined
                }catch(err){
                console.log('error : '+err)
                }//catching error
            })//follow_results.
            //13000 | 17000
            setTimeout(function(){processfollow(source_user,category,resdata,index+1,callback)},Math.floor(Math.random()*(6000))+74000)//end of function settimeout,1H , 100FOLLOW  
            console.log('\x1b[93m%s\x1b[0m',"[~] Elapsed Time : "+_seconds+" seconds")
        }//if theres data in database to make process.
        else {
            console.log('\x1b[93m%s\x1b[0m',"[!] Processing Ended After : "+_seconds+" seconds")
        }//how minute to finish all the process.
    }//end of function process follow.


/*------------------------------Unfollow_Query------------------------------*/


    let follow = function(category, source_user, callback){
       igapidb.execute("SELECT * FROM `following_tounf` WHERE `categorie` = '"+category+"' AND `status` = 0",
        (err, result) => {  
            if(err){
                if (callback !== undefined) callback({status:'fail', error: err})
                    console.log('\x1b[91m%s\x1b[0m','[-] error select from following_tounf : '+err)
            }else{
                    console.log('\x1b[94m%s\x1b[0m','[*] start processing follow')
                    processfollow(source_user, category, result, 0, callback)
                }//end of else true
        })//end of follow_cbk 
    }//end of function query follow


/*------------------------------Process Unfollow------------------------------*/


    function processUnfollow(source_user,category,resdata,index,callback){
        if (index < resdata.length){
            let  results = resdata[index]
            console.log('index : '+index+' | userid '+results.user_id+ ' | username : '+results.username)
            follow_unfollow('unfollow',source_user,results.user_id , (data)=>{
                try{
                    if (data !== undefined && data != null){
                        var d = new Date();
                        if (data.status == 'ok'){
                            if (data.friendship_status.following == false || data.friendship_status.outgoing_request == false){
                                console.log("following         : " + data.friendship_status.following + 
                                        "\nfollowed_by       : " + data.friendship_status.followed_by+
                                        "\noutgoing_request  : " + data.friendship_status.outgoing_request)
                                console.log('\x1b[92m%s\x1b[0m','[+] You Unfollow [username] : '+results.username+' [id] : '+results.user_id+' [time] : '+d+'')
                                igapidb.execute("UPDATE `following_tounf` SET `status`= 2 WHERE `user_id`='"+results.user_id+"'",(err,result) => {
                                    if (err){
                                        console.log('\x1b[91m%s\x1b[0m','[-] Error to update status : '+err)
                                        if (callback !== undefined) callback({status:'ok', dbstatus:'fail', result:data, dberr: err})
                                    }else if (callback !== undefined) callback({status:'ok', dbstatus:'ok', result:data})
                                })//end of excute UPDATE
                                igapidb.execute_escaped("INSERT INTO `unfollow` (`user_id`, `username`, `source_id`, `categorie`) VALUES (?,?,?,?)",
                                [results.user_id,results.username,results.source_id,category],(err, result) => {  
                                    if(err){
                                        console.log('\x1b[91m%s\x1b[0m','[-] Error to insert into to unfollow : '+err)
                                    }//end of if (error)
                                })//end of insert in database  
                            }//if following ?
                            else{
                            console.log('\x1b[91m%s\x1b[0m','[-] You not Follow '+results.username)
                            }//message ur not follow this person.
                            }//success OK?    
                        else if (data.message == 'Please wait a few minutes before you try again.'){
                            console.log('\x1b[93m%s\x1b[0m','[!] Warning limit Unollow problem.')
                            console.log('\x1b[91m%s\x1b[0m','[-] '+data.message)   
                            process.exit(-1)
                        }//limit message.
                        else{
                            console.log('\x1b[91m%s\x1b[0m',"[-] "+data.feedback_title+"\n[-__CAUSE OF BLOCKING__-]\n"+data.feedback_message)
                            process.exit(-1)
                        }//blocked message.                       
                    }// data != null && undefined
                }catch(err){
                    console.log('error : '+err)
                }
            })//unfollow_results.   
            console.log('\x1b[93m%s\x1b[0m',"[~] Elapsed Time : "+_seconds+" seconds")
            setTimeout(function(){processUnfollow(source_user,category,resdata,index+1,callback)},Math.floor(Math.random()*(6000))+42000)//end of function settimeout,1H , 100FOLLOW  
        }// if theres data in data base.
        else {
            console.log('\x1b[93m%s\x1b[0m',"[!] Processing Ended After : "+_seconds+" seconds")
        }//termination of process cause data is finished.
    }//end of function process unfollow


/*------------------------------Unfollow_Query------------------------------*/


    let unfollow = function(category, source_user, callback){
       igapidb.execute("SELECT * FROM `following_tounf` WHERE `categorie` = '"+category+"' AND `status` = 1 AND `is_private` = 0 ",
        (err, result) => {  
            if(err){
                if (callback !== undefined) callback({status:'fail', error: err})
                    console.log('\x1b[91m%s\x1b[0m','[-] error select from following_tounf : '+err)
            }else{
                console.log('\x1b[94m%s\x1b[0m','[*] start processing unfollow')
                processUnfollow(source_user, category, result, 0, callback)
            }//end of else true
        })//end of unfollow_cbk 
    }//end of query_unfollow

/*------------------------------Principal Call Functions With Args------------------------------*/

    if (argv.make == 'follow'){
        follow(argv.categorie, argv.user) //callfunction follow
    }//end if (argv.react == follow)
    else if (argv.make == 'unfollow'){
        unfollow(argv.categorie, argv.user)
    }//process unfollow


/*------------------------------Status Insertion in database------------------------------
    0 : no freindship maked
    1 : follow status
    2 : unfollow status
*/
