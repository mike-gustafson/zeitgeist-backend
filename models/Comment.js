const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const commentSchema = new Schema({
    text: { type: String, required: true },
    votes: [{ type: Schema.Types.ObjectId, ref: 'Vote' }],
    currentVoteTotal: { type: Number, default: 0 },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;