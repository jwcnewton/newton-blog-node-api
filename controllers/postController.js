const Posts = require('../models/postModel');
const async = require('async');
const opbeat = require('opbeat');
const postRepo = require('../data/postsRepository');
const redisStore = require('../data/redisStore');
const allPostsKey = 'allPosts';

module.exports = function (app) {

    app.get('/posts', function (req, res) {
        async.parallel({
            data: function (callback) {
                redisStore.getKeyValueAsync(allPostsKey).then(function (cachedPosts) {
                    if (cachedPosts === null) {
                        postRepo.getAllPosts().then(function (posts) {
                            if (!posts.length) {
                                callback({ error: post.message }, null);
                            } else {
                                redisStore.emitter.emit('updateStore', allPostsKey, posts);
                                callback(null, posts);
                            }
                        }, function (err) {
                            callback({ error: err, source: "/posts" }, null);
                        });
                    } else {
                        callback(null, cachedPosts);
                    }
                }, function (err) {
                    callback({ error: err, source: "/posts" }, null);
                });
            }
        }, function (err, response) {
            if (err) {
                logException(err);
            }
            return res.json({ error: err, data: response.data });
        });
    });

    app.get('/post/:id', function (req, res) {
        async.parallel({
            data: function (callback) {
                let postId = req.params.id;
                redisStore.getKeyValueAsync(postId).then(function (cachedPost) {
                    if (cachedPost === null) {
                        postRepo.getPostById(postId).then(function (post) {
                            if (!post.length) {
                                callback({ error: post.message }, null);
                            } else {
                                redisStore.emitter.emit('updateStore', postId, post);
                                callback(null, post);
                            }
                        }, function (err) {
                            callback({ error: err, source: "/post" }, null);
                        });
                    } else {
                        callback(null, cachedPost);
                    }
                }, function (err) {
                    callback({ error: err, source: "/posts" }, null);
                });
            }
        }, function (err, response) {
            if (err) {
                logException(err);
            }
            res.json({ error: err, data: response.data });
        });
    });
}

logException = (err) => {
    opbeat.captureError(err);
}

