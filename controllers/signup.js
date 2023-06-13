const SignUp = require('../models/signup');

exports.createUser = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    try{
        const userData = await SignUp.create({
            name: name,
            email: email,
            password: password
        })
        res.status(201).json({ signUp: userData });
    }
    catch (error) {
        res.status(400).json({error: 'Failed to create user'});
    }
};