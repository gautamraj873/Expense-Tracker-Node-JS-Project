const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Password = require('../models/password');



exports.forgotPassword = async (req, res) => {
    try {
        const { email } =  req.body;
        const user = await User.findOne({where : { email }});
        if(user){
            const id = uuid.v4();
            await Password.create({ id , active: true, userId: user.id })

            sgMail.setApiKey(process.env.SENDGRID_API_KEY);

            const msg = {
                to: email,
                from: 'gautamraj873@gmail.com',
                subject: 'Reset Your Password',
                text: 'Follow the link to reset your password',
                html: `<a href="http://localhost:3000/password/resetPassword/${id}">Reset Password</a>`,
            }

            const response = await sgMail.send(msg);
            return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', success: true});
        } else {
            throw new Error('User does not exist');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message, success: false });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const id =  req.params.id;
        const forgotPasswordRequest = await Password.findOne({ where : { id }});
        if(forgotPasswordRequest){
            await forgotPasswordRequest.update({ active: false});
            res.status(200).send(`
            <html>
                <script>
                    function formsubmitted(e) {
                        e.preventDefault();
                    }
                </script>

                <form action="/password/updatePassword/${id}" method="POST">
                    <label for="newPassword">Enter New Password</label>
                    <input name="newPassword" type="password" required></input>
                    <button>Reset Password</button>
                </form>
            </html>
            `)
        } else {
            return res.status(404).json({ error: 'Invalid reset password request', success: false });
        }
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ error, success: false });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { resetPasswordId } = req.params;

        const resetPasswordRequest = await Password.findOne({ where : { id: resetPasswordId }});
        if(!resetPasswordRequest){
            return res.status(404).json({ error: 'Invalid reset password request', success: false });
        }
            
        const user = await User.findOne({where: { id : resetPasswordRequest.userId}})
        if(!user) {
            return res.status(404).json({ error: 'No user exists', success: false });
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(newPassword, salt);
        
        await user.update({ password: hash });
        res.status(201).json({ message: 'Successfully updated the new password' });
    } catch(error){
        console.log(error);
        return res.status(403).json({ error, success: false } )
    }
};




