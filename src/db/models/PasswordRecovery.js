import { Schema, model } from 'mongoose';

const recoverySchema = new Schema(
	{
		user_id: String,
		code: String,
		email: String,
		createdAt: { type: Date, expires: 900 },
	},
	{ timestamps: true }
);

const Recovery = model('Recovery', recoverySchema);

export default Recovery;
