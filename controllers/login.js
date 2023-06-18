const User = require('../models/user');

//login check
// exports.loginCheck = async (req, res) => {
//     const { email, password } = req.body;
//     try{
//         const user = await User.findAll({ where : {email} })
//         if(user.length > 0){
//             if(user[0].password === password){
//                 res.status(200).json({success: true, message: "Login successfull"});
//             }
//             else{
//                 return res.status(400).json({success: false, message: "Incorrect Password"});
//             }
//         }
//         else{
//             return res.status(404).json({success:false, message:"User not found"});
//         }
//     }
//     catch(error){
//         res.status(500).json({success:false, message:error});
//     }
// };


exports.loginCheck = async (req, res) => {
    const { email, password } = req.body;
    
    try {
      const users = await User.findAll({ where: { email: req.body.email } });
  
      if (users.length > 0) {
        let userFound = false;
  
        users.forEach((user) => {
          if (password === user.password) {
            userFound = true;
          }
        });
  
        if (userFound) {
          res.status(200).json({ success: true, message: "Login successful" });
        } else {
          res.status(401).json({ error: "Password doesn't match" });
        }
      } else {
        res.status(404).json({ error: "User doesn't exist" });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
}