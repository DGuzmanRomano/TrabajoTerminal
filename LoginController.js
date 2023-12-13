const UserModel = require('../../LoginModel');

const login = (req, res) => {
    const { email, password } = req.body;

    UserModel.authenticate(email, password, (err, user) => {
        if (err) {
            console.error('Error during authentication', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (user) {
            return res.json({
                success: true,
                id: user.id_user,
                name: user.user_name,
                role: user.user_role
            });
        } else {
            return res.status(401).json({ success: false, message: 'Incorrect email or password' });
        }
    });
};

module.exports = {
    login
};
