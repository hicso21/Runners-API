import { Schema, model } from "mongoose";

const RunnerSchema = new Schema({
    id: String,
    name: String,
    group: String,
    calendar: Array
})

const Runners = model("Runner", RunnerSchema)

export default Runners