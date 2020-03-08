var common = require('./common_fn').igapi_common
var request = require('request')

let API_URL = 'https://api.instagram.com/'
let cookieJar = request.jar()

class InstaApiRequest {
    
    _sendRequest(endpoint, postData = null, callback) {
        if (postData != null) {
            request.post(
                    {
                    url: API_URL + endpoint,
                    jar: cookieJar,
                    form: postData
                    },
                function callback(err, response, body) {
                    if (err)
                        callback(null)
                    else
                        callback(body)})
        } else {
        
            request.get({
                    url: API_URL + endpoint,
                    jar: this.cookieJar
                },
                (err, response, body) => {
                    if (err)
                        callback(null)
                    else {
                        callback(body)
                    }
                }
            )
        }
    }

    getMedia_id(instaUrl, callback) {
            var endpoint = 'oembed/?callback=&url='
            
            endpoint += encodeURIComponent(instaUrl)

            this._sendRequest(endpoint, null,
                (data) => {
                    try{
                        //console.log(data)
                        var omedia = JSON.parse(data)
                        var mediaid=omedia.media_id
                        callback({
                            success: true,
                            response: mediaid
                        })                      
                    }catch (err) {

                        callback({
                            success: false,
                            response: 'Cannot get media_id for this URL `'+instaUrl+'`' 
                        })
                    }
                }
                
            )
    }

    getMedia_pic(instaUrl, callback) {
            var endpoint = 'oembed/?callback=&url='
            
            endpoint += encodeURIComponent(instaUrl)

            _sendRequest(endpoint, null,
                (data) => {
                    try{
                        //console.log(data)
                        var omedia = JSON.parse(data)
                        var mediapic=omedia.thumbnail_url
                        callback({
                            success: true,
                            response: {'media_pic': mediapic}
                        })                      
                    }catch (err) {

                        callback({
                            success: false,
                            response: 'Cannot get media_picture for this URL `'+instaUrl+'`' 
                        })
                    }
                }
                
            )
    }
}

module.exports = InstaApiRequest