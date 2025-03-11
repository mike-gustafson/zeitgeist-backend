const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const authenticate = require('../middleware/verify-token');

router.get('/', authenticate, controller.getAllUsers);
router.get('/:id', authenticate, controller.getUserById);
router.post('/:id', authenticate, controller.updateUser);
router.delete('/:id', authenticate, controller.deleteUser);

module.exports = router;
