const http = require('http')
var request = require('request')
const uuidv1 = require('uuid/v1')
const crypto = require('crypto')
const utf8 = require('utf8')
const fs = require('fs')
const date = require('date-and-time')
const querystring = require('querystring')

exports.igapi_common = new common_fn()
function common_fn(){
const self = {}
	self.IG_SIG_KEY = 'c1c7d84501d2f0df05c378f5efb9120909ecfb39dff5494aa361ec0deadb509a'
    self.SIG_KEY_VERSION = '4'

	self.generateSeed = function(username, password){
		return crypto.createHash('md5').update(utf8.encode(username)).update(utf8.encode(password)).digest('hex')
	}

	self.generateDeviceID = function(seed) {
        var volatile_seed = "12345"
        var hash = crypto.createHash('md5').update(utf8.encode(seed) + utf8.encode(volatile_seed)).digest('hex')
        return 'android-' + hash.substring(0, 16)
    }

    self.generateSignature = function(data, skip_quote = false) {
        var parsedData
        if (!skip_quote)
            parsedData = encodeURIComponent(data)
        else
            parsedData = data
        var hash = crypto.createHmac('sha256', utf8.encode(self.IG_SIG_KEY)).update(utf8.encode(data)).digest('hex')
        return 'ig_sig_key_version=' + self.SIG_KEY_VERSION + '&signed_body=' + hash + '.' + parsedData
    }

    self.genUUID = function(dash) {
        var uuid = uuidv1()
        if (dash)
            return uuid
        else
            return uuid.replace('-', '')
    }
return self
}