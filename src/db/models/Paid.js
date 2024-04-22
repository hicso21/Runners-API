import { Schema, model } from 'mongoose';

const paidSchema = new Schema(
	{
		user_id: String,
		createdAt: { type: Date, expires: 2635200 },
	},
	{ timestamps: true }
);

//paidSchema.pre('findOneAndUpdate', function (next) {});

const Paids = model('Paid', paidSchema);

export default Paids;