import Activities from '../../../db/models/Activities.js';

class ActivitiesServices {
	static async getAll(user_id) {
		try {
			const activities = await Activities.find({ user_id });
			return activities;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async createActivity(body) {
		try {
			const activity = await Activities.create(body);
			return activity;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async eraseActivity(user_id, date) {
		try {
			const activity = await Activities.findOne({ user_id, date });
			const deletedActivity = await Activities.findByIdAndDelete(
				activity._id
			);
			return deletedActivity;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}
}

export default ActivitiesServices;
