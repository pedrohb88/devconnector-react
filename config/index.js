const fs = require('fs');

let env = process.env.NODE_ENV || 'development';

if(env === 'development' || (env === 'test' && fs.existsSync(__dirname+'/config.json'))){
    let config = require('./config.json'); //automatically parses json
    let envConfig = config[env];

    Object.keys(envConfig).forEach((value) => {
        process.env[value] = envConfig[value];
    });
}