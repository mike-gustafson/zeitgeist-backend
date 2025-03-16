const { isObjectIdOrHexString } = require('mongoose');
const Post = require('../models/Post');
const Comment = require('../models/Post');
const User = require('../models/User');
const { populate } = require('../models/User');
const Vote = require('../models/Vote');


exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('votes').populate('user', 'username')
        let postsWithUserVote = posts;
        if (req.user && req.user._id) {
          postsWithUserVote = posts.map(post => {
            const userVote = post.votes.find(vote => String(vote.user) === String(req.user._id));
            return {
                ...post.toObject(),
                currentUserVote: userVote ? userVote.vote : null
            };
          });
        }
        
        res.status(200).json({ posts: postsWithUserVote });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

exports.getTopPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json({ post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.getPostComments = async (req, res) => {
  try {
      const post = await Post.findById(req.params.id)
      .populate({ 
          path: 'comments',
          populate: {
              path: 'user',
              select: 'username',
          },
      })
      res.status(200).json({ comments: post.comments });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
}

exports.createPost = async (req, res) => {
  try {
    const { title, description, link } = req.body;
    if (!title || !link) {
      return res.status(400).json({ error: 'Both title and link are required.' });
    }
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'User is not authenticated.' });
    }
    const post = await Post.create({
      title,
      link,
      description,
      user: req.user._id
    });
    const io = req.app.get('io');
    if (io) {
      req.app.get('io').emit('newPost', { post: post });
    }   

    return res.status(201).json({ post });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req
            .params.id, req.body, { new: true });
        post.user.username = req.body.username;
        const io = req.app.get('io');
        if (io) {
          req.app.get('io').emit('postUpdated', { post: post });
        }   
        return res.status(201).json({ post });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}  

exports.vote = async (req, res) => {
    try {
        const postId = req.params.id;
        const { voteValue } = req.body;
        const existingVote = await Vote.findOne({ user: req.user._id, post: postId });
        if (existingVote) {
            if (existingVote.vote === voteValue) {
                return res.status(400).json({ error: 'User has already voted on this post.' });
            }
            await Vote.findByIdAndDelete(existingVote._id);
            const post = await Post.findById(postId);
            post.currentVoteTotal -= existingVote.vote;
            await post.save();
        }
        const vote = new Vote({ post: postId , vote: voteValue, user: req.user._id });
        await vote.save();

        const post = await Post.findById(postId);
        post.votes.push(vote._id);
        post.currentVoteTotal += voteValue;
        await post.save();

        const io = req.app.get('io');
        if (io) {
            req.app.get('io').emit('vote', { postId: post._id, newVoteTotal: post.currentVoteTotal });
        }

        res.status(200).json({ post });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

exports.deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);

        const io = req.app.get('io');
        if (io) {
          req.app.get('io').emit('postDeleted', { postId: req.params.id });
        }
        
        res.status(200).json({ message: 'Post deleted' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
