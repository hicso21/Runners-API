import { Schema, model } from 'mongoose';

const garminSchema = new Schema(
	{
		activities: Object,
	},
	{ timestamps: true }
);

const Garmin = model('Garmin', garminSchema, { overwriteModels: false });

export default Garmin;
