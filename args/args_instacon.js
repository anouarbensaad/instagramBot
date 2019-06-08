/*Making Of Arguments Options */
var iG_Auth = require('../accounts/instaCon').iG_Auth
// Auth instance.
iG_Auth = new iG_Auth()
// args.
var argv = require('yargs')
    .usage('Usage: $0 -u [login_auth] -p [password_auth] | OPTIONS : -m [Login or Logout] ')
    .option('user',{
        alias:'u',
        describe:'your username'
    })
    .option('mode',{
        alias:'m',
        describe:'mode of connexion \n-login \n-logout',
        default:'login'
    })
    .option('pass',{
        alias:'p',
        describe:'your password'
    })
    .demand(['user','pass'])
    .demandOption(['mode'])
    .argv;

    if (argv.mode == 'login'){
        iG_Auth.login(argv.user, argv.pass)
    }else if (argv.mode == 'logout'){
        iG_Auth.logout()
    }else  
        console.log('\x1b[91m%s\x1b[0m','[-] invalid mode please choose(login/logout)')