// https://engineering.linecorp.com/ko/blog/pm2-nodejs/
// https://m.blog.naver.com/skfkgkdlaos/221808008409
// Start order: pm2 start ecosystem.config.js
module.exports = {
    apps: [{
    name: 'index',
    script: './index.js',
    instances: 0,
    exec_mode: 'cluster',
    wait_ready: true,
    listen_timeout: 50000,
    kill_timeout: 5000,
    watch: ["server", "client"],
    watch_delay: 2000,
    time: true,
    }]
  }