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
    .usage('Usage: $0 -u [user] -i [uid] ')
    .option('user',{
        alias:'u',
        describe:'select the source user from database'
    })
    .demand(['user'])
    .option('get', {
        alias: 'g',
        default: 'max',
        describe: 'this optionally argument who select max posts or all posts from wall of user target'
    })
    .option('type', {
        alias: 't',
        default: 'all',
        describe: 'this optionally argument who select type of media \n-photo \n-video \n-carousel \n-all'
    })
    .option('categorie',{
        alias:'c',
        describe:'the categories of posts who want to liked them',
        default : null
    })
    .demandOption(['get', 'type' , 'categorie'], 'Please provide both run and path arguments to work with this tool')
    .argv;
    var id = 0 //id
    var status = 0 //status of insert in database
    /*________******************************__________*/    
    function escape_string(str)
    {
    return str.replace(/['\"]/g, "");
    }
    /*________******************************__________*/
    let userfeed = function(userName, categorie){
        igapidb.execute("SELECT * FROM `loginfo` WHERE `login`='"+argv.user+"'",(err, result) => {  
            if(err){
                console.log('\x1b[91m%s\x1b[0m','[-] error select login : '+err)
                process.exit(-1)
            }else{
                if (result.length > 0){
                    /*DB CHECK FOR USER*/    
                    ig_i_api.updateCookies(result[0].insta_cookies)
                    console.log('\x1b[92m%s\x1b[0m','[+] user '+argv.user+' found ')
                    //DATA TO SEND
                    var endpoint = 'feed/user/' + userName + '/'
                    ig_i_api.sendRequest(endpoint, null,(response)=>{
                        var feed = JSON.parse(response)
                        feed.items.forEach(function(items){
                            id++
                            try{
                                if (argv.type == 'photo'){
                                    if (items.media_type == 1){
                                        console.log('\n__________________________________________________'+
                                                    '\npost n° : '+id+
                                                    '\n__________________________________________________'+
                                                    '\nmedia_id : '+items.id+
                                                    '\nmedia_type : '+items.media_type+
                                                    '\ncomment_count : '+items.comment_count+
                                                    '\nuser_id : '+items.user.pk+
                                                    '\nusername : '+items.user.username+
                                                    '\nfull_name : '+items.user.full_name+
                                                    '\nis_private : '+items.user.is_private+
                                                    '\nprofile_picture : '+items.user.profile_pic_url+
                                                    '\nlike_count : '+items.like_count+
                                                    '\ncaption_text : '+items.caption.text.toString()+
                                                    '\ncreated_at : '+items.caption.created_at+
                                                    '\ncategorie : '+argv.categorie+
                                                    '\n__________________________________________________'
                                                    )
                                    }//end items.media_type ==1
                                }//endof type ==photo
                                else if (argv.type == 'video'){
                                    if (items.media_type == 2){
                                        console.log('\n__________________________________________________'+
                                                    '\npost n° : '+id+
                                                    '\n__________________________________________________'+
                                                    '\nmedia_id : '+items.id+
                                                    '\nmedia_type : '+items.media_type+
                                                    '\ncomment_count : '+items.comment_count+
                                                    '\nuser_id : '+items.user.pk+
                                                    '\nusername : '+items.user.username+
                                                    '\nfull_name : '+items.user.full_name+
                                                    '\nis_private : '+items.user.is_private+
                                                    '\nprofile_picture : '+items.user.profile_pic_url+
                                                    '\nlike_count : '+items.like_count+
                                                    '\ncaption_text : '+items.caption.text.toString()+
                                                    '\ncreated_at : '+items.caption.created_at+
                                                    '\ncategorie : '+argv.categorie+
                                                    '\n__________________________________________________'
                                                    )
                                    }//end items.media_type ==2
                                }//end of type video
                                else if (argv.type == 'carousel'){
                                    if (items.media_type == 8){
                                        console.log('\n__________________________________________________'+
                                                    '\npost n° : '+id+
                                                    '\n__________________________________________________'+
                                                    '\nmedia_id : '+items.id+
                                                    '\nmedia_type : '+items.media_type+
                                                    '\ncomment_count : '+items.comment_count+
                                                    '\nuser_id : '+items.user.pk+
                                                    '\nusername : '+items.user.username+
                                                    '\nfull_name : '+items.user.full_name+
                                                    '\nis_private : '+items.user.is_private+
                                                    '\nprofile_picture : '+items.user.profile_pic_url+
                                                    '\nlike_count : '+items.like_count+
                                                    '\ncaption_text : '+items.caption.text.toString()+
                                                    '\ncreated_at : '+items.caption.created_at+
                                                    '\ncategorie : '+argv.categorie+
                                                    '\n__________________________________________________'
                                                    )
                                    }//end items.media_type ==8
                                }//end of type carousel                                
                                else if (argv.type == 'all'){
                                    console.log('\n__________________________________________________'+
                                                '\npost n° : '+id+
                                                '\n__________________________________________________'+
                                                '\nmedia_id : '+items.id+
                                                '\nmedia_type : '+items.media_type+
                                                '\ncomment_count : '+items.comment_count+
                                                '\nuser_id : '+items.user.pk+
                                                '\nusername : '+items.user.username+
                                                '\nfull_name : '+items.user.full_name+
                                                '\nis_private : '+items.user.is_private+
                                                '\nprofile_picture : '+items.user.profile_pic_url+
                                                '\nlike_count : '+items.like_count+
                                                '\ncaption_text : '+items.caption.text.toString()+
                                                '\ncreated_at : '+items.caption.created_at+
                                                '\ncategorie : '+argv.categorie+
                                                '\n__________________________________________________'
                                                )
                                }//end of type carousel   

                                igapidb.execute(("INSERT INTO `feed` (`media_id`, `username`, `likecount`, `comment_count`, `categorie`, `status`) VALUES ('"
                                                +items.id+"', '"+escape_string(items.user.username)+"', '"+items.like_count+"', '"+items.comment_count+"', '"+argv.categorie+"', '"+status+"');"),                                            
                                (err, result) => {
                                    if(err){console.log('\x1b[91m%s\x1b[0m','[-] failed insert into feed '+err)}
                                })
                            }catch(err){
                                console.log('\x1b[91m%s\x1b[0m','[-] catching unkown error : '+err)
                            }
                        })//end of forEach
                    })//end of sendRequest Callback
                //else NOT ERROR INSELECT DATABASE
                }else{
                    console.log('\x1b[91m%s\x1b[0m','[-] user '+argv.user+' not found.')  
                    process.exit(-4)
                }//end of else user notfound
            }//end of else database is true selecting
        })//database callback selection from user.
    }//end userfeed module.
    /*________******************************__________*/
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

    //{P.P}

    if (argv.get == 'max'){
        igapidb.execute("SELECT * FROM `following_tounf` WHERE `categorie` = '"+argv.categorie+"' AND `status` = 1 AND `is_private` = '0'",
        (err, result) => {  
            if(err){
                    console.log('\x1b[91m%s\x1b[0m','[-] error select from following_tounf : '+err)
            }else{
                console.log(result[0])
                user_to_id(result.user_id, (callback)=>{
                    try{
                        userfeed(callback.response)
                    }catch(err){
                        console.log('\x1b[91m%s\x1b[0m','catching2 uknown error : '+err)
                    }//end of catching2 error
                
                })//end of callback id_to_user
            }//end of argv.get
            })
        }
        

    //'\x1b[91m%s\x1b[0m',  : RED
    //'\x1b[92m%s\x1b[0m',  : GREEN
    //'\x1b[91m%s\x1b[0m',  : YELLOW