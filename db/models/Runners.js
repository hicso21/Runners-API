import { Schema, model } from "mongoose";

const runnerSchema = new Schema({
    id: String,
    name: String,
    brand: String,
    group: String,
    calendar: Array
})

const Runners = model("Runner", runnerSchema)

export default Runners