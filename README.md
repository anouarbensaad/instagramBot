# InstagramBot 
***
![Plateform](https://img.shields.io/badge/platform-Linux%2FMacOS-red.svg) 
![InstagramBot](https://img.shields.io/badge/InstagramBot-V.1.0.0-yellow.svg?logo=instagram&style=V.1.1.0)
![NODEJSV.](https://img.shields.io/badge/Node.JS-V.8.10.0-green.svg?logo=Node.JS)

 A NodeJS wrapper for the Instagram Bot It works with instagram private api ,It has almost all the features the Instagram app.

### Requirements
***
 - [NodeJS](https://nodejs.org/en/download/)
 - [NPM](https://www.npmjs.com/get-npm)
 - [Mysql](https://support.rackspace.com/how-to/installing-mysql-server-on-ubuntu/)
###### NPM_Packages :
   - [colors](https://www.npmjs.com/package/github-colors)
   - [fs](https://www.npmjs.com/package/fs)
   - [mysql](https://www.npmjs.com/package/mysql)
   - [querystring](https://www.npmjs.com/package/querystring)
   - [request](https://www.npmjs.com/package/request)
   - [utf8](https://www.npmjs.com/package/utf8)
   - [uuid](https://www.npmjs.com/package/uuid)
   - [body-parser](https://www.npmjs.com/package/body-parser)
   - [yargs](https://www.npmjs.com/package/yargs)
 

### Features
***
* [Like](https://github.com/anouarbensaad/InstagramBot/blob/master/media/likeEngine.js)/[unlike](https://github.com/anouarbensaad/InstagramBot/blob/master/media/likeEngine.js) posts 
* [Post](https://github.com/anouarbensaad/InstagramBot/blob/master/media/commentEngine.js)/[Delete](https://github.com/anouarbensaad/InstagramBot/blob/master/media/commentEngine.js) comments
* [Like](https://github.com/anouarbensaad/InstagramBot/blob/master/media/likecomEngine.js)/[unlike](https://github.com/anouarbensaad/InstagramBot/blob/master/media/likecomEngine.js) comments
* [Follow](https://github.com/anouarbensaad/InstagramBot/blob/master/freindship/followEngine.js)/[unfollow](https://github.com/anouarbensaad/InstagramBot/blob/master/freindship/followEngine.js) users
* Get [Followers](https://github.com/anouarbensaad/InstagramBot/blob/master/freindship/profileExtractor.js) / [Following](https://github.com/anouarbensaad/InstagramBot/blob/master/freindship/profileExtractor.js)
* Get [Likers](https://github.com/anouarbensaad/InstagramBot/blob/master/media/mediaExtractor.js) From Media
* Get [Comments](https://github.com/anouarbensaad/InstagramBot/blob/master/media/mediaExtractor.js) / Get [User Tagged](https://github.com/anouarbensaad/InstagramBot/blob/master/media/mediaExtractor.js) From Media.
* Get [User Info](https://github.com/anouarbensaad/InstagramBot/blob/master/feed/userfeed.js) / [Location](https://github.com/anouarbensaad/InstagramBot/blob/master/feed/locationfeed.js) & [More](https://github.com/anouarbensaad/InstagramBot/tree/master/feed) ..

### Installation
***
* Clone the repository. `https://github.com/anouarbensaad/InstagramBot` and switch into the directory `cd InstagramBot`

### Database Config.
***

Modify the database configuration file `common/common_db.js`

```javascript
function IGAPIDB(){
	const self = {}
	var pool  = mysql.createPool({
	  connectionLimit : 10,
	  host:     "<YOUR DB HOSTNAME | LOCALHOST>",
	  user:     "<DB USERNAME>",
	  password: "<DB PASSWORD>",
	  database: "<DATABASE_NAME>",
	  charset:  "utf8mb4_unicode_ci"
	});
```

### Time Config.
***
Change the time at each action for you did not detect

```javascript
setTimeout(function()
    {
      processfollow(source_user,category,resdata,index+1,callback);
    },Math.floor(Math.random()*('???'))+'???');
console.log('\x1b[93m%s\x1b[0m',"[~] Elapsed Time : "+_seconds+" seconds");
```


### Table of Contents
***
- [Connexion](https://github.com/anouarbensaad/InstagramBot/wiki)
- [Media](https://github.com/anouarbensaad/InstagramBot/wiki)
  - [Extract Likers](https://github.com/anouarbensaad/InstagramBot/wiki)/[Comments](https://github.com/anouarbensaad/InstagramBot/wiki)
  - [Like/Unlike](https://github.com/anouarbensaad/InstagramBot/wiki)
  - [Comment](https://github.com/anouarbensaad/InstagramBot/wiki)
- [Freindship](https://github.com/anouarbensaad/InstagramBot/wiki)
  - [Extract Followers/Following](https://github.com/anouarbensaad/InstagramBot/wiki)
  - [Follow/Unfollow](https://github.com/anouarbensaad/InstagramBot/wiki)
- [Feed](https://github.com/anouarbensaad/InstagramBot/wiki)
- [Location](https://github.com/anouarbensaad/InstagramBot/wiki)

### License
***
[MIT](LICENSE)
