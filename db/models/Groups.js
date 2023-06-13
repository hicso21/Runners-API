import { Schema, model } from "mongoose";

const groupsSchema = new Schema({
    name: String,
    users: Array
})

const Groups = model("Group", groupsSchema)

export default Groups