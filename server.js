var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var InstaAuth = require('./lib/Instagram/accounts/instaAuth')
var ProfileExtractor = require('./lib/Instagram/freindship/profileExtractor')
var FollowEngine = require('./lib/Instagram/freindship/followEngine')
var MediaExtractor = require('./lib/Instagram/media/mediaExtractor')
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = express();


app.set('trust proxy', 1)
InstagramSessions = {}
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

const proxy = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      target: 'http://localhost:8089',
      changeOrigin: true,
    })
  );
};

 
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
 
app.get('/localapi', (req, res, next) => {
  data = {
      isLoggedIn: false,
      userdata: {}
  }
  if (req.session.isLoggedIn) {
      data.isLoggedIn = true
      var AuthSession = InstagramSessions[req.sessionID]
      data.userdata = {
          'userid': AuthSession.userid,
          'username': AuthSession.username,
          'fullname': AuthSession.fullname,
          'profile_pic': AuthSession.profile_pic,
          'token' : AuthSession.token,
      }

  }
  res.json(data)



})


app.post('/login', function(request, response) {
  var username = request.body.username;
  var password = request.body.password;
  var AuthSession = new InstaAuth(username, password)
  AuthSession.login((data) => {
    try {
      if (data.success) {
        request.session.isLoggedIn = true
        InstagramSessions[request.sessionID] = AuthSession
        console.log("Logged in successfully")
        userdata = {
            'userid': AuthSession.userid,
            'username': AuthSession.username,
            'fullname': AuthSession.fullname,
            'profile_pic': AuthSession.profile_pic,
            'token' : AuthSession.token
        }
        response.json({
            success: true,
            message: "Logged in successfully",
            userdata: userdata
        })
      } else {
        response.json({
            success: false,
            message: JSON.parse(data.response)
        })
    }
    } catch (e) {
      console.log(e)
      response.json({
                success: false,
                message: "Something went wrong!"
            })	
    }
  })
});


app.get('/logout', (req, res, next) => {
  if (req.session.isLoggedIn) {
      var AuthSession = InstagramSessions[req.sessionID]
      AuthSession.logout((data) => {
          console.log("Logged in successfully")
          req.session.destroy();
          delete InstagramSessions[req.sessionID]
          res.redirect("/")
      })
  } else
      res.redirect("/")
})


app.get('/freindship/followings', (req, res) => {
  var AuthSession = InstagramSessions[req.sessionID]
  var Extracted = new ProfileExtractor()
  if (req.session.isLoggedIn) {
      Extracted.getFollowings(AuthSession.userid,null, (data) => {
        res.json({
          success: true,
          data: JSON.parse(data)
        })
        console.log(data)
      })
  } else {
      res.json({
          success: false
      })
  }
})

app.get('/freindship/followers', (req, res) => {
  var AuthSession = InstagramSessions[req.sessionID]
  var Extracted = new ProfileExtractor()
  if (req.session.isLoggedIn) {
      Extracted.getfollowers(AuthSession.userid,null, (data) => {
        res.json({
          success: true,
          data: JSON.parse(data)
        })
        console.log(data)
      })
  } else {
      res.json({
          success: false
      })
  }
})

app.get('/user/id', (req, res) => {
  var Extracted = new ProfileExtractor()
  if (req.session.isLoggedIn) {
      Extracted.user_to_id('anouarbensaad', (data) => {
        res.json({
          success: true,
          data: data
        })
      })
  } else {
      res.json({
          success: false
      })
  }
})

app.get('/home', function(request, response) {
    if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.username + '!');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});


app.get('/freindship/unfollow', (req, res) => {
  if (req.session.isLoggedIn) {
    var FreindshipEngine = new FollowEngine()
      console.log(req.query)
      //if (typeof(req.query.uid) != 'undefined') {
          var AuthSession = InstagramSessions[req.sessionID]
          FreindshipEngine.unfollow(AuthSession.userid,req.query.uid, (data) => {
              try {
                  data = JSON.parse(data)
                  if (data.status == "ok") {
                      res.json({
                          success: true,
                          data:data
                      })
                  } else
                      res.json({
                          success: false,
                          data:data
                      })

              } catch (e) {
                  console.log(e)
                  res.json({
                      success: false,
                      data:data
                  })
              }
          })
//      }
//  } else {
//      res.json({
//          success: false
//      })

  }
})

app.get('/freindship/follow', (req, res) => {
  if (req.session.isLoggedIn) {
    var FreindshipEngine = new FollowEngine()
    console.log(req.query)
    if (typeof(req.query.uid) != 'undefined') {
        var AuthSession = InstagramSessions[req.sessionID]
        FreindshipEngine.follow(AuthSession.userid,req.query.uid, (data) => {
          try {
              data = JSON.parse(data)
              if (data.status == "ok") {
                  res.json({
                      success: true,
                      data:data
                  })
              } else
                  res.json({
                      success: false,
                      data:data
                  })
                
          } catch (e) {
              console.log(e)
              res.json({
                  success: false,
                  data:data
              })
          }
        })
      }
  }
})

app.get('/media/likers', (req, res) => {
  var medialikers = new MediaExtractor()
  if (req.session.isLoggedIn) {
    medialikers.mediaLikers('https://www.instagram.com/p/B6biiDFCKC3/', (data) => {
        res.json({
          success: true,
          data: JSON.parse(data.response)
        })
      })
  } else {
      res.json({
          success: false
      })
  }
})

app.get('/media/comments', (req, res) => {
  var mediacomments = new MediaExtractor()
  if (req.session.isLoggedIn) {
    mediacomments.mediaComments('https://www.instagram.com/p/B9CgpjEHk-h/',null, (data) => {
        res.json({
          success: true,
          data: JSON.parse(data.response)
        })
      })
  } else {
      res.json({
          success: false
      })
  }
})

app.listen(8089, function () {
  console.log('Example app listening on port 8089!')
})
