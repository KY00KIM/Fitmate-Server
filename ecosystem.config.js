// https://engineering.linecorp.com/ko/blog/pm2-nodejs/
module.exports = {
    apps: [{
    name: 'index',
    script: './index.js',
    instances: 0,
    exec_mode: 'cluster'
    }]
  }