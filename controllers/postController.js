const Posts = require('../models/postModel');
const async = require('async');
var mongoose = require('mongoose');
const mongoConn = 'mongodb://newtonblog:' + process.env.DB_BLOG_PASSWORD +
    '@newtonblog.documents.azure.com:10255/admin/?ssl=true&replicaSet=globaldb'
module.exports = function (app) {

    app.get('/posts', function (req, res) {
        async.parallel({
            data: function (callback) {

                mongoose.connect(mongoConn);
                var db = mongoose.connection;
                db.on('error', function () {
                    db.close();
                    return callback({ Error: "Mongo Error" });
                });
                db.once('open', function () {
                    Posts.find({}, 'id title description',
                        function (err, allPosts) {
                            if (err) {
                                db.close();
                                return callback({ Error: err });
                            }
                            db.close();
                            return callback(err, allPosts);
                        });
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

                mongoose.connect(mongoConn);
                var db = mongoose.connection;
                db.on('error', function () {
                    db.close();
                    return callback({ Error: "Mongo Error" });
                });
                db.once('open', function () {
                    let query = Posts.find({}).where('id', req.params.id);
                    query.exec(function (err, post) {
                        if (err) {
                            db.close();
                            callback("error");
                        }
                        if (!post.length) {
                            db.close();
                            callback("error");
                        }
                        if (post) {
                            db.close();
                            callback(err, post);
                        }
                    });

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

