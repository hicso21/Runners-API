import LoginService from './login.services.js';

class LoginController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await LoginService.login(email);
            if (user.password === password) {
                return res.status(200).send({
                    message: 'Login Successful',
                    user: user
                });
            } else {
                return res.status(401).send({
                    message: 'Invalid Credentials',
                });
            }
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async register(req, res) {
        try {
            const { email, password } = req.body;
            const user = await LoginService.create(email, password);
            return res.status(201).send(user);
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }
}

export default LoginController;