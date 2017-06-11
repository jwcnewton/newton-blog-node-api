var mongoDB = require('../database/mongoAdapter');

var postSchema = mongoDB.Schema({
    id: String,
    title: String,
    description: String,
    postContext: String,
    postDate: Date,
    embededLinks: [{
        id: String,
        link: String
    }]
});

module.exports = mongoDB.model('posts', postSchema);