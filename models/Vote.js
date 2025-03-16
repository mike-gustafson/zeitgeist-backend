const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const { post } = require('../routes/authRoute');

const voteSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vote: {type: Number, enum: [-1, 1], required: true},
});

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;