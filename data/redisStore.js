const redisClient = require('./adapters/redisAdapter');
const EventEmitter = require('events').EventEmitter;

let emitter = new EventEmitter();

emitter.addListener('updateStore', function(key, value) {  
    setKeyValueAsync(key, value);
});

let getKeyValueAsync = (key) => {
    if(!key) {
        return Promise.reject("null key");
    }
    return redisClient.getAsync(key)
        .then((res, err) => err ? Promise.reject(err) : Promise.resolve(JSON.parse(res)));
}

let setKeyValueAsync = (key, value) => {
    return redisClient.setAsync(key, JSON.stringify(value))
        .then((res, err) => err ? Promise.reject(err) : Promise.resolve(res));
};

module.exports = {
    getKeyValueAsync,
    setKeyValueAsync,
    emitter
};
