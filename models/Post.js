const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vote = require('./Vote');
const Comment = require('./Comment');

const postSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    votes: [{ type: Schema.Types.ObjectId, ref: 'Vote' }],
    currentVoteTotal: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    createdAt: { type: Date, default: Date.now }
}); 



const Post = mongoose.model('Post', postSchema);

module.exports = Post;