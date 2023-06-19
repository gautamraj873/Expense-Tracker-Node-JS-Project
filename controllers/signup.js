const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
    try{
        const { name, email, password } = req.body;
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            await User.create({ name, email, password: hash });
        })
    }
    catch (error) {
        res.status(500).send( 'Failed to create user' );
    }
};