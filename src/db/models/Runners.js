import { Schema, model } from 'mongoose';

const runnerSchema = new Schema(
	{
		brand_id: String,
		name: String,
		email: String,
		password: String,
		country: String,
		age: String,
		phone: String,
		brand: String,
		group: String,
		calendar: Array,
		membership: String,
		membership_timestamp: String,
		token_type: String,
		access_token: String,
		refresh_token: String,
	},
	{ timestamps: true }
);

//runnerSchema.pre('findOneAndUpdate', function (next) {});

const Runners = model('Runner', runnerSchema);

export default Runners;

/* 
const date = new Date()
calendar : [
	{
		date: date.toLocaleDateString(), -> 20/11/2023
		routine: routine,
		description: ''
	}
]

membership: 'none', 'silver', 'gold' 

*/
