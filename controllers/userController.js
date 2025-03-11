const User = require('../models/User');
const { populate } = require('../models/User');

exports.getAllUsers = async (req, res) => {
    console.log("getAllUsers");
    try {
        const users = await User.find({}, "username");
        console.log(users);
        res.json(users);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

exports.getUserById = async (req, res) => {
    try {
        if (req.user._id === req.params.userId){
            const user = await User.findById(req.params.userId);
            // send user to their profile
            return res.json({ user });
        }
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ err: 'User not found.'});
        }
        res.json({ user });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ user });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}   

exports.deleteUser = async (req, res) => {
    try {
        if (req.user._id !== req.params.userId){
            return res.status(403).json({ err: "Unauthorized"});
        }
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ user });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}               