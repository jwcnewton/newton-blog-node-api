const Posts = require('../models/postModel');
const async = require('async');

module.exports = function (app) {

    app.get('/posts', function (req, res) {
        async.parallel({
            data: function (callback) {
                Posts.find({}, 'id title description',
                    function (err, allPosts) {
                        if (err) {
                         return callback({ Error: err });
                        }
                         return callback(err, allPosts);
                    });
            }
        },
        function (err, response) {
            return res.json({ error: err, data: response.data })
        });
    });

    app.get('/post/:id', function (req, res) {
        async.parallel({
            data: function (callback) {
                let query = Posts.find({}).where('id', req.params.id);
                query.exec(function (err, post) {
                    if (err) {
                        callback("error");
                    }
                    if (!post.length) {
                        callback("error");
                    }
                    if (post) {
                        callback(err, post);
                    }
                });
            }
        }, function (err, response) {
            if (err) {
                res.status(404) // HTTP status 404: NotFound
                    .send('Not found');
            }
            res.json({
                error: err,
                data: response.data
            })
        });
    });

}

