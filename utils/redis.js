// const redis = require('redis');
// require("dotenv").config();
 
//* Redis 연결
// redis[s]://[[username][:password]@][host][:port][/db-number]
// const redisClient = redis.createClient({
//    url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
//    legacyMode: true,
// });
// redisClient.on('connect', () => {
//    console.info('Redis connected!');
// });
// redisClient.on('error', (err) => {
//    console.error('Redis Client Error', err);
// });
// redisClient.connect().then(); // redis v4 연결 (비동기)
// const redisCli = redisClient.v4;

// module.exports = {redisCli};