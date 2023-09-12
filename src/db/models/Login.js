import { Schema, model } from "mongoose";

const LoginSchema = new Schema({
    email: String,
    password: String
})

const Login = model("login_data", LoginSchema)

export default Login