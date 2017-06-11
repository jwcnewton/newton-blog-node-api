const Posts = require('../models/postModel');
const async = require('async');
const opbeat = require('opbeat');
const postRepo = require('../database/postsRepository');

module.exports = function (app) {

    app.get('/posts', function (req, res) {
        async.parallel({
            data: function (callback) {
                postRepo.getAllPosts().then(function (posts) {
                    callback(null, posts)
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
                postRepo.getPostById(postId).then(function (post) {
                    callback(null, post)
                }, function (err) {
                    callback({ error: err, source: "/post" }, null);
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

