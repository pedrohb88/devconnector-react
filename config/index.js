let env = process.env.NODE_ENV || 'development';

console.log('ENV: ', env);

if(env === 'development' || env === 'test'){
    let config = require('./config.json'); //automatically parses json
    let envConfig = config[env];

    Object.keys(envConfig).forEach((value) => {
        process.env[value] = envConfig[value];
    });
}