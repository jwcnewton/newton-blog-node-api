const postModel = require('../models/postModel');

let getAllPosts = () => {
    return postModel.find({}, 'id title description').exec()
        .then(posts => {
            return posts;
        }).catch(err => {
            return err;
        });
}

let getPostById = (postId) => {
    let query = postModel.find({}).where('id', postId);
    return query.exec()
        .then(post => {
            return post;
        }).catch(err => {
            return err;
        });
}

module.exports = {
    getAllPosts,
    getPostById
}
