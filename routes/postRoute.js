const express = require('express');
const router = express.Router();
const controller = require('../controllers/postController');
const authenticate = require('../middleware/verify-token');

router.get('/', controller.getAllPosts);
router.get('/:id', controller.getPostById);
router.post('/', authenticate, controller.createPost);
router.put('/:id', authenticate, controller.updatePost);
router.post('/:id/vote', authenticate, controller.vote);
router.post('/:id/comment', authenticate, controller.createComment);
router.delete('/:id', authenticate, controller.deletePost);

module.exports = router;