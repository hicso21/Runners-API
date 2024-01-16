import mongoose from 'mongoose';

// const url = 'mongodb://mongo:Thomas2110$@runners_db:27017';

const url =
	'mongodb+srv://hicso:thomas2110@runnersdb.kso8gvp.mongodb.net/?retryWrites=true&w=majority';

const db = mongoose
	.connect(url, {
		dbName: 'runners_api',
	})
	.then(() => console.log('DB was connected successfully'))
	.catch((err) => console.error(err));

mongoose.Promise = global.Promise;

export default db;
