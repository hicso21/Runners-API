import { Schema, model } from 'mongoose';

const LogSchema = new Schema(
	{
		name: String,
		date: Date,
		description: String,
	},
	{ timestamps: true }
);

const Logs = model('Log', LogSchema);

export default Logs;
