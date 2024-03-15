import { Schema, model } from 'mongoose';

const runnerSchema = new Schema(
	{
		brand_id: String,
		name: String,
		email: String,
		password: Object,
		country: String,
		city: String,
		age: String,
		birthday: String,
		weight: String,
		height: String,
		medication: String,
		previous_injuries: String,
		chronic_illnesses: String,
		rest_days: String,
		other_activity: String,
		goals: String,
		bike: Boolean,
		brand: String,
		group: String,
		calendar: Object,
		membership: String,
		membership_timestamp: String,
		token_type: String,
		access_token: String,
		refresh_token: String,
		stripe_id: String,
		message_color: String,
		brevo_id: String,
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
