import mongoose, { Schema, Schema } from "mongoose";

const connectionString = "mongodb+srv://hicso:thomas2110@runnersdb.kso8gvp.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(connectionString)
    .then(() => {
        console.log('DB was connected successfully')
    })
    .catch((err) => {
        console.error(err)
    })

const Schema = new Schema()