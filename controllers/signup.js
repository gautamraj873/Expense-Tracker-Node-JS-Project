const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.addUser = async (req, res, next) => {
    try{
        const { name, email, password } = req.body;
        const saltrounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltrounds)
        await User.create({ name, email, password: hashedPassword });
        next();
    }
    catch (error) {
        res.status(500).send( 'Failed to create user' );
    }
};