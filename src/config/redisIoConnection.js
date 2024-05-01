const IORedis = require("ioredis");

const redisIoConnection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
});

module.exports = redisIoConnection;