import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const url = process.env.MONGODB_URI;

const db = mongoose
    .connect(url, {
        dbName: 'runners_api',
    })
    .then(() => console.log('DB was connected successfully'))
    .catch((err) => console.error(err));

mongoose.Promise = global.Promise;

export default db;
