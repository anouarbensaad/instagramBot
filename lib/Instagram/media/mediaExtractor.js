'use strict'

var common = require('../common/common_fn').igapi_common
var validUrl = require('valid-url');
var InstaApifunctions = require('../common/InstaApifunctions')
var Instaifunctions = require('../common/Instaifunctions')
var Instaifunctions = new Instaifunctions()
var InstaApifunctions = new InstaApifunctions()

    var status = 0 //init status, DEFAULT.
    var id = 0 //init id.

    class MediaExtractor {

        mediaLikers(url, callback) {
            var query = {
                'ig_sig_key_version': common.SIG_KEY_VERSION,
            }
            InstaApifunctions.getMedia_id(url,(data)  => {
                var endpoint = 'media/' + data.response + '/likers/'
                Instaifunctions.sendRequest(endpoint, null,
                    (data) => {
                        callback({
                        success: true,
                        response: data
                    })
                    })
            })

        }

        mediaComments(url,maxid = null, callback) {
            var query = {
                'ig_sig_key_version': common.SIG_KEY_VERSION,
            }
            InstaApifunctions.getMedia_id(url,(data)  => {
            var endpoint = 'media/' + data.response + '/comments/'
            if (maxid){
                endpoint += '?max_id='+maxid
            }
                Instaifunctions.sendRequest(endpoint, null,
                    (data) => {
                        callback({
                            success: true,
                            response: data
                        })
                    })
            })
        }

        mediaAllComments(url,maxid,callback){
            this.mediaComments(url,maxid,data=>{
                if (data == null && maxid !== null) {// Network issue
                    this.mediaAllComments(url,maxid,callback)
                }else{
                    var jsonres = data
                }
                if (jsonres.next_max_id){
                    this.mediaAllComments(url, jsonres.next_max_id, callback) //reccursive function
                }
            })
        }
}

module.exports = MediaExtractor
