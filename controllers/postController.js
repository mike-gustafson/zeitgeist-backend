const { Post } = require('../models/postModel');
const Comment = require('../models/postModel');
const User = require('../models/User');
const { populate } = require('../models/User');

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
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
        const { title, link } = req.body;
        if (!title || !link) {
          return res.status(400).json({ error: 'Both title and link are required.' });
        }

        if (!req.user || !req.user._id) {
          return res.status(401).json({ error: 'User is not authenticated.' });
        }
        const post = await Post.create({
          title,
          link,
          user: req.user._id
        });
    
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
        res.status(200).json({ post });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}       

exports.deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Post deleted' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
