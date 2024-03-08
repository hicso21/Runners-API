import { Schema, model } from 'mongoose';

const TestSchema = new Schema(
	{
		body: Object,
	},
	{ timestamps: true }
);

const Test = model('test', TestSchema);

export default Test;
