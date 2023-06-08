import mongoose from "mongoose";

const connectionString = "mongodb+srv://hicso:thomas2110@runnersdb.kso8gvp.mongodb.net/?retryWrites=true&w=majority";

const db = mongoose
    .connect(connectionString, {
        dbName: 'runners_api',
    })
    .then(() => {
        console.log('DB was connected successfully')
    })
    .catch((err) => {
        console.error(err)
    })

mongoose.Promise = global.Promise

export default db