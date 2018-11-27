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
    .usage('Usage: $0 -user [username] -select [followers|followings] -uid [userid]')
    .option('user',{
        alias : 'u',
        describe : 'select the source user from database'
    })
    .option('select',{
        alias : 's',
        describe : 'select all followings or followers from target profile \n-followers \n-followings'
    })
    .option('uid',{
        alias : 'i',
        describe : 'the target user_id'
    })
    .demand(['user','select','uid'])
    .option('timeout',{
        alias :'t',
        describe :'set your time in ms',
        default : 0,
        type : 'array'
    })
    .option('categorie',{
        alias:'c',
        describe:'the categories of posts who want to liked them',
        default : null
    })
    .demandOption(['categorie'], 'Please insert categorie arguments to insert it to database')
    .argv;
    
    var status = 0 //init status, DEFAULT.
    var id = 0 //init id.

    let user_to_id = function(username, callback){
        igapidb.execute("SELECT * FROM `loginfo` WHERE `login`='"+argv.user+"'",(err, result) => {  
            if(err){
                process.exit(-1)
            }else{
                if (result.length > 0){
                    ig_i_api.updateCookies(result[0].insta_cookies)
                    var endpoint = 'users/'+username+'/usernameinfo/'
                    return ig_i_api.sendRequest('users/'+username+'/usernameinfo/', null,
                    (user_to_id) => {
                                //console.log(data)
                        var userid = JSON.parse(user_to_id)
                        if (userid.status == 'ok'){
                            callback({
                                success: true,
                                response: userid.user.pk
                            })                      
                        }else{
                            callback({
                                success: false,
                                response: '[-] cannot get username from userid `'+userid.message+'`'
                            })//end affectation of values to callback
                        }
                    })//end of callback sendRequest.
                }else{
                    console.log(-1)
                }//end of else all thing Good
            }//end else selection true.
        })//end of selection user from database
    }//end of module
    /*________******************************__________*/
    let followings_followers = function (userid,maxid=null,ff_callback) {
        igapidb.execute("SELECT * FROM `loginfo` WHERE `login`='"+argv.user+"'",(err, result) => {  
            if(err){
                console.log('\x1b[91m%s\x1b[0m','[-] Error Select from : '+err)
                process.exit(-1)
            }else{
                if (result.length > 0){
                    ig_i_api.updateCookies(result[0].insta_cookies)
                    console.log('User '+argv.user+' Found ')
                if(argv.select == 'followings') {
                    try{
                        var endpoint = 'friendships/' + userid + '/following/'
                        var query = 
                        {
                            'ig_sig_key_version': common.SIG_KEY_VERSION,
                            'rank_token': userid+'_'+result[0].insta_csrftoken
                        }//end of query
                        if (maxid){
                            endpoint += '?max_id='+maxid}
                        return ig_i_api.sendRequest(endpoint, null,(Followings) => {
                                ff_callback(Followings)
                        })//end of sendRequest followings ..
                    }catch(err){
                    console.log('\x1b[91m%s\x1b[0m','[-] error wrong in module following '+err)
                    }//endcatching problem.
                }//end of select == 'followings'
                else if(argv.select == 'followers') {
                    try{
                        var endpoint = 'friendships/' + userid + '/followers/'
                        var query = 
                        {
                            'ig_sig_key_version': common.SIG_KEY_VERSION,
                            'rank_token': userid+'_'+result[0].insta_csrftoken
                        }
                        if (maxid){
                        endpoint += '?max_id='+maxid
                        }
                        return ig_i_api.sendRequest(endpoint, null,(followers) => {
                                ff_callback(followers)
                        })//end of request
                    }catch(err){
                        console.log('\x1b[91m%s\x1b[0m','[-] error wrong in module followers '+err)
                    }
                }else{
                        console.log('\x1b[91m%s\x1b[0m','[-] error select please choose(followings/followers)')
                        process.exit(-1)
                    }
                }else{
                    console.log(`${argv.user} NOT FOUND.`)  
                }
            }//else of mysql
        })//end of select login_user from database
    }//end of modules
    /*________******************************__________*/
let all_followings_followers = function (userid,maxid,ff_call2){
    followings_followers(userid,maxid,(data)=>{
        try{
            //setTimeout(function(){
                if (data == null && maxid !== null) {// Network issue
                       all_followings_followers(userid,maxid,ff_call2)
                }else{
                   var jsonres = JSON.parse(data)
                    jsonres.users.forEach(function(usersinfo){
                        id++
                        try{               
                            console.log('\n__________________________________________________'+
                                '\n ID        : '+id+
                                '\n__________________________________________________'+
                                '\nuserid     :'+usersinfo.pk+
                                '\nusername     : '+usersinfo.username+
                                '\nfull_name    : '+usersinfo.full_name+
                                '\nis_private   : '+usersinfo.is_private+
                                '\nUnknownPic : '+usersinfo.has_anonymous_profile_picture+
                                '\nProfilePic : '+usersinfo.profile_pic_url+
                                '\nuSource Userid : ' + userid +
                                '\n__________________________________________________'
                            )

                                igapidb.execute_escaped("INSERT INTO `following_tounf` (`user_id`, `username`, `is_private`, `source_id` ,`categorie` ,`status`) VALUES ( ?,?,?,?,?,?)",
                                                [usersinfo.pk,usersinfo.username,usersinfo.is_private,userid,argv.categorie,status],                                            
                                (err, result) => {
                                    if(err){console.log('failed insert '+err)}

                                })//endOfInsert IN DATABASE
                                //end userinfo not null
                            }catch(err){
                                console.log('\x1b[91m%s\x1b[0m','[-] error in foreach : '+err)
                                process.exit(-1)}
                        })//end of foreach
                        if (jsonres.next_max_id){
                            all_followings_followers(userid, jsonres.next_max_id, ff_call2) //reccursive function
                        }
                }
                
        //    }, Math.floor(Math.random() * argv.timeout[0] - argv.timeout[1]) + argv.timeout[1])  //end of timeout
        }catch(err){
            console.log(data)
            console.log('error : '+err)
            process.exit(0)
        }
    })//endof followings_followers
}//end_of module.
    /*________******************************__________*/
/*{CALL FUNCTIONS PP}*/
user_to_id(argv.uid, (callback)=>{
    try{
        all_followings_followers(callback.response)
    }catch(err){
        console.log('\x1b[91m%s\x1b[0m','catching2 uknown error : '+err)
    }//end of catching2 error
})//end of callback id_to_user
    


//RANDOM between 600ms & 1seconde ... (92K : RECIEVED --->  37K) 