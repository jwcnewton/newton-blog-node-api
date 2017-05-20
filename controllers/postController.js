var Posts = require('../models/postModel');


module.exports = function (app) {
    app.get('/posts', function (req, res) {
        Posts.find({}, 'id title description',
            function (err, allPosts) {
                if (err) {
                    return res.json({ data: err });
                } else{
                    return res.json({ data: allPosts });
                }
            }
        )
    });
}