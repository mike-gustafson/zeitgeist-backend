const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voteSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vote: {type: Number, enum: [-1, 1], required: true}
});

const commentSchema = new Schema({
    text: String,
    votes: [voteSchema],
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

const postSchema = new Schema({
    title: { type: String, required: true },
    link: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    votes: { 'up': Number, 'down': Number },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]

}); 

const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Post, Comment };