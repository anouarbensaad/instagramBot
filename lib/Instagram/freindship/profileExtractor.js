'use strict'

var common = require('../common/common_fn').igapi_common
var validUrl = require('valid-url');
var InstaApiRequest = require('../common/InstaApifunctions')
var Instaifunctions = require('../common/Instaifunctions')
var Instaifunctions = new Instaifunctions()
var InstaApiRequest = new InstaApiRequest()

    var status = 0 //init status, DEFAULT.
    var id = 0 //init id.

    class ProfileExtractor {

        user_to_id(username, callback){
            var endpoint = 'users/'+username+'/usernameinfo/'
            return Instaifunctions.sendRequest(endpoint, null,
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
        }//end of selection user from database


        getFollowings(userid,maxid = null, callback) {
                var endpoint = 'friendships/' + userid + '/following/?'
                Instaifunctions.sendRequest(endpoint, null,
                    (data) =>
                    callback(data)
                )
        }

        getfollowers(userid,maxid = null, callback) {
            var endpoint = 'friendships/' + userid + '/followers/'
            Instaifunctions.sendRequest(endpoint, null,
            (data) =>
            callback(data)
            )
        }

        getAllfollowings(userid,maxid,callback){
            this.getfollowings(userid,maxid,data=>{
                if (data == null && maxid !== null) {// Network issue
                    this.getAllfollowings(userid,maxid,callback)
                }else{
                    var jsonres = JSON.parse(data)
                    jsonres.users.forEach(function(usersinfo){
                        id++
                    })
                }
                if (jsonres.next_max_id){
                    this.getAllfollowings(userid, jsonres.next_max_id, callback) //reccursive function
                }
            })
        }

        getAllfollowers(userid,maxid,callback){
            this.getfollowers(userid,maxid,data=>{
                if (data == null && maxid !== null) {// Network issue
                    getAllfollowers(userid,maxid,callback)
                }else{
                    var jsonres = JSON.parse(data)
                    jsonres.users.forEach(function(usersinfo){
                        id++
                    })
                }
                if (jsonres.next_max_id){
                    getAllfollowers(userid, jsonres.next_max_id, callback) //reccursive function
                }
            })
        }
}

module.exports = ProfileExtractor
