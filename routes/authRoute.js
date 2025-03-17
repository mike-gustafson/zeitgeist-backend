const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const authenticate = require('../middleware/verify-token');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.put('/edit', authenticate, controller.editUser);

module.exports = router;