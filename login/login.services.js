import Login from "../db/models/Login.js";

class LoginService {
    static async login(email) {
        try {
            const user = await Login.findOne({ email });
            return user;
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async create(email, password) {
        try {
            const newUser = new Login({ email, password });
            return await newUser.save();
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }
}

export default LoginService;