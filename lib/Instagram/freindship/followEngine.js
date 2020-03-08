'use strict'

var common = require('../common/common_fn').igapi_common
var igapidb = require('../common/common_db').igapidb
var InstaApiRequest = require('../common/InstaApifunctions')
var Instaifunctions = require('../common/Instaifunctions')
var InstaAuth = require('../accounts/instaAuth')
var validUrl = require('valid-url');

var Instaifunctions = new Instaifunctions()
var InstaApiRequest = new InstaApiRequest()


class FollowEngine {
    unfollow(userid,userId, callback) {
        var cookie = Instaifunctions.parseCookie()
        var data = JSON.stringify({
            '_uuid': common.genUUID(true),
            '_uid': userid,
            'user_id': userId,
            '_csrftoken': cookie.csrftoken
        })
        return Instaifunctions.sendRequest('friendships/destroy/' + userId + '/', common.generateSignature(data),
            (data) => {

                callback(data)

            })
    }

    follow(userid,userId, callback) {
        var cookie = Instaifunctions.parseCookie()
        var data = JSON.stringify({
            '_uuid': common.genUUID(true),
            '_uid': userid,
            'user_id': userId,
            '_csrftoken': cookie.csrftoken
        })
        return Instaifunctions.sendRequest('friendships/create/' + userId + '/', common.generateSignature(data),
            (data) => {

                callback(data)

            })
    }
}
module.exports = FollowEngine