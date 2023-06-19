const path = require('path');
const User = require('../models/user');

//login check
exports.loginCheck = async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.findAll({ where : {email} })
        if(user.length > 0){
            if(user[0].password === password){
                res.status(200).json({success: true, message: "Login successfull"});
            }
            else{
                return res.status(400).json({success: false, message: "Incorrect Password"});
            }
        }
        else{
            return res.status(404).json({success:false, message:"User not found"});
        }
    }
    catch(error){
        res.status(500).json({success:false, message:error});
    }
};