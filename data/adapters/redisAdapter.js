const redis = require('redis');
const bluebird = require("bluebird");
const opbeat = require('opbeat');

const client = redis.createClient({ host: process.env.NEWTON_BLOG_REDIS_ADD, port: 6379 });

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.auth(process.env.NEWTON_BLOG_REDIS_AUTH);

client.unref();

// If Redis Client throws error
client.on("error", function (err) {
    opbeat.captureError(err);
});

module.exports = client;