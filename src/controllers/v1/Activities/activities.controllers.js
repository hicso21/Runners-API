import ActivitiesServices from '../../../services/v1/Activities/activities.services.js';

class ActivitiesControllers {
	static async getAll(req, res) {
		const { user_id } = req.params;
		try {
			const activities = await ActivitiesServices.getAll(user_id);
			res.send(activities);
		} catch (error) {
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async postActivity(req, res) {
		const body = req.body;
		try {
			const newActivity = await ActivitiesServices.createActivity(body);
			res.send(newActivity);
		} catch (error) {
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async deleteActivity(req, res) {
		const { user_id, date } = req.body;
		try {
			const deletedActivity = await ActivitiesServices.eraseActivity(
				user_id,
				date
			);
			res.send(deletedActivity);
		} catch (error) {
			res.send({
				error: true,
				data: error,
			});
		}
	}
}

export default ActivitiesControllers;
