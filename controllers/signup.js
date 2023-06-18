const User = require('../models/user');

exports.createUser = async (req, res) => {
    try{
        const { name, email, password } = req.body;
        await User.create({ name, email, password });
    }
    catch (error) {
        res.status(500).send( 'Failed to create user' );
    }
};