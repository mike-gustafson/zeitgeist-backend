const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 12

const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (userInDatabase) {
            return res.status(400).json({ err: 'Username already exists' });
        }
        const user = await User.create({
            username: req.body.username,
            hashedPassword: bcrypt.hashSync(req.body.password, saltRounds),
        });

        const payload = {
            _id: user._id,
            username: user.username,
        };

        const token = jwt.sign({ payload }, process.env.SECRET);

        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        const passwordCorrect = bcrypt.compareSync(req.body.password, user.hashedPassword);
        if (!passwordCorrect) {
            return res.status(401).json({ error: 'Password incorrect' });
        }
        const payload = {
            _id: user._id,
            username: user.username,
        };
        const token = jwt.sign({ payload }, process.env.SECRET);
        res.status(200).json({ token});
    }
    catch (err) {
        res.status(500).json({ err: err.message })
    }
};
exports.logout = async (req, res) => {
    try {        
        res.status(200).json({ message: 'Logout successful' });
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
}   
