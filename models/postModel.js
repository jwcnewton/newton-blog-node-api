var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    id: String,
    title: String,
    description: String,
    postContext: String,
    postDate: Date,
});

module.exports = mongoose.model('posts', postSchema);