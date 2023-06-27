import { Schema, model } from "mongoose";

const runnerSchema = new Schema({
    brandId: String,
    name: String,
    email: String,
    password: String,
    brand: String,
    group: String,
    calendar: Array
})

const Runners = model("Runner", runnerSchema)

export default Runners