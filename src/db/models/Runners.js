import { Schema, model } from 'mongoose';

const runnerSchema = new Schema({
	brand_id: String,
	name: String,
	email: String,
	password: String,
	age: String,
	brand: String,
	group: String,
	calendar: Array,
	token_type: String,
	access_token: String,
	refresh_token: String,
});

const Runners = model('Runner', runnerSchema);

export default Runners;

/* 
const date = new Date()
calendar : [
	{
		date: date.toLocaleDateString(),
		routine: routine
	}
]

*/
